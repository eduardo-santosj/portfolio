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
  'Gonix (FisioAnalysis)',
  'Vela Connect',
  'SuaArena Design System',
]

const CAREER_PROJECTS = [
  'Suprema Gaming & Co.',
  'Cobasi & SPet (Accurate Software)',
  'GM Propostas Comerciais (Accurate Software)',
]

describe('Portfolio Page', () => {
  describe('Navbar', () => {
    it('renders the floating navigation with section links', () => {
      renderPage()
      const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
      expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '#projetos')
      expect(within(nav).getByRole('link', { name: 'Serviços' })).toHaveAttribute('href', '#servicos')
      expect(within(nav).getByRole('link', { name: 'Experiência' })).toHaveAttribute('href', '#experiencia')
      expect(within(nav).getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato')
    })

    it('switches the whole page to English', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByRole('button', { name: 'Switch to English' }))
      expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Real software, running in production.')
      expect(screen.getByText('Featured projects')).toBeInTheDocument()
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

      VELA_PROJECTS.forEach((title) => {
        expect(vela.getByRole('link', { name: (name) => name.startsWith(title) })).toHaveAttribute('href', expect.stringMatching(/^#projeto-/))
      })

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
    const ALL_SECTIONS = ['Início', 'Projetos', 'Vela Studio', 'Números', 'Serviços', 'Experiência', 'Contato']

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
      expect(within(hero).getByText(/9 anos de experiência em React, Next.js e TypeScript/)).toBeInTheDocument()
    })

    it('renders the HUD with location, timezone and availability', () => {
      renderPage()
      expect(screen.getByText('Itajaí, SC · Remoto')).toBeInTheDocument()
      expect(screen.getByText(/GMT-3/)).toBeInTheDocument()
      expect(screen.getByText('Disponível para projetos')).toBeInTheDocument()
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

    it('shows the project status in mono labels', () => {
      renderPage()
      const projects = within(document.getElementById('projetos') as HTMLElement)
      expect(projects.getAllByText('Live').length).toBe(6)
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
      expect(screen.getByAltText('Screenshot do projeto Gonix (FisioAnalysis)')).toHaveAttribute('src', '/images/projetos/gonix.png')
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
      expect(screen.getByText('competições realizadas no SuaArena')).toBeInTheDocument()
    })
  })

  describe('Services', () => {
    it('renders the bento grid with what is delivered', () => {
      renderPage()
      expect(screen.getByText('O que eu entrego')).toBeInTheDocument()
      ;['Arquitetura front-end', 'Performance e Core Web Vitals', 'Design System', 'APIs e regras de negócio', 'Liderança técnica', 'Produto sob medida (Vela Studio)'].forEach((title) => {
        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      })
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
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
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
        expect(screen.getByText('Email inválido.')).toBeInTheDocument()
        expect(screen.getByText('Mensagem deve ter pelo menos 10 caracteres.')).toBeInTheDocument()
      })
    })

    it('submits valid data to the contact API', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock
      const user = userEvent.setup()
      renderPage()
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva')
      await user.type(screen.getByPlaceholderText('Email'), 'joao@email.com')
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

    it('keeps PT and EN with the same structure', () => {
      const shape = (obj: unknown): unknown =>
        Array.isArray(obj) ? obj.length : obj && typeof obj === 'object'
          ? Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, shape(v)]))
          : typeof obj
      expect(shape(translations.en)).toEqual(shape(translations.pt))
    })
  })
})
