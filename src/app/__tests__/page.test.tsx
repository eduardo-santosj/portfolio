import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../page'

// Mock do LanguageContext
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'pt',
    setLanguage: jest.fn(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.inicio': 'Início',
        'nav.sobre': 'Sobre',
        'nav.servicos': 'Serviços',
        'nav.projetos': 'Projetos',
        'nav.experiencia': 'Experiência',
        'nav.contato': 'Contato',
        'hero.greeting': 'Olá, eu sou',
        'hero.description': 'Desenvolvedor Full Stack com 7+ anos de experiência. Especialista em React, Next.js e Node.js. Foco em entrega de resultados, trabalho em equipe e resolução de problemas complexos.',
        'hero.downloadCV': 'Baixar CV',
        'hero.contact': 'Entre em Contato',
        'about.title': 'Sobre Mim',
        'services.title': 'Como Posso Ajudar',
        'projects.title': 'Projetos em Destaque',
        'projects.search': 'Buscar projetos...',
        'experience.title': 'Experiência Profissional',
        'contact.title': 'Vamos Conversar?',
        'contact.form.name': 'Nome',
        'contact.form.email': 'Email',
        'contact.form.message': 'Mensagem',
        'contact.form.send': 'Enviar Mensagem',
        'contact.form.nameError': 'Nome deve ter pelo menos 2 caracteres.',
        'contact.form.emailError': 'Email inválido.',
        'contact.form.messageError': 'Mensagem deve ter pelo menos 10 caracteres.',
      };
      return translations[key] || key;
    },
    getServices: () => [
      { icon: '🧩', title: 'Desenvolvimento Full Stack', desc: 'Transformo ideias em aplicações web escaláveis e performáticas.', tags: ['React', 'Next.js', 'Node.js', 'Tailwind'] },
      { icon: '⚡', title: 'Performance & Otimização', desc: 'Acelero aplicações web e melhoro experiência do usuário.', tags: ['CWV', 'A11y', 'SEO', 'SSR'] },
      { icon: '🧠', title: 'Liderança Técnica', desc: 'Elevo a qualidade do código do time através de mentoria.', tags: ['Consultoria', 'Arquitetura', 'Freelance'] },
    ],
    getProjects: () => [
      { title: 'Suprema Gaming & Co.', desc: 'Plataforma de apostas esportivas', capa: '/images/projetos/suprema.png', link: 'https://suprema.bet.br', repo: '', stack: ['React', 'Next.js', 'AWS'], tags: ['gaming', 'react'] },
      { title: 'Cobasi & SPet (Accurate Software)', desc: 'E-commerce Cobasi', capa: '/images/projetos/cobasi.png', link: 'https://www.cobasi.com.br', repo: '', stack: ['React', 'Node.js', 'Vtex'], tags: ['ecommerce', 'pet'] },
      { title: 'GM Propostas Comerciais (Accurate Software)', desc: 'Sistema GM Propostas', capa: '/images/projetos/chevrolet.png', link: 'https://chevroletdigital.com.br', repo: '', stack: ['React', 'Java'], tags: ['automotivo', 'enterprise'] },
    ],
    getExperience: () => [
      { company: 'Suprema Gaming & Co.', role: 'Desenvolvedor Web Full Stack', period: 'Jul/2023 – Atual', local: 'Remoto', points: ['Desenvolvimento de plataformas de apostas'] },
      { company: 'Arena22', role: 'Desenvolvedor Web Frontend', period: 'Out/2021 – Jul/2023', local: 'São Paulo, SP', points: ['Desenvolvimento de fantasy games'] },
      { company: 'Accurate Software', role: 'Desenvolvedor Web Full Stack', period: 'Mai/2019 – Out/2021', local: 'São Paulo, SP', points: ['Sistema enterprise GM Propostas'] },
    ],
    getCvUrl: () => '/cv.pdf',
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Portfolio Page', () => {
  beforeEach(() => {
    render(<Page />)
  })

  describe('Header', () => {
    it('renders profile name', () => {
      expect(screen.getByText('Eduardo dos Santos Jacinto')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
      expect(screen.getByText('Início')).toBeInTheDocument()
      expect(screen.getByText('Sobre')).toBeInTheDocument()
      expect(screen.getByText('Serviços')).toBeInTheDocument()
      expect(screen.getByText('Projetos')).toBeInTheDocument()
      expect(screen.getByText('Experiência')).toBeInTheDocument()
      expect(screen.getByText('Contato')).toBeInTheDocument()
    })

    it('renders CV download button', () => {
      const cvButton = screen.getByText('Baixar CV')
      expect(cvButton).toBeInTheDocument()
      expect(cvButton.closest('a')).toHaveAttribute('download')
    })

    it('renders theme toggle button', () => {
      const themeButton = screen.getByLabelText(/tema/i)
      expect(themeButton).toBeInTheDocument()
    })

    it('renders language toggle button', () => {
      const langButton = screen.getByLabelText(/português|english/i)
      expect(langButton).toBeInTheDocument()
    })
  })

  describe('Hero Section', () => {
    it('renders greeting and name', () => {
      expect(screen.getByText('Olá, eu sou')).toBeInTheDocument()
      expect(screen.getByText('Eduardo dos Santos Jacinto')).toBeInTheDocument()
    })

    it('renders description', () => {
      expect(screen.getByText(/Desenvolvedor Full Stack com 7\+ anos/)).toBeInTheDocument()
    })

    it('renders contact buttons', () => {
      expect(screen.getByText('Entre em Contato')).toBeInTheDocument()
      expect(screen.getAllByText('GitHub')).toHaveLength(2)
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2)
    })
  })

  describe('About Section', () => {
    it('renders about title', () => {
      expect(screen.getByText('Sobre Mim')).toBeInTheDocument()
    })

    it('renders skills with technologies', () => {
      const skills = ['React', 'Next.js', 'TypeScript', 'Node.js']
      skills.forEach(skill => {
        expect(screen.getAllByText(new RegExp(skill, 'i')).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Services Section', () => {
    it('renders services title', () => {
      expect(screen.getByText('Como Posso Ajudar')).toBeInTheDocument()
    })

    it('renders all services', () => {
      expect(screen.getByText('Desenvolvimento Full Stack')).toBeInTheDocument()
      expect(screen.getByText('Performance & Otimização')).toBeInTheDocument()
      expect(screen.getByText('Liderança Técnica')).toBeInTheDocument()
    })
  })

  describe('Projects Section', () => {
    it('renders projects title', () => {
      expect(screen.getByText('Projetos em Destaque')).toBeInTheDocument()
    })

    it('renders project filter input', () => {
      const filterInput = screen.getByPlaceholderText('Buscar projetos...')
      expect(filterInput).toBeInTheDocument()
    })

    it('filters projects by search term', async () => {
      const user = userEvent.setup()
      const filterInput = screen.getByPlaceholderText('Buscar projetos...')
      
      await user.type(filterInput, 'Suprema')
      
      expect(screen.getByText('Suprema Gaming & Co.')).toBeInTheDocument()
      expect(screen.queryByText('Cobasi & SPet (Accurate Software)')).not.toBeInTheDocument()
    })

    it('renders project links', () => {
      const liveButtons = screen.getAllByText('Live')
      expect(liveButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Experience Section', () => {
    it('renders experience title', () => {
      expect(screen.getByText('Experiência Profissional')).toBeInTheDocument()
    })

    it('renders work experience', () => {
      expect(screen.getByText(/Desenvolvedor Web Full Stack.*Suprema Gaming/)).toBeInTheDocument()
      expect(screen.getByText(/Jul\/2023.*Atual/)).toBeInTheDocument()
    })
  })

  describe('Contact Form', () => {
    it('renders contact title', () => {
      expect(screen.getByText('Vamos Conversar?')).toBeInTheDocument()
    })

    it('renders contact form fields', () => {
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Mensagem')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i })
      
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeInTheDocument()
        expect(screen.getByText('Email inválido.')).toBeInTheDocument()
        expect(screen.getByText('Mensagem deve ter pelo menos 10 caracteres.')).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as jest.Mock

      const user = userEvent.setup()
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva')
      await user.type(screen.getByPlaceholderText('Email'), 'joao@email.com')
      await user.type(screen.getByPlaceholderText('Mensagem'), 'Mensagem de teste com mais de 10 caracteres')
      
      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object))
      })
    })
  })

  describe('Footer', () => {
    it('renders copyright and location', () => {
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(`© ${currentYear} Eduardo dos Santos Jacinto`)).toBeInTheDocument()
      expect(screen.getByText('Santa Catarina, Brasil')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders skip to content link', () => {
      const skipLink = screen.getByText('Pular para o conteúdo principal')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#inicio')
    })

    it('renders navigation with aria-label', () => {
      const nav = screen.getByLabelText('Navegação principal')
      expect(nav).toBeInTheDocument()
    })
  })
})