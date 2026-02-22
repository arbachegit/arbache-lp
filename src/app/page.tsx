import {
  Header,
  Hero,
  Proposito,
  QuemSomos,
  Ecossistema,
  SolucoesOrganizacoes,
  CoLabs,
  ESG,
  Contato,
  Footer,
  AgentButton,
} from '@/components/sections'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Proposito />
        <QuemSomos />
        <Ecossistema />
        <SolucoesOrganizacoes />
        <CoLabs />
        <ESG />
        <Contato />
      </main>
      <Footer />
      <AgentButton />
    </>
  )
}
