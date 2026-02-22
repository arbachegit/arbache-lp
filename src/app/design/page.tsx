'use client'

import Link from 'next/link'
import './design.css'

// Spec annotation component
function Spec({ font, color, size, extra }: { font?: string; color?: string; size?: string; extra?: string }) {
  return (
    <span className="spec-annotation">
      {font && <span className="spec-font">{font}</span>}
      {color && <span className="spec-color" style={{ color: color }}>{color}</span>}
      {size && <span className="spec-size">{size}</span>}
      {extra && <span className="spec-extra">{extra}</span>}
    </span>
  )
}

export default function DesignPage() {
  return (
    <div className="lp-clone">
      {/* ========== HEADER ========== */}
      <header className="clone-header">
        <div className="clone-container clone-header-inner">
          <div className="clone-logo">
            <Spec font="Cinzel" color="#FFFFFF" size="1.1rem" extra="tracking: 0.2em" />
            <span className="logo-text">ARBACHE CONSULTING</span>
          </div>
          <nav className="clone-nav">
            {['Propósito', 'Quem Somos', 'Ecossistema', 'Soluções', 'ESG', 'Contato'].map((link) => (
              <span key={link} className="clone-nav-link">
                <Spec font="Montserrat" color="rgba(255,255,255,0.8)" size="0.75rem" extra="uppercase" />
                <span>{link}</span>
              </span>
            ))}
          </nav>
        </div>
        <div className="section-bg-spec">bg: #0A0A0A/95 · backdrop-blur: 10px · hover: #DAC6B5</div>
      </header>

      {/* ========== HERO ========== */}
      <section className="clone-hero">
        <div className="clone-hero-overlay" />
        <div className="clone-hero-content">
          <div className="section-bg-spec">
            bg: linear-gradient(135deg, rgba(0,0,0,0.78), rgba(26,26,26,0.55)) over image
          </div>

          <div className="clone-headline">
            <Spec font="Cinzel (.font-hero)" color="#FFFFFF" size="30px" extra="uppercase · tracking: 0.15em · leading: 1.4" />
            <div className="headline-lines">
              <span>Linha 1: Educação de Liderança nos move</span>
              <span>Linha 2: Inovação impulsiona resultados</span>
              <span>Linha 3: Sustentabilidade transforma o ser humano e os negócios</span>
            </div>
          </div>

          <div className="clone-tagline">
            <Spec font="Cormorant Garamond (.font-tagline)" color="rgba(255,255,255,0.85)" size="clamp(1rem,2.5vw,1.4rem)" extra="italic" />
            <p>Tagline descritiva com texto elegante em itálico</p>
          </div>

          <div className="clone-buttons">
            <div className="clone-btn clone-btn-primary">
              <Spec font="Montserrat" color="#FFFFFF" size="0.85rem" extra="uppercase · tracking: 0.08em" />
              <span>BOTÃO PRIMÁRIO</span>
              <small>bg: #000000 → hover: #333</small>
            </div>
            <div className="clone-btn clone-btn-secondary">
              <Spec font="Montserrat" color="#FFFFFF" size="0.85rem" extra="uppercase" />
              <span>BOTÃO SECUNDÁRIO</span>
              <small>border: rgba(255,255,255,0.3) → hover: bg #DAC6B5</small>
            </div>
          </div>

          <div className="clone-badges">
            {['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4'].map((badge) => (
              <span key={badge} className="clone-badge">
                <Spec font="Montserrat" color="rgba(255,255,255,0.6)" size="0.65rem" extra="uppercase · tracking: 0.12em" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROPÓSITO ========== */}
      <section className="clone-proposito">
        <div className="section-bg-spec">bg: linear-gradient(135deg, #3a3a3a, #1a1a1a)</div>
        <div className="clone-container">
          <div className="clone-section-header">
            <div className="title-block">
              <Spec font="Playfair Display (.font-section)" color="#DAC6B5" size="clamp(1.8rem,3.5vw,2.8rem)" />
              <h2>Nosso Propósito</h2>
            </div>
            <div className="subtitle-block">
              <Spec font="Cormorant Garamond (.font-tagline)" color="rgba(255,255,255,0.85)" size="1.5rem" extra="italic" />
              <p>&ldquo;Citação inspiradora em itálico&rdquo;</p>
            </div>
          </div>

          <div className="clone-cards">
            <div className="clone-card clone-card-glass">
              <div className="card-spec">bg: rgba(255,255,255,0.08) · border: rgba(255,255,255,0.1) · backdrop-blur: 4px</div>
              <div className="card-title">
                <Spec font="Playfair Display" color="#DAC6B5" size="1.3rem" />
                <h3>Título do Card</h3>
              </div>
              <div className="card-text">
                <Spec font="Lato" color="rgba(255,255,255,0.8)" size="0.95rem" />
                <p>Texto descritivo do card com conteúdo explicativo</p>
              </div>
            </div>
            <div className="clone-card clone-card-glass">
              <div className="card-title">
                <Spec font="Playfair Display" color="#DAC6B5" size="1.3rem" />
                <h3>Título do Card</h3>
              </div>
              <div className="card-text">
                <Spec font="Lato" color="rgba(255,255,255,0.8)" size="0.95rem" />
                <p>Texto descritivo do card com conteúdo explicativo</p>
              </div>
            </div>
          </div>

          <div className="clone-counters">
            {[
              { num: '4.000+', label: 'Líderes' },
              { num: '20+', label: 'Anos' },
              { num: '11', label: 'Livros' },
              { num: '2023', label: 'SDG Pioneer' },
            ].map((counter) => (
              <div key={counter.label} className="clone-counter">
                <div className="counter-num">
                  <Spec font="Cinzel" color="#DAC6B5" size="2.8rem" extra="bold" />
                  <span>{counter.num}</span>
                </div>
                <div className="counter-label">
                  <Spec font="Montserrat" color="rgba(255,255,255,0.6)" size="0.7rem" extra="uppercase · tracking: 0.12em" />
                  <span>{counter.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="clone-valores">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="clone-valor">
                <div className="valor-spec">border-left: 3px solid #DAC6B5 · bg: rgba(255,255,255,0.06)</div>
                <div className="valor-title">
                  <Spec font="Lato" color="#DAC6B5" extra="bold" />
                  <strong>Título</strong>
                </div>
                <div className="valor-desc">
                  <Spec font="Lato" color="rgba(255,255,255,0.8)" />
                  <span>— Descrição do valor</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== QUEM SOMOS ========== */}
      <section className="clone-quem-somos">
        <div className="section-bg-spec light">bg: #FFFFFF</div>
        <div className="clone-container">
          <div className="clone-section-header light">
            <div className="title-block">
              <Spec font="Playfair Display (.font-section)" color="#000000" size="clamp(1.8rem,3.5vw,2.8rem)" />
              <h2>Quem Somos</h2>
            </div>
            <div className="subtitle-block">
              <Spec font="Cormorant Garamond (.font-tagline)" color="#808080" size="clamp(1rem,2vw,1.25rem)" extra="italic" />
              <p>Subtítulo descritivo da seção</p>
            </div>
          </div>

          <div className="clone-team">
            {[
              { gradient: 'linear-gradient(135deg, #DAC6B5, #c4a68f)', name: 'Membro 1' },
              { gradient: 'linear-gradient(135deg, #4a6fa5, #2c4a7c)', name: 'Membro 2' },
              { gradient: 'linear-gradient(135deg, #6b8e6b, #4a6b4a)', name: 'Membro 3' },
              { gradient: 'linear-gradient(135deg, #8b7355, #6b5544)', name: 'Membro 4' },
            ].map((member) => (
              <div key={member.name} className="clone-team-card">
                <div className="team-card-bg">bg: #EDE3DA · hover: translate-y -1.5 + shadow</div>
                <div className="team-image" style={{ background: member.gradient }}>
                  <span className="gradient-label">{member.gradient}</span>
                </div>
                <div className="team-content">
                  <div className="team-name">
                    <Spec font="Playfair Display" color="#000000" size="1.15rem" />
                    <h3>Nome da Pessoa</h3>
                  </div>
                  <div className="team-role">
                    <Spec font="Montserrat" color="#808080" size="0.7rem" extra="uppercase · tracking: 0.08em" />
                    <span>CARGO · ESPECIALIDADE</span>
                  </div>
                  <div className="team-quote">
                    <Spec font="Cormorant Garamond (.font-tagline)" color="#555555" size="0.95rem" extra="italic" />
                    <p>&ldquo;Citação inspiradora&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ECOSSISTEMA ========== */}
      <section className="clone-ecossistema">
        <div className="section-bg-spec light">bg: #EDE3DA</div>
        <div className="clone-container">
          <div className="clone-section-header light">
            <div className="title-block">
              <Spec font="Playfair Display (.font-section)" color="#000000" size="clamp(1.8rem,3.5vw,2.8rem)" />
              <h2>Nosso Ecossistema</h2>
            </div>
            <div className="subtitle-block">
              <Spec font="Cormorant Garamond (.font-tagline)" color="#808080" size="clamp(1rem,2vw,1.25rem)" extra="italic" />
              <p>Subtítulo descritivo da seção</p>
            </div>
          </div>

          <div className="clone-svg-area">
            <div className="svg-spec">SVG viewBox: 0 0 800 600</div>

            <div className="svg-center-node">
              <div className="node-spec">fill: #0A0A0A · stroke: #DAC6B5 (2.5px) · animation: pulse 3s</div>
              <Spec font="Cinzel" color="#FFFFFF" size="13px" extra="semibold · tracking: 1px" />
              <span>ARBACHE CONSULTING</span>
            </div>

            <div className="svg-lines-spec">
              <span>Linhas de conexão:</span>
              <code>stroke: #DAC6B5 · opacity: 0.5 · stroke-width: 1.5 · animation: dashFlow 2s infinite</code>
            </div>

            <div className="svg-nodes-grid">
              {[
                { color: '#3B82F6', stroke: '#2563EB', label: 'Educação' },
                { color: '#2D6A4F', stroke: '#1B4332', label: 'Sustentabilidade' },
                { color: '#DC2626', stroke: '#991B1B', label: 'Liderança' },
                { color: '#9333EA', stroke: '#6B21A8', label: 'Inovação' },
                { color: '#EAB308', stroke: '#A16207', label: 'Carreira' },
                { color: '#F97316', stroke: '#C2410C', label: 'Experiências' },
                { color: '#22C55E', stroke: '#15803D', label: 'Voluntariado' },
                { color: '#3B82F6', stroke: '#1D4ED8', label: 'RH' },
              ].map((node) => (
                <div key={node.label} className="svg-node" style={{ background: node.color }}>
                  <div className="node-color-spec">
                    fill: {node.color} · stroke: {node.stroke}
                  </div>
                  <Spec font="Lato" color="#FFFFFF" size="11px" extra="bold" />
                  <span>{node.label}</span>
                  <small>animation: opacity 4s infinite</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <section className="clone-contato">
        <div className="section-bg-spec">bg: #0A0A0A</div>
        <div className="clone-container">
          <div className="clone-section-header">
            <div className="title-block">
              <Spec font="Playfair Display (.font-section)" color="#FFFFFF" size="clamp(1.8rem,3.5vw,2.8rem)" />
              <h2>Fale Conosco</h2>
            </div>
            <div className="subtitle-block">
              <Spec font="Cormorant Garamond (.font-tagline)" color="rgba(255,255,255,0.6)" size="clamp(1rem,2vw,1.25rem)" extra="italic" />
              <p>Subtítulo descritivo</p>
            </div>
          </div>

          <div className="clone-contato-grid">
            <div className="clone-form">
              <div className="form-field">
                <div className="field-label">
                  <Spec font="Montserrat" color="rgba(255,255,255,0.6)" size="0.7rem" extra="uppercase · tracking: 0.08em" />
                  <label>LABEL DO CAMPO</label>
                </div>
                <div className="field-input">
                  <div className="input-spec">bg: rgba(255,255,255,0.06) · border: rgba(255,255,255,0.12) · focus: border-#DAC6B5</div>
                  <Spec font="Lato" color="#FFFFFF" />
                  <input placeholder="Placeholder do input" disabled />
                </div>
              </div>
              <div className="form-field">
                <div className="field-label">
                  <Spec font="Montserrat" color="rgba(255,255,255,0.6)" size="0.7rem" />
                  <label>LABEL DO SELECT</label>
                </div>
                <div className="field-input">
                  <select disabled><option>Selecione...</option></select>
                </div>
              </div>
              <div className="form-field">
                <div className="field-label">
                  <Spec font="Montserrat" color="rgba(255,255,255,0.6)" size="0.7rem" />
                  <label>LABEL TEXTAREA</label>
                </div>
                <div className="field-input">
                  <textarea disabled placeholder="Texto longo..."></textarea>
                </div>
              </div>
              <div className="clone-submit">
                <div className="submit-spec">bg: #DAC6B5 · hover: #c4a68f · text: #000000</div>
                <Spec font="Montserrat" color="#000000" size="0.85rem" extra="uppercase · tracking: 0.08em" />
                <span>ENVIAR MENSAGEM</span>
              </div>
            </div>

            <div className="clone-info">
              <div className="info-title">
                <Spec font="Playfair Display" color="#FFFFFF" size="1.3rem" />
                <h3>Arbache Consulting</h3>
              </div>
              <div className="info-text">
                <Spec font="Lato" color="rgba(255,255,255,0.7)" size="0.95rem" />
                <p>Endereço e informações</p>
              </div>
              <div className="info-links">
                <Spec font="Lato" color="#DAC6B5" extra="hover: underline" />
                <span>contato@arbache.com</span>
                <span>WhatsApp</span>
                <span>LinkedIn</span>
              </div>
              <div className="clone-quote">
                <div className="quote-spec">bg: rgba(255,255,255,0.06) · border-left: 3px solid #DAC6B5</div>
                <div className="quote-text">
                  <Spec font="Cormorant Garamond (.font-tagline)" color="rgba(255,255,255,0.8)" size="1.1rem" extra="italic" />
                  <p>&ldquo;Citação inspiradora&rdquo;</p>
                </div>
                <div className="quote-author">
                  <Spec font="Lato" color="#DAC6B5" size="0.85rem" />
                  <span>— Autor da citação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="clone-footer">
        <div className="section-bg-spec">bg: #000000</div>
        <div className="clone-container clone-footer-inner">
          <div className="footer-logo">
            <Spec font="Cinzel" color="#FFFFFF" size="0.9rem" extra="tracking: 0.2em" />
            <span>ARBACHE CONSULTING</span>
          </div>
          <div className="footer-links">
            {['Propósito', 'Equipe', 'Soluções', 'ESG', 'Contato'].map((link) => (
              <span key={link} className="footer-link">
                <Spec font="Montserrat" color="rgba(255,255,255,0.4)" size="0.75rem" extra="uppercase · hover: #DAC6B5" />
                <span>{link}</span>
              </span>
            ))}
          </div>
          <div className="footer-copy">
            <Spec font="Lato" color="rgba(255,255,255,0.5)" size="0.8rem" />
            <span>© 2026 Arbache Consulting. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* ========== LEGEND SIDEBAR ========== */}
      <aside className="design-legend">
        <h2>Guia de Fontes</h2>

        <div className="legend-section">
          <h3>Tipografia</h3>
          <div className="legend-fonts">
            <div className="legend-font">
              <span className="font-demo font-cinzel">Cinzel</span>
              <span className="font-usage">Logo, Hero, Contadores</span>
            </div>
            <div className="legend-font">
              <span className="font-demo font-playfair">Playfair Display</span>
              <span className="font-usage">Títulos de seção (.font-section)</span>
            </div>
            <div className="legend-font">
              <span className="font-demo font-cormorant">Cormorant Garamond</span>
              <span className="font-usage">Taglines, citações (.font-tagline)</span>
            </div>
            <div className="legend-font">
              <span className="font-demo font-montserrat">MONTSERRAT</span>
              <span className="font-usage">Labels, botões, nav (.font-ui)</span>
            </div>
            <div className="legend-font">
              <span className="font-demo font-lato">Lato</span>
              <span className="font-usage">Corpo de texto, descrições</span>
            </div>
          </div>
        </div>

        <div className="legend-section">
          <h3>Paleta de Cores</h3>
          <div className="legend-colors">
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#DAC6B5' }} />
              <span className="color-info">
                <strong>Primary</strong>
                <code>#DAC6B5</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#EDE3DA' }} />
              <span className="color-info">
                <strong>Secondary</strong>
                <code>#EDE3DA</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#0A0A0A' }} />
              <span className="color-info">
                <strong>Dark</strong>
                <code>#0A0A0A</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#000000' }} />
              <span className="color-info">
                <strong>Black</strong>
                <code>#000000</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#FFFFFF', border: '1px solid #ddd' }} />
              <span className="color-info">
                <strong>White</strong>
                <code>#FFFFFF</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#808080' }} />
              <span className="color-info">
                <strong>Gray</strong>
                <code>#808080</code>
              </span>
            </div>
            <div className="legend-color">
              <span className="color-chip" style={{ background: '#c4a68f' }} />
              <span className="color-info">
                <strong>Primary Hover</strong>
                <code>#c4a68f</code>
              </span>
            </div>
          </div>
        </div>

        <Link href="/" className="back-link">
          ← Voltar para o Site
        </Link>
      </aside>
    </div>
  )
}
