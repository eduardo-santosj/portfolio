import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../page'

describe('Portfolio Page', () => {
  beforeEach(() => {
    render(<Page />)
  })

  describe('Header', () => {
    it('renders profile name', () => {
      expect(screen.getByText('Eduardo dos Santos Jacinto')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
      expect(screen.getByText('inicio')).toBeInTheDocument()
      expect(screen.getByText('sobre')).toBeInTheDocument()
      expect(screen.getByText('servicos')).toBeInTheDocument()
      expect(screen.getByText('projetos')).toBeInTheDocument()
      expect(screen.getByText('experiencia')).toBeInTheDocument()
      expect(screen.getByText('contato')).toBeInTheDocument()
    })

    it('renders CV download button', () => {
      const cvButton = screen.getByText('Baixar CV')
      expect(cvButton).toBeInTheDocument()
      expect(cvButton.closest('a')).toHaveAttribute('download')
    })
  })

  describe('Hero Section', () => {
    it('renders main title', () => {
      expect(screen.getByText('Desenvolvedor Web | React • Node • Frontend')).toBeInTheDocument()
    })

    it('renders contact buttons', () => {
      expect(screen.getByText('Fale comigo')).toBeInTheDocument()
      expect(screen.getAllByText('GitHub')).toHaveLength(2)
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2)
    })
  })

  describe('Skills Section', () => {
    it('renders all skills', () => {
      const skills = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js']
      skills.forEach(skill => {
        expect(screen.getAllByText(skill).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Services Section', () => {
    it('renders all services', () => {
      expect(screen.getByText('Desenvolvimento Web')).toBeInTheDocument()
      expect(screen.getByText('Performance & SEO')).toBeInTheDocument()
      expect(screen.getByText('Consultoria & Freelance')).toBeInTheDocument()
    })
  })

  describe('Projects Section', () => {
    it('renders project filter input', () => {
      const filterInput = screen.getByPlaceholderText('Filtrar projetos por nome, stack, tag...')
      expect(filterInput).toBeInTheDocument()
    })

    it('filters projects by search term', async () => {
      const user = userEvent.setup()
      const filterInput = screen.getByPlaceholderText('Filtrar projetos por nome, stack, tag...')
      
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
    it('renders work experience', () => {
      expect(screen.getByText('Desenvolvedor Web - Suprema Gaming & Co.')).toBeInTheDocument()
      expect(screen.getByText(/Jul\/2023.*Atual/)).toBeInTheDocument()
    })
  })

  describe('Contact Form', () => {
    it('renders contact form fields', () => {
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Mensagem')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      const submitButton = screen.getByRole('button', { name: 'Enviar' })
      
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeInTheDocument()
        expect(screen.getByText('Email inválido.')).toBeInTheDocument()
        expect(screen.getByText('Mensagem deve ter pelo menos 10 caracteres.')).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva')
      await user.type(screen.getByPlaceholderText('Email'), 'joao@email.com')
      await user.type(screen.getByPlaceholderText('Mensagem'), 'Mensagem de teste com mais de 10 caracteres')
      
      const submitButton = screen.getByRole('button', { name: 'Enviar' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nome')).toHaveValue('')
        expect(screen.getByPlaceholderText('Email')).toHaveValue('')
        expect(screen.getByPlaceholderText('Mensagem')).toHaveValue('')
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
})