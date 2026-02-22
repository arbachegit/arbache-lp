# Arbache LP Backend - Setup no Droplet

## 1. Criar Diretório no Servidor

```bash
ssh deploy@137.184.159.216

# Criar estrutura
sudo mkdir -p /var/www/arbache-lp-api
sudo chown deploy:deploy /var/www/arbache-lp-api
```

## 2. Configurar DNS

Adicionar registro A no DNS:
- **api.arbache.com** → 137.184.159.216

## 3. Configurar SSL (Let's Encrypt)

```bash
# Instalar certbot se não tiver
sudo apt install certbot python3-certbot-nginx -y

# Gerar certificado
sudo certbot certonly --nginx -d api.arbache.com
```

## 4. Configurar Nginx

```bash
# Copiar config
sudo cp /var/www/arbache-lp-api/nginx-api.conf /etc/nginx/sites-available/arbache-api

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/arbache-api /etc/nginx/sites-enabled/

# Testar config
sudo nginx -t

# Recarregar
sudo systemctl reload nginx
```

## 5. Configurar GitHub Secrets

No repositório arbache-lp, adicionar os secrets:

```
PERPLEXITY_API_KEY=pplx-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
```

## 6. Deploy Manual (primeira vez)

```bash
cd /var/www/arbache-lp-api

# Criar .env
cat > .env << 'EOF'
PERPLEXITY_API_KEY=pplx-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
EOF
chmod 600 .env

# Build e run
docker compose build
docker compose up -d

# Verificar
docker compose ps
curl http://localhost:8001/health
```

## 7. Verificar Deploy

```bash
# Testar localmente
curl http://localhost:8001/health

# Testar externamente (após Nginx + SSL)
curl https://api.arbache.com/health

# Testar chat
curl -X POST https://api.arbache.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Quem é Ana Paula Arbache?"}'
```

## 8. Atualizar Frontend

No `.env.local` do frontend:

```
NEXT_PUBLIC_API_URL=https://api.arbache.com
```

## Estrutura Final

```
/var/www/arbache-lp/          # Frontend estático (Next.js export)
├── current -> releases/sha-xxx/
└── releases/

/var/www/arbache-lp-api/      # Backend FastAPI
├── main.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env
```

## Troubleshooting

### Container não inicia
```bash
docker compose logs arbache-api
```

### Nginx 502 Bad Gateway
```bash
# Verificar se container está rodando
docker compose ps

# Verificar se porta está listening
ss -tlnp | grep 8001
```

### SSL não funciona
```bash
# Verificar certificado
sudo certbot certificates

# Renovar se necessário
sudo certbot renew
```
