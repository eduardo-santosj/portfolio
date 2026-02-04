import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Lista de palavras spam
const SPAM_WORDS = ['viagra', 'casino', 'lottery', 'prize', 'click here', 'buy now', 'free money'];

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validação 1: Campos obrigatórios
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Validação 2: Tamanho mínimo
    if (name.length < 2 || message.length < 10) {
      return NextResponse.json({ error: 'Nome ou mensagem muito curtos' }, { status: 400 });
    }

    // Validação 3: Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Validação 4: Detectar spam
    const textToCheck = `${name} ${email} ${message}`.toLowerCase();
    const hasSpam = SPAM_WORDS.some(word => textToCheck.includes(word));
    if (hasSpam) {
      return NextResponse.json({ error: 'Mensagem bloqueada' }, { status: 403 });
    }

    // Validação 5: Tamanho máximo
    if (message.length > 1000) {
      return NextResponse.json({ error: 'Mensagem muito longa' }, { status: 400 });
    }

    // Validação 6: Evitar emails genéricos/suspeitos
    const suspiciousDomains = ['tempmail', 'throwaway', 'guerrillamail', '10minutemail'];
    const hasSuspiciousDomain = suspiciousDomains.some(domain => email.includes(domain));
    if (hasSuspiciousDomain) {
      return NextResponse.json({ error: 'Email temporário não permitido' }, { status: 403 });
    }

    // Enviar email
    await resend.emails.send({
      from: 'Portfólio <onboarding@resend.dev>', // Use seu domínio verificado
      to: 'eduardosantosj2@gmail.com',
      subject: `💼 Contato de ${name}`,
      html: `
        <h2>Novo contato do portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}
