import '@testing-library/jest-dom'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LanguageProvider, translations } from '@/contexts/LanguageContext'
import Page from '../page'

function renderPage() {
  return render(
    <LanguageProvider>
      <Page />
    </LanguageProvider>,
  )
}

const VELA_PROJECTS = [
  'SuaArena Torneios',
  'SuaArena Arenas',
  'SuaArena Ferinos',
  'AmeConsulta',
  'Gonix',
  'Vela Connect',
  'SuaArena Design System',
]

// A lista curta da seção Vela mostra só os produtos no ar (o Design System fica no card).
const VELA_LIVE_PRODUCTS = VELA_PROJECTS.filter((title) => title !== 'SuaArena Design System')

const CAREER_PROJECTS = [
  'Suprema Gaming & Co.',
  'Cobasi & SPet (Accurate Software)',
  'GM Propostas (Accurate Software)',
]

describe('Portfolio Page', () => {
  describe('Navbar', () => {
    it('renders the floating navigation with section links', () => {
      renderPage()
      const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
      expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '#projetos')
      expect(within(nav).getByRole('link', { name: 'Como trabalho' })).toHaveAttribute('href', '#servicos')
      expect(within(nav).getByRole('link', { name: 'Experiência' })).toHaveAttribute('href', '#experiencia')
      expect(within(nav).getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato')
    })

    it('switches the whole page to English', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByRole('button', { name: 'Switch to English' }))
      expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Real software, running in production.')
      expect(screen.getByText('Selected work')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Mudar para Português' })).toBeInTheDocument()
      screen.getAllByRole('link', { name: /Download CV/ }).forEach((link) => expect(link).toHaveAttribute('href', '/cv_en.pdf'))
    })

    it('renders the dark/light theme toggle (dark by default)', () => {
      renderPage()
      expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
    })
  })

  describe('Vela Studio', () => {
    it('presents the software house with its products and commercial contacts', () => {
      renderPage()
      const vela = within(document.getElementById('vela') as HTMLElement)
      expect(vela.getByRole('heading', { level: 2 })).toHaveTextContent('Vela Studio, minha software house.')
      expect(vela.getByText(/Tiro empresas do papel, da planilha e do sistema improvisado/)).toBeInTheDocument()
      expect(vela.getByText('2026')).toBeInTheDocument()
      expect(vela.getByText('Itajaí, SC')).toBeInTheDocument()
      expect(vela.getAllByAltText('Logo da Vela Studio')).toHaveLength(2)

      VELA_LIVE_PRODUCTS.forEach((title) => {
        expect(vela.getByRole('link', { name: (name) => name.startsWith(title) })).toHaveAttribute('href', expect.stringMatching(/^#projeto-/))
      })
      expect(vela.queryByRole('link', { name: /Design System/ })).not.toBeInTheDocument()
      // Sem descrição de produto aqui: o detalhe mora no card.
      expect(vela.queryByText(/500/)).not.toBeInTheDocument()

      expect(vela.getByRole('link', { name: /^Site: velastudio.com.br/ })).toHaveAttribute('href', 'https://velastudio.com.br')
      expect(vela.getByRole('link', { name: /@velastudiobr/ })).toHaveAttribute('href', 'https://www.instagram.com/velastudiobr/')
      expect(vela.getByRole('link', { name: /Conversar com a Vela no WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/5547997356490')
      expect(vela.getByRole('link', { name: /contato@velastudio.com.br/ })).toHaveAttribute('href', 'mailto:contato@velastudio.com.br')
    })

    it('never exposes CNPJ or address', () => {
      expect(JSON.stringify(translations)).not.toMatch(/CNPJ da Vela|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)
    })
  })

  describe('Mobile menu', () => {
    const ALL_SECTIONS = ['Início', 'Projetos', 'Vela Studio', 'Números', 'Como trabalho', 'Experiência', 'Contato']

    it('opens from the hamburger with every section, language, theme, CV and contact CTA', async () => {
      const user = userEvent.setup()
      renderPage()
      const trigger = screen.getByRole('button', { name: 'Abrir menu' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)
      const dialog = await screen.findByRole('dialog', { name: 'Menu' })
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      const menu = within(dialog)
      const sections = within(menu.getByRole('navigation', { name: 'Seções' }))
      ALL_SECTIONS.forEach((label) => expect(sections.getByRole('link', { name: new RegExp(label) })).toBeInTheDocument())
      expect(sections.getByRole('link', { name: /Vela Studio/ })).toHaveAttribute('href', '#vela')

      expect(within(menu.getByRole('group', { name: 'Idioma' })).getByRole('button', { name: 'PT' })).toHaveAttribute('aria-pressed', 'true')
      expect(within(menu.getByRole('group', { name: 'Tema' })).getByRole('button', { name: 'Escuro' })).toHaveAttribute('aria-pressed', 'true')
      expect(menu.getByRole('link', { name: /Baixar CV/ })).toHaveAttribute('download')
      expect(menu.getByRole('link', { name: /Falar comigo/ })).toHaveAttribute('href', '#contato')
      expect(menu.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
    })

    it('closes when a section link is clicked', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
      const dialog = await screen.findByRole('dialog', { name: 'Menu' })
      await user.click(within(dialog).getByRole('link', { name: /Experiência/ }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('closes with Esc and switches language from inside the panel', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
      const dialog = await screen.findByRole('dialog', { name: 'Menu' })
      await user.click(within(dialog).getByRole('button', { name: 'EN' }))
      expect(within(dialog).getByRole('button', { name: 'Close menu' })).toBeInTheDocument()
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
    })
  })

  describe('Hero', () => {
    it('renders the display title and the LinkedIn role', () => {
      renderPage()
      expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Software de verdade, rodando em produção.')
      expect(screen.getByText('Desenvolvedor Front-End Sênior')).toBeInTheDocument()
      const hero = document.getElementById('inicio') as HTMLElement
      expect(within(hero).getByText(/Construo interfaces e produtos que gente de verdade usa todo dia/)).toBeInTheDocument()
    })

    it('does not repeat the first paragraph of the about section', () => {
      expect(translations.pt.hero.description).not.toBe(translations.pt.experience.about[0])
      expect(translations.pt.hero.description).not.toMatch(/9 anos de experiência em React/)
      expect(translations.en.hero.description).not.toMatch(/9 years of experience in React/)
    })

    it('renders the portrait photo with a localized alt', async () => {
      const user = userEvent.setup()
      renderPage()
      const hero = document.getElementById('inicio') as HTMLElement
      const photo = within(hero).getByRole('img', { name: /Retrato de Eduardo dos Santos/ })
      expect(photo).toHaveAttribute('src', expect.stringContaining('eduardo-santos.jpg'))
      await user.click(screen.getByRole('button', { name: 'Switch to English' }))
      expect(within(hero).getByRole('img', { name: /Portrait of Eduardo dos Santos/ })).toBeInTheDocument()
    })

    it('renders the HUD with location, timezone and availability', () => {
      renderPage()
      expect(screen.getByText('Itajaí, SC · Remoto')).toBeInTheDocument()
      expect(screen.getByText(/GMT-3/)).toBeInTheDocument()
      expect(screen.getByText('Aberto a vagas e projetos')).toBeInTheDocument()
    })

    it('renders the CTAs, including the CV download', () => {
      renderPage()
      expect(screen.getByRole('link', { name: /Ver projetos/ })).toHaveAttribute('href', '#projetos')
      expect(screen.getByRole('link', { name: 'Falar comigo' })).toHaveAttribute('href', '#contato')
      const cvLinks = screen.getAllByRole('link', { name: /Baixar CV/ })
      cvLinks.forEach((link) => {
        expect(link).toHaveAttribute('download')
        expect(link).toHaveAttribute('href', '/cv.pdf')
      })
    })
  })

  describe('Stack marquee', () => {
    it('renders the stack logos', () => {
      renderPage()
      const stack = screen.getByRole('region', { name: 'Stack em produção' })
      expect(within(stack).getAllByText('React').length).toBeGreaterThan(0)
      expect(within(stack).getAllByText('Next.js').length).toBeGreaterThan(0)
    })
  })

  describe('Projects', () => {
    it('renders every featured project, Vela Studio first', () => {
      renderPage()
      const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
      const all = [...VELA_PROJECTS, ...CAREER_PROJECTS]
      all.forEach((title) => expect(titles).toContain(title))
      expect(titles.indexOf('SuaArena Torneios')).toBeLessThan(titles.indexOf('Suprema Gaming & Co.'))
    })

    it('shows the project status in Portuguese', () => {
      renderPage()
      const projects = within(document.getElementById('projetos') as HTMLElement)
      expect(projects.getAllByText('No ar').length).toBe(6)
      expect(projects.queryByText('Live')).not.toBeInTheDocument()
      expect(projects.queryByText('Em dev')).not.toBeInTheDocument()
      expect(projects.getByText('Publicado')).toBeInTheDocument()
      expect(projects.getAllByText('Entregue').length).toBe(3)
    })

    it('links each project to the same URL featured on LinkedIn', () => {
      renderPage()
      expect(screen.getByRole('link', { name: 'Ver projeto: SuaArena Torneios' })).toHaveAttribute('href', 'https://suaarena.com.br')
      expect(screen.getByRole('link', { name: 'Ver projeto: SuaArena Arenas' })).toHaveAttribute('href', 'https://interno.suaarena.com.br')
      expect(screen.getByRole('link', { name: 'Ver projeto: AmeConsulta' })).toHaveAttribute('href', 'https://exames.ameconsulta.com.br')
      expect(screen.getByRole('link', { name: 'Ver projeto: SuaArena Ferinos' })).toHaveAttribute('href', 'https://ferinos.suaarena.com.br/torneios')
      expect(screen.getByRole('link', { name: 'Ver projeto: Vela Connect' })).toHaveAttribute('href', 'https://velaconnect.com.br')
    })

    it('renders the Design System as a styled card without screenshot', () => {
      renderPage()
      expect(screen.queryByAltText('Screenshot do projeto SuaArena Design System')).not.toBeInTheDocument()
      expect(screen.getByText('Pacote npm privado, sem página pública')).toBeInTheDocument()
      expect(screen.getByAltText('Screenshot do projeto Gonix')).toHaveAttribute('src', '/images/projetos/gonix.png')
    })

    it('shows the short line and the problem, with the rest behind an accessible toggle', async () => {
      const user = userEvent.setup()
      renderPage()
      const card = within(document.getElementById('projeto-torneios') as HTMLElement)
      expect(card.getByText(/Torneios de areia com chave, placar e ranking ao vivo/)).toBeVisible()
      expect(card.getByText('Problema')).toBeInTheDocument()
      expect(card.getByText(/inscrição por mensagem, chave montada à mão/)).toBeVisible()

      const toggle = card.getByRole('button', { name: 'Ver como fiz' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      const details = document.getElementById(toggle.getAttribute('aria-controls') as string) as HTMLElement
      expect(details).not.toBeVisible()

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAccessibleName('Fechar detalhes')
      expect(details).toBeVisible()
      ;['Solução', 'Como fiz', 'Resultado'].forEach((label) => expect(within(details).getByText(label)).toBeInTheDocument())
      expect(within(details).getByText(/Mais de 500 competições/)).toBeInTheDocument()

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    it('omits the outcome block when there is no real outcome', async () => {
      const user = userEvent.setup()
      renderPage()
      const card = within(document.getElementById('projeto-suprema') as HTMLElement)
      await user.click(card.getByRole('button', { name: 'Ver como fiz' }))
      expect(card.getByText('Como fiz')).toBeInTheDocument()
      expect(card.queryByText('Resultado')).not.toBeInTheDocument()
    })

    it('keeps the stack chips true to the role in each project', () => {
      renderPage()
      const ame = within(document.getElementById('projeto-ameconsulta') as HTMLElement)
      expect(ame.queryByText('NestJS')).not.toBeInTheDocument()
      expect(ame.getByText('Express')).toBeInTheDocument()
      const cobasi = within(document.getElementById('projeto-cobasi') as HTMLElement)
      expect(cobasi.queryByText('MongoDB')).not.toBeInTheDocument()
      expect(cobasi.queryByText('Node.js')).not.toBeInTheDocument()
      const suprema = within(document.getElementById('projeto-suprema') as HTMLElement)
      expect(suprema.getByText('Azure')).toBeInTheDocument()
    })

    it('filters by group', async () => {
      const user = userEvent.setup()
      renderPage()
      const projects = within(document.getElementById('projetos') as HTMLElement)
      await user.click(screen.getByRole('button', { name: 'Carreira' }))
      expect(screen.getByRole('button', { name: 'Carreira' })).toHaveAttribute('aria-pressed', 'true')
      CAREER_PROJECTS.forEach((title) => expect(projects.getByRole('heading', { name: title })).toBeInTheDocument())
      expect(projects.queryByRole('heading', { name: 'SuaArena Torneios' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Vela Studio' }))
      expect(projects.getByRole('heading', { name: 'SuaArena Torneios' })).toBeInTheDocument()
      expect(projects.queryByRole('heading', { name: 'Suprema Gaming & Co.' })).not.toBeInTheDocument()
    })
  })

  describe('Numbers', () => {
    it('only uses the facts published on LinkedIn', () => {
      renderPage()
      expect(screen.getByText('anos de experiência com front-end')).toBeInTheDocument()
      expect(screen.getByText('em Core Web Vitals no e-commerce da Cobasi')).toBeInTheDocument()
      expect(screen.getByText('anos e 7 meses em apostas esportivas de alto tráfego')).toBeInTheDocument()
      expect(screen.getByText('competições realizadas no SuaArena Torneios')).toBeInTheDocument()
    })
  })

  describe('Services', () => {
    it('renders the "how I work" bento grid, without the Vela sales card', () => {
      renderPage()
      const section = within(document.getElementById('servicos') as HTMLElement)
      expect(section.getByText('No que sou forte')).toBeInTheDocument()
      ;['Arquitetura front-end', 'Performance', 'Design System', 'APIs e regras de negócio', 'Liderança técnica', 'Testes e qualidade'].forEach((title) => {
        expect(section.getByRole('heading', { name: title })).toBeInTheDocument()
      })
      expect(section.queryByText(/Produto sob medida/)).not.toBeInTheDocument()
    })
  })

  describe('Experience', () => {
    it('renders the 7 LinkedIn experiences in order', () => {
      renderPage()
      const section = document.getElementById('experiencia') as HTMLElement
      const companies = within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
      expect(companies).toEqual([
        'Sobre mim',
        'Accurate Software',
        'Vela Studio',
        'Suprema Gaming & Co.',
        'Arena 22',
        'Accurate Software',
        'Superare',
        'Studio Visual',
      ])
      expect(within(section).getByText('Desenvolvedor Front-End Sênior | Liderança Técnica')).toBeInTheDocument()
      expect(within(section).getByText('Jan/2026 · Atual')).toBeInTheDocument()
      expect(within(section).getByText('Mai/2017 · Nov/2017')).toBeInTheDocument()
    })

    it('keeps the Vela experience to role and scope in 3 bullets', () => {
      const vela = translations.pt.experience.items.find((item) => item.company === 'Vela Studio')
      expect(vela?.points).toHaveLength(3)
      expect(JSON.stringify(vela)).not.toMatch(/500|FisioAnalysis/)
    })

    it('renders the about column with education and languages', () => {
      renderPage()
      expect(screen.getByText(/Centro Universitário FAM/)).toBeInTheDocument()
      expect(screen.getByText('Português (nativo) · Inglês B2')).toBeInTheDocument()
    })
  })

  describe('Contact form', () => {
    it('renders the fields and direct links', () => {
      renderPage()
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Mensagem')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /eduardosantosj2@gmail.com/ })).toHaveAttribute('href', 'mailto:eduardosantosj2@gmail.com')
      expect(screen.getAllByRole('link', { name: /LinkedIn/ })[0]).toHaveAttribute('href', 'https://www.linkedin.com/in/eduardo-santos-jacinto')
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByRole('button', { name: /enviar mensagem/i }))
      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeInTheDocument()
        expect(screen.getByText('E-mail inválido.')).toBeInTheDocument()
        expect(screen.getByText('Mensagem deve ter pelo menos 10 caracteres.')).toBeInTheDocument()
      })
    })

    it('submits valid data to the contact API', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock
      const user = userEvent.setup()
      renderPage()
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva')
      await user.type(screen.getByPlaceholderText('E-mail'), 'joao@email.com')
      await user.type(screen.getByPlaceholderText('Mensagem'), 'Mensagem de teste com mais de 10 caracteres')
      await user.click(screen.getByRole('button', { name: /enviar mensagem/i }))
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }))
      })
    })
  })

  describe('Footer and accessibility', () => {
    it('renders copyright and location', () => {
      renderPage()
      expect(screen.getByText(`© ${new Date().getFullYear()} Eduardo dos Santos Jacinto`)).toBeInTheDocument()
      expect(screen.getByText('Itajaí, SC, Brasil')).toBeInTheDocument()
    })

    it('renders the skip link to the main content', () => {
      renderPage()
      expect(screen.getByText('Pular para o conteúdo principal')).toHaveAttribute('href', '#conteudo')
      expect(document.getElementById('conteudo')?.tagName).toBe('MAIN')
    })
  })

  describe('Content rules', () => {
    it('never uses the em dash in any text', () => {
      expect(JSON.stringify(translations)).not.toContain(String.fromCharCode(0x2014))
    })

    it('never says 7+ years anymore', () => {
      expect(JSON.stringify(translations)).not.toMatch(/7\+/)
    })

    it('uses a single name for Gonix', () => {
      expect(JSON.stringify(translations)).not.toMatch(/FisioAnalys/i)
    })

    it('never calls Vela Connect clients paying customers', () => {
      expect(JSON.stringify(translations)).not.toMatch(/pagantes|paying/i)
    })

    it('never says the Ferinos app is published', () => {
      const ferinos = translations.pt.projects.items.find((item) => item.title === 'SuaArena Ferinos')
      expect(ferinos?.result).toMatch(/a caminho/)
      expect(JSON.stringify(ferinos)).not.toMatch(/app (está )?publicado|na loja/i)
    })

    it('keeps PT and EN with the same structure', () => {
      const shape = (obj: unknown): unknown =>
        Array.isArray(obj) ? obj.length : obj && typeof obj === 'object'
          ? Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, shape(v)]))
          : typeof obj
      expect(shape(translations.en)).toEqual(shape(translations.pt))
    })
  })
})
