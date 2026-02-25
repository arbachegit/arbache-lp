// ===================================
// AGENT CONTENT — hardcoded per-section data
// Badges, suggestions, summaries, FAQ
// ===================================

export interface SectionContent {
  id: string
  title: string
  callout: [string, string, string]
  summary: string
  badges: string[]
  suggestions: string[]
  keywords: string[]
  context: string
}

export const SECTIONS: Record<string, SectionContent> = {
  hero: {
    id: 'hero',
    title: 'Hero',
    callout: ['Tem dúvidas?', 'Pergunte à', 'nossa IA'],
    summary:
      'A Arbache Consulting transforma organizações por meio da educação de liderança, inovação e sustentabilidade. Fundada por Ana Paula Arbache, PhD e SDG Pioneer da ONU.',
    badges: ['Educação Corporativa', 'Liderança', 'ESG', 'Inovação'],
    suggestions: [
      'O que a Arbache Consulting faz?',
      'Quem é Ana Paula Arbache?',
      'Quais serviços vocês oferecem?',
      'Como posso entrar em contato?',
    ],
    keywords: ['arbache', 'consultoria', 'educação', 'liderança', 'sustentabilidade'],
    context: 'Página inicial',
  },

  proposito: {
    id: 'proposito',
    title: 'Propósito',
    callout: ['Nosso Propósito', 'Pergunte à', 'nossa IA'],
    summary:
      'Nosso propósito é transformar o mundo por meio da educação. Acreditamos na excelência, personalização, ética e valores compartilhados como pilares fundamentais.',
    badges: ['Missão', 'Visão', 'Valores', 'Excelência'],
    suggestions: [
      'Qual a missão da Arbache?',
      'Quais são os valores da empresa?',
      'O que diferencia a Arbache das demais consultorias?',
    ],
    keywords: ['propósito', 'missão', 'visão', 'valores', 'excelência', 'ética'],
    context: 'Missão, visão e valores',
  },

  'quem-somos': {
    id: 'quem-somos',
    title: 'Quem Somos',
    callout: ['Conheça a equipe', 'Pergunte à', 'nossa IA'],
    summary:
      'A equipe Arbache reúne especialistas com décadas de experiência em educação corporativa, tecnologia, gestão e sustentabilidade. Liderados por Ana Paula Arbache, PhD e SDG Pioneer da ONU.',
    badges: ['Ana Paula Arbache', 'Fernando Arbache', 'Alexandre Vieira', 'Fernando Bastos'],
    suggestions: [
      'Qual a formação da Ana Paula Arbache?',
      'Quem são os especialistas da equipe?',
      'Quais são as áreas de expertise do time?',
    ],
    keywords: ['equipe', 'time', 'ana paula', 'fernando', 'especialistas', 'fundadora'],
    context: 'Equipe e fundadores',
  },

  'nosso-ecossistema': {
    id: 'nosso-ecossistema',
    title: 'Nosso Ecossistema',
    callout: ['Nosso Ecossistema', 'Pergunte à', 'nossa IA'],
    summary:
      'O ecossistema Arbache integra seis pilares: Educação Corporativa, Liderança, Gestão de Carreira, RH, Inovação e IA, e ESG. Cada pilar oferece soluções especializadas e complementares.',
    badges: ['Educação Corporativa', 'Liderança', 'Gestão de Carreira', 'RH', 'Inovação e IA', 'ESG'],
    suggestions: [
      'Quais são os pilares do ecossistema?',
      'Como funciona a integração entre os pilares?',
      'Qual pilar é ideal para minha empresa?',
      'Como a IA se integra ao ecossistema?',
    ],
    keywords: ['ecossistema', 'pilares', 'educação', 'liderança', 'carreira', 'rh', 'ia', 'esg'],
    context: 'Ecossistema de soluções integradas',
  },

  'solucoes-org': {
    id: 'solucoes-org',
    title: 'Soluções para Organizações',
    callout: ['Nossas Soluções', 'Pergunte à', 'nossa IA'],
    summary:
      'Oferecemos 11 soluções integradas: Trilhas Educacionais, Curadoria, Formação de Lideranças, Assessment com IA, Consultoria ESG, Mentoria de Alto Impacto, Auditorias, Imersões, Networking, Gestão de RH e Palestras.',
    badges: ['Trilhas Educacionais', 'Assessment IA', 'Mentoria', 'Formação de Lideranças', 'Palestras'],
    suggestions: [
      'Como funcionam as trilhas educacionais?',
      'O que é o Assessment de Soft Skills com IA?',
      'Quais tipos de mentoria vocês oferecem?',
      'Como contratar uma palestra corporativa?',
    ],
    keywords: [
      'soluções', 'trilhas', 'assessment', 'mentoria', 'palestras',
      'liderança', 'auditoria', 'imersão', 'consultoria', 'rh',
    ],
    context: 'Soluções e serviços para organizações',
  },

  colabs: {
    id: 'colabs',
    title: 'Co.Labs',
    callout: ['Nossos Parceiros', 'Pergunte à', 'nossa IA'],
    summary:
      'O Co.Labs é o laboratório de inovação e colaboração da Arbache. Reunimos parceiros como Resorts Brasil, MIT, Senac, Escola de Etiqueta e Hotelier News para criar soluções de alto impacto.',
    badges: ['Resorts Brasil', 'MIT', 'Senac', 'Escola de Etiqueta', 'Hotelier News'],
    suggestions: [
      'Quem são os parceiros da Arbache?',
      'Como funciona o Co.Labs?',
      'Qual a parceria com o MIT?',
      'Como se tornar parceiro?',
    ],
    keywords: ['parceiros', 'colabs', 'co.labs', 'mit', 'senac', 'resorts', 'colaboração'],
    context: 'Parcerias e laboratório de inovação',
  },

  esg: {
    id: 'esg',
    title: 'ESG',
    callout: ['ESG e Impacto', 'Pergunte à', 'nossa IA'],
    summary:
      'A Arbache é referência em ESG com iniciativas como o HubMulher, Knowledge Hub e reconhecimento como SDG Pioneer pela ONU. Atuamos com sustentabilidade, diversidade e impacto social.',
    badges: ['HubMulher', 'Knowledge Hub', 'SDG Pioneer', 'Sustentabilidade'],
    suggestions: [
      'O que é o HubMulher?',
      'Qual o papel da Arbache nos ODS da ONU?',
      'Como a Arbache atua em sustentabilidade?',
      'O que é o Knowledge Hub?',
    ],
    keywords: ['esg', 'sustentabilidade', 'hubmulher', 'ods', 'onu', 'sdg', 'diversidade', 'impacto'],
    context: 'ESG, sustentabilidade e impacto social',
  },

  contato: {
    id: 'contato',
    title: 'Contato',
    callout: ['Fale Conosco', 'Pergunte à', 'nossa IA'],
    summary:
      'Entre em contato para saber mais sobre nossas soluções em Educação Corporativa, ESG, Mentoria e Palestras. Agende uma conversa com nossa equipe.',
    badges: ['Fale Conosco', 'Agende uma Conversa'],
    suggestions: [
      'Como agendar uma reunião?',
      'Quais soluções são ideais para minha empresa?',
      'Vocês atendem empresas de qual porte?',
      'Qual o investimento médio dos programas?',
    ],
    keywords: ['contato', 'falar', 'agendar', 'reunião', 'proposta', 'investimento'],
    context: 'Formulário de contato e agendamento',
  },
}

// ===================================
// FAQ — respostas instantâneas sem API
// ===================================

export const FAQ: Record<string, string> = {
  'o que a arbache faz':
    'A Arbache Consulting oferece soluções integradas em educação corporativa, liderança, ESG e sustentabilidade. Ajudamos organizações a desenvolver pessoas, transformar culturas e gerar impacto positivo. Quer saber mais sobre alguma solução específica?',

  'quem é ana paula arbache':
    'Ana Paula Arbache é a fundadora e CEO da Arbache Consulting. É PhD, SDG Pioneer reconhecida pela ONU, e especialista em educação corporativa, liderança e sustentabilidade. Com mais de duas décadas de experiência, lidera projetos de transformação organizacional no Brasil e no exterior.',

  'como entrar em contato':
    'Você pode entrar em contato pelo formulário na seção Contato do nosso site. Nossa equipe retorna em até 24h úteis. Temos soluções para empresas de todos os portes.',

  'quais serviços vocês oferecem':
    'Oferecemos 11 soluções integradas: Trilhas Educacionais, Curadoria de Conteúdo, Formação de Lideranças, Assessment de Soft Skills com IA, Consultoria ESG, Mentoria de Alto Impacto, Auditorias, Imersões Técnicas, Networking, Gestão de RH e Palestras Corporativas.',

  'o que é o hubmulher':
    'O HubMulher é uma iniciativa da Arbache voltada para o empoderamento feminino e liderança da mulher no mercado de trabalho. Promovemos eventos, mentorias e conteúdos que fortalecem a presença feminina em posições de liderança.',

  'o que é o colabs':
    'O Co.Labs é o laboratório de inovação e colaboração da Arbache Consulting. Reunimos parceiros estratégicos como MIT, Senac, Resorts Brasil e Hotelier News para criar soluções de alto impacto em educação e liderança.',

  'qual a missão da arbache':
    'Nossa missão é transformar organizações e pessoas por meio da educação de excelência. Acreditamos que a combinação de liderança, sustentabilidade e inovação é o caminho para resultados extraordinários.',

  'quais são os valores da empresa':
    'Nossos valores são: Excelência em tudo que fazemos, Personalização das soluções, Ética e transparência, Inovação contínua e Impacto positivo na sociedade.',

  'como funciona o assessment com ia':
    'O Assessment de Soft Skills com IA é uma ferramenta que mapeia competências comportamentais usando inteligência artificial. Oferece diagnósticos precisos e planos de desenvolvimento personalizados para equipes e líderes.',

  'como funcionam as trilhas educacionais':
    'As Trilhas Educacionais são programas personalizados de aprendizagem contínua. Combinamos master classes, workshops práticos e acompanhamento para desenvolver competências específicas alinhadas aos objetivos da sua organização.',

  'quem são os parceiros':
    'Nossos principais parceiros incluem MIT, Senac, Resorts Brasil, Escola de Etiqueta, Hotelier News, entre outros. Cada parceria potencializa nosso ecossistema de soluções integradas.',

  'vocês atendem empresas de qual porte':
    'Atendemos empresas de todos os portes — de startups a grandes corporações. Nossas soluções são personalizadas e escaláveis conforme a necessidade de cada organização.',

  'o que é esg':
    'ESG significa Environmental, Social and Governance (Ambiental, Social e Governança). Na Arbache, somos referência em consultoria ESG, ajudando empresas a implementar práticas sustentáveis, promover diversidade e melhorar sua governança corporativa.',

  'qual o papel da arbache nos ods':
    'Ana Paula Arbache é reconhecida como SDG Pioneer pela ONU, reforçando nosso compromisso com os Objetivos de Desenvolvimento Sustentável. Atuamos diretamente em educação de qualidade, igualdade de gênero e trabalho decente.',

  'como agendar uma reunião':
    'Para agendar uma reunião, preencha o formulário na seção Contato do nosso site indicando a solução de interesse. Nossa equipe entrará em contato em até 24h úteis para alinhar a melhor data.',
}

// ===================================
// HELPERS
// ===================================

/** Tenta encontrar uma resposta FAQ a partir de matching fuzzy. */
export function matchFAQ(message: string): string | null {
  const lower = message.toLowerCase().trim()
  for (const [key, answer] of Object.entries(FAQ)) {
    if (lower.includes(key) || key.includes(lower)) {
      return answer
    }
  }
  return null
}

/** Retorna a seção padrão (hero) se não encontrada. */
export function getSection(sectionId: string | undefined): SectionContent {
  return SECTIONS[sectionId || 'hero'] || SECTIONS.hero
}
