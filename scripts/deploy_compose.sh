#!/usr/bin/env bash
# deploy_compose.sh - Deploy Deterministico com Docker Compose
#
# VARIAVEIS OBRIGATORIAS (via env):
#   IMAGE_NAME        - Nome da imagem GHCR (ex: ghcr.io/arbachegit/arbache-api)
#   IMAGE_TAG         - Tag SHA (ex: sha-2f3a1b4c5d6e)
#   PERPLEXITY_API_KEY
#   ANTHROPIC_API_KEY
#   OPENAI_API_KEY
#
# USO: IMAGE_NAME=... IMAGE_TAG=... ./deploy_compose.sh

set -euo pipefail

# Garantir PATH inclui docker (SSH nao-interativo pode nao ter)
source ~/.bashrc 2>/dev/null || source ~/.profile 2>/dev/null || true
export PATH="/usr/bin:/usr/local/bin:/snap/bin:$PATH"

# ============================================
# CONFIGURACAO
# ============================================
PROJECT_DIR="${PROJECT_DIR:-/var/www/arbache-lp-api}"
COMPOSE_FILE="docker-compose.prod.yml"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-120}"
LAST_GOOD_FILE="${PROJECT_DIR}/.last_good_tag"

# ============================================
# VALIDACAO
# ============================================
if [[ -z "${IMAGE_NAME:-}" ]]; then
    echo "[ERROR] IMAGE_NAME nao definido"
    exit 1
fi

if [[ -z "${IMAGE_TAG:-}" ]]; then
    echo "[ERROR] IMAGE_TAG nao definido"
    exit 1
fi

echo "============================================"
echo "DEPLOY DETERMINISTICO"
echo "============================================"
echo "IMAGE:     ${IMAGE_NAME}:${IMAGE_TAG}"
echo "PROJECT:   ${PROJECT_DIR}"
echo "============================================"

# ============================================
# FUNCOES
# ============================================

save_current_tag() {
    if [[ -f "${PROJECT_DIR}/.env" ]]; then
        local current
        current=$(grep -E "^IMAGE_TAG=" "${PROJECT_DIR}/.env" 2>/dev/null | cut -d'=' -f2 || echo "")
        if [[ -n "${current}" && "${current}" != "${IMAGE_TAG}" ]]; then
            echo "${current}" > "${LAST_GOOD_FILE}"
            echo "[INFO] Tag anterior salva: ${current}"
        fi
    fi
}

rollback() {
    echo "[ERROR] ============================================"
    echo "[ERROR] DEPLOY FALHOU - INICIANDO ROLLBACK"
    echo "[ERROR] ============================================"

    if [[ -f "${LAST_GOOD_FILE}" ]]; then
        local previous
        previous=$(cat "${LAST_GOOD_FILE}")
        echo "[WARN] Revertendo para: ${previous}"

        cd "${PROJECT_DIR}"
        export IMAGE_TAG="${previous}"
        docker compose -f "${COMPOSE_FILE}" pull --quiet 2>/dev/null || true
        docker compose -f "${COMPOSE_FILE}" up -d --force-recreate --remove-orphans 2>/dev/null || true

        echo "[WARN] Rollback executado para ${previous}"
    else
        echo "[ERROR] Nenhuma tag anterior para rollback"
    fi

    exit 1
}

trap rollback ERR

wait_for_health() {
    echo "[INFO] Aguardando healthcheck (timeout: ${HEALTH_TIMEOUT}s)..."
    local start
    start=$(date +%s)

    while true; do
        local now elapsed
        now=$(date +%s)
        elapsed=$((now - start))

        if [[ ${elapsed} -gt ${HEALTH_TIMEOUT} ]]; then
            echo "[ERROR] Timeout aguardando health"
            docker logs arbache-lp-api --tail 30 2>&1 || true
            return 1
        fi

        local status
        status=$(docker inspect --format='{{.State.Health.Status}}' arbache-lp-api 2>/dev/null || echo "starting")

        case "${status}" in
            "healthy")
                echo "[OK] Container healthy (${elapsed}s)"
                return 0
                ;;
            "unhealthy")
                echo "[ERROR] Container unhealthy"
                docker logs arbache-lp-api --tail 30 2>&1 || true
                return 1
                ;;
            *)
                if [[ $((elapsed % 10)) -eq 0 ]]; then
                    echo "[INFO] Status: ${status} (${elapsed}s)"
                fi
                sleep 3
                ;;
        esac
    done
}

# ============================================
# EXECUCAO
# ============================================

cd "${PROJECT_DIR}"

# 1. Salvar tag atual para rollback
save_current_tag

# 2. Escrever .env
cat > "${PROJECT_DIR}/.env" << EOF
IMAGE_NAME=${IMAGE_NAME}
IMAGE_TAG=${IMAGE_TAG}
PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY:-}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
OPENAI_API_KEY=${OPENAI_API_KEY:-}
EOF
chmod 600 "${PROJECT_DIR}/.env"
echo "[OK] .env atualizado: IMAGE_TAG=${IMAGE_TAG}"

# 3. Pull da imagem (SEMPRE do registry, nunca local)
echo "[INFO] Pulling ${IMAGE_NAME}:${IMAGE_TAG}..."
docker compose -f "${COMPOSE_FILE}" pull
echo "[OK] Pull concluido"

# 4. Recriar container (force-recreate garante nova imagem)
echo "[INFO] Recriando container..."
docker compose -f "${COMPOSE_FILE}" up -d --force-recreate --remove-orphans
echo "[OK] Container recriado"

# 5. Verificar imagem do container
RUNNING_IMAGE=$(docker inspect --format='{{.Config.Image}}' arbache-lp-api 2>/dev/null || echo "")
if [[ "${RUNNING_IMAGE}" != *"${IMAGE_TAG}"* ]]; then
    echo "[ERROR] Container rodando imagem errada!"
    echo "  Esperado: *${IMAGE_TAG}*"
    echo "  Atual:    ${RUNNING_IMAGE}"
    exit 1
fi
echo "[OK] Imagem correta: ${RUNNING_IMAGE}"

# 6. Aguardar healthcheck
wait_for_health

# 7. Salvar como ultimo deploy bom
echo "${IMAGE_TAG}" > "${LAST_GOOD_FILE}"

# 8. Limpar imagens antigas (mantendo 3 ultimas)
echo "[INFO] Limpando imagens antigas..."
docker image prune -f > /dev/null 2>&1 || true

echo "============================================"
echo "DEPLOY CONCLUIDO COM SUCESSO"
echo "============================================"
echo "IMAGE: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "============================================"
