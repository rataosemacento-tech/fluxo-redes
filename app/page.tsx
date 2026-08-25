'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type PostStatus = 'Agendado' | 'Rascunho' | 'Publicado';
type Post = { id: number; title: string; date: string; time: string; networks: string[]; status: PostStatus; caption: string };

const initialPosts: Post[] = [
  { id: 1, title: 'Rotina de criação', date: 'Hoje', time: '18:30', networks: ['Instagram', 'TikTok'], status: 'Agendado', caption: 'Pequenos hábitos que deixam a criação mais leve ✦' },
  { id: 2, title: 'Dica rápida #12', date: 'Amanhã', time: '12:00', networks: ['Instagram'], status: 'Agendado', caption: 'Uma ideia simples para você testar hoje.' },
  { id: 3, title: 'Bastidores do projeto', date: '29 ago.', time: '19:15', networks: ['TikTok'], status: 'Rascunho', caption: 'O que acontece antes do vídeo chegar até você.' },
];

function NetworkMark({ network }: { network: string }) {
  return <span className={`network-mark ${network === 'Instagram' ? 'instagram' : 'tiktok'}`} title={network}>{network === 'Instagram' ? '◎' : '♪'}</span>;
}
function StatusPill({ status }: { status: PostStatus }) { return <span className={`status ${status.toLowerCase()}`}>{status}</span>; }

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showComposer, setShowComposer] = useState(false);
  const [activeNav, setActiveNav] = useState('Visão geral');
  const [fileName, setFileName] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('Novo conteúdo');
  const [scheduledDate, setScheduledDate] = useState('2026-08-28');
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [instagram, setInstagram] = useState(true);
  const [tiktok, setTiktok] = useState(true);
  const [notice, setNotice] = useState('');
  const scheduledCount = posts.filter((post) => post.status === 'Agendado').length;
  const thisWeekCount = useMemo(() => posts.filter((post) => post.status !== 'Rascunho').length + 5, [posts]);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) { setFileName(selected.name); setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')); }
  }
  function generateCaption() {
    const subject = title.trim() || 'este vídeo';
    setCaption(`Um olhar rápido sobre ${subject}. Salve para ver depois e me conte o que achou. ✦\n\n#criacao #conteudo #rotina`);
  }
  function savePost() {
    if (!fileName) { setNotice('Escolha um vídeo antes de agendar.'); return; }
    if (!instagram && !tiktok) { setNotice('Selecione pelo menos uma rede social.'); return; }
    const networks = [instagram && 'Instagram', tiktok && 'TikTok'].filter(Boolean) as string[];
    const newPost: Post = {
      id: Date.now(), title: title || 'Novo conteúdo',
      date: new Date(`${scheduledDate}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
      time: scheduledTime, networks, status: 'Agendado', caption: caption || 'Sem descrição.',
    };
    setPosts((current) => [newPost, ...current]); setShowComposer(false); setNotice('Conteúdo agendado com sucesso.'); setFileName(''); setCaption('');
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">↗</span><span>fluxo</span></div>
      <nav aria-label="Navegação principal">{['Visão geral', 'Calendário', 'Biblioteca'].map((item, index) => <button key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => setActiveNav(item)}><span>{['◌', '□', '▷'][index]}</span>{item}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setNotice('As contas serão conectadas na próxima etapa do projeto.')}><span>⚙</span>Configurações</button><div className="profile"><span>YM</span><div><strong>Yasmin</strong><small>Plano pessoal</small></div></div></div>
    </aside>
    <section className="content">
      <header className="topbar"><div><p className="eyebrow">{activeNav}</p><h1>Seu conteúdo, no ritmo certo.</h1></div><button className="primary-button" onClick={() => { setNotice(''); setShowComposer(true); }}><span>＋</span>Novo post</button></header>
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
      <section className="summary-grid" aria-label="Resumo da conta">
        <article className="summary-card"><div><p>Agendados</p><strong>{scheduledCount}</strong><span>próximas publicações</span></div><b className="summary-icon">↗</b></article>
        <article className="summary-card"><div><p>Esta semana</p><strong>{thisWeekCount}</strong><span>conteúdos planejados</span></div><b className="summary-icon soft">◷</b></article>
        <article className="summary-card networks-card"><div><p>Contas conectadas</p><strong>2</strong><span>prontas para publicar</span></div><div className="stacked-marks"><NetworkMark network="Instagram" /><NetworkMark network="TikTok" /></div></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel schedule-panel"><div className="panel-heading"><div><p className="eyebrow">A seguir</p><h2>Próximos agendamentos</h2></div><button className="quiet-button" onClick={() => setActiveNav('Calendário')}>Ver calendário →</button></div><div className="post-list">{posts.slice(0, 4).map((post) => <div className="post-row" key={post.id}><div className="video-thumb"><span>▶</span></div><div className="post-info"><strong>{post.title}</strong><span>{post.date} · {post.time}</span></div><div className="post-networks">{post.networks.map((network) => <NetworkMark key={network} network={network} />)}</div><StatusPill status={post.status} /><button className="more-button" aria-label={`Mais opções para ${post.title}`} onClick={() => setNotice(`Opções de “${post.title}” serão incluídas em breve.`)}>•••</button></div>)}</div></article>
        <article className="panel steps-panel"><p className="eyebrow">Próximo passo</p><h2>Publique sem perder tempo.</h2><p className="muted">Envie um vídeo, deixe as legendas trabalharem por você e programe tudo em um só lugar.</p><ol className="steps"><li><span>1</span>Envie seu vídeo</li><li><span>2</span>Revise a legenda automática</li><li><span>3</span>Escolha onde e quando publicar</li></ol><button className="outline-button" onClick={() => setShowComposer(true)}>Criar primeiro agendamento</button></article>
      </section>
      <section className="weekly" aria-label="Planejamento semanal"><div className="panel-heading"><div><p className="eyebrow">Planejamento</p><h2>Esta semana</h2></div><span className="week-label">25 — 31 ago.</span></div><div className="week-grid">{['SEG 25', 'TER 26', 'QUA 27', 'QUI 28', 'SEX 29', 'SÁB 30', 'DOM 31'].map((day, index) => <div className="day" key={day}><span>{day}</span>{index === 0 && <b className="calendar-dot instagram-dot">18:30</b>}{index === 3 && <b className="calendar-dot tiktok-dot">12:00</b>}{index === 4 && <b className="calendar-dot both-dot">19:15</b>}</div>)}</div></section>
    </section>
    {showComposer && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowComposer(false)}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><p className="eyebrow">Novo agendamento</p><h2 id="composer-title">Prepare seu vídeo</h2></div><button className="close-button" aria-label="Fechar" onClick={() => setShowComposer(false)}>×</button></header>
      <div className="composer-body"><label className={`upload-box ${fileName ? 'selected' : ''}`}><input type="file" accept="video/*" onChange={onFileSelected} /><span className="upload-icon">↑</span><strong>{fileName || 'Escolha um vídeo'}</strong><small>{fileName ? 'Arquivo pronto para processar' : 'MP4 ou MOV · formato vertical recomendado'}</small></label><label>Nome do conteúdo<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Bastidores do vídeo" /></label><div className="label-row"><label>Legenda e descrição</label><button className="generate-button" type="button" onClick={generateCaption}>✦ Gerar com IA</button></div><textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Escreva ou gere uma legenda para o post…" rows={4} /><div className="form-split"><label>Data<input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} /></label><label>Hora<input type="time" value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)} /></label></div><fieldset><legend>Publicar em</legend><div className="network-options"><button type="button" className={instagram ? 'selected' : ''} onClick={() => setInstagram(!instagram)}><NetworkMark network="Instagram" />Instagram <span>{instagram ? '✓' : ''}</span></button><button type="button" className={tiktok ? 'selected' : ''} onClick={() => setTiktok(!tiktok)}><NetworkMark network="TikTok" />TikTok <span>{tiktok ? '✓' : ''}</span></button></div></fieldset></div>
      <footer><button className="quiet-button" onClick={() => setShowComposer(false)}>Cancelar</button><button className="primary-button" onClick={savePost}>Agendar publicação</button></footer>
    </section></div>}
  </main>;
}

