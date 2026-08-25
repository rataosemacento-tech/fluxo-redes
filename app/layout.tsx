import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fluxo — Agendamento de conteúdo',
  description: 'Seu painel pessoal para organizar e agendar conteúdo.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={dmSans.variable}>{children}</body></html>;
}

