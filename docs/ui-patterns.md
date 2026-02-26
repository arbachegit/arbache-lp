# UI Patterns & Visual Effects

## SVG Diagram Animations (ecosystem.css)

### Arc Loader (rotating border)
- **Class**: `.node__arc--animated`
- **Animation**: `ecosystem-arc-rotate` — rotaciona 360deg, 3.6s linear infinite
- **Stroke**: `stroke-dasharray` parcial + gradiente `#arcGradient` (efeito "cauda" luminosa)
- **Hover/active**: acelera para 2.4s, opacidade sobe de 0.3 para 0.7
- **Nome tecnico**: Spinning arc loader / rotating arc

### Dash Flow (marching ants nas linhas de conexao)
- **Class**: `.ecosystem__link`
- **Animation**: `ecosystem-dash-flow` — `stroke-dashoffset: -20`, 3s linear infinite
- **Stroke**: `stroke-dasharray: 6 4` (tracejado animado)
- **Nome tecnico**: Marching ants / animated dashed stroke

### Dot (bolinha orbitante)
- **Class**: `.node__dot` (`Ecossistema.tsx:390-398`)
- **Animacao**: SVG nativo `<animateMotion>` percorrendo path circular (clockwise, flag `0 1 1`)
- **Duracao**: 3.6s normal, 2.4s no hover/active (mesma do arc)
- **Visual**: Bolinha r=4 com fill `var(--dotHex)` orbitando o no
- **Relacao com Arc**: Ambos giram clockwise mas com dasharray/posicao inicial diferentes, criando ilusao de sentidos opostos

### Hub Pulse
- **Class**: `.ecosystem__hub--pulse`
- **Animation**: `ecosystem-hub-pulse` — scale pulse no no central

### Radar Pulse (Agent Button)
- **Animation**: `ecosystemRadarPulse` — scale + opacity pulse no botao flutuante

## Accessibility
- Todas as animacoes respeitam `prefers-reduced-motion: reduce`
