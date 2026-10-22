/* =========================================================
   Aton WEB Builder — builder.js
   Lógica de estado, navegação e geração de HTML
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. ESTADO GLOBAL
     --------------------------------------------------------- */
  const state = {
    projectName: 'meu-projeto',
    blocks: [],              // [{ id, type, name, icon, html }]
    theme: {
      name: 'Azul Corporativo',
      font: 'Inter',
      primary: '#0d6efd',
      secondary: '#6610f2',
      background: '#ffffff',
      extraCss: ''
    },
    seo: {
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'website',
      ogLocale: 'pt_BR'
    },
    plugins: {
      animatecss: false,
      bulma:       false,
      gsap:        false,
      splide:      false,
      swiper:      false,
      typed:       false,
      chartjs:     false,
      fancybox:    false,
      aos:         false
    }
  };

  /* ---------------------------------------------------------
     2. CDNs DOS PLUGINS
     --------------------------------------------------------- */
  const PLUGIN_CDN = {
    animatecss: {
      css: ['https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css'],
      js:  []
    },
    bulma: {
      css: ['https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css'],
      js:  []
    },
    gsap: {
      css: [],
      js:  ['https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js']
    },
    splide: {
      css: ['https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css'],
      js:  ['https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js']
    },
    swiper: {
      css: ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'],
      js:  ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js']
    },
    typed: {
      css: [],
      js:  ['https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js']
    },
    chartjs: {
      css: [],
      js:  ['https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js']
    },
    fancybox: {
      css: ['https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.css'],
      js:  ['https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.js']
    },
    aos: {
      css: ['https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css'],
      js:  ['https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js']
    }
  };

  const FONT_FAMILIES = {
    'Inter':       "'Inter', system-ui, -apple-system, sans-serif",
    'Roboto':      "'Roboto', system-ui, sans-serif",
    'Poppins':     "'Poppins', system-ui, sans-serif",
    'Montserrat':  "'Montserrat', system-ui, sans-serif",
    'Open Sans':   "'Open Sans', system-ui, sans-serif",
    'Lato':        "'Lato', system-ui, sans-serif"
  };

  /* ---------------------------------------------------------
     3. BIBLIOTECA DE BLOCOS (HTML fictício)
     --------------------------------------------------------- */
  const BLOCK_LIBRARY = {
    navbar: () => `
<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">Minha Marca</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMain">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Início</a></li>
        <li class="nav-item"><a class="nav-link" href="#sobre">Sobre</a></li>
        <li class="nav-item"><a class="nav-link" href="#servicos">Serviços</a></li>
        <li class="nav-item"><a class="nav-link" href="#contato">Contato</a></li>
      </ul>
    </div>
  </div>
</nav>`.trim(),

    hero: () => `
<header class="py-5 text-center bg-body-tertiary">
  <div class="container py-5">
    <h1 class="display-4 fw-bold mb-3">Bem-vindo ao seu novo site</h1>
    <p class="lead text-secondary mb-4">Uma headline clara e persuasiva que comunica o valor do seu negócio.</p>
    <a href="#contato" class="btn btn-primary btn-lg px-4">Começar agora</a>
  </div>
</header>`.trim(),

    features: () => `
<section class="py-5">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Nossos recursos</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="fs-1 text-primary mb-2">⚡</div>
            <h5 class="card-title">Rápido</h5>
            <p class="card-text text-secondary">Performance otimizada para carregar em milissegundos.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="fs-1 text-primary mb-2">🔒</div>
            <h5 class="card-title">Seguro</h5>
            <p class="card-text text-secondary">Boas práticas de segurança em cada linha de código.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="fs-1 text-primary mb-2">📱</div>
            <h5 class="card-title">Responsivo</h5>
            <p class="card-text text-secondary">Funciona perfeitamente em qualquer tela.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    testimonials: () => `
<section class="py-5 bg-body-tertiary">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">O que dizem sobre nós</h2>
    <div class="row g-4">
      <div class="col-md-6">
        <blockquote class="blockquote p-4 bg-body rounded shadow-sm">
          <p>"Serviço impecável, entrega antes do prazo e resultado acima do esperado."</p>
          <footer class="blockquote-footer mt-2">Cliente Satisfeito <cite title="Empresa">Empresa X</cite></footer>
        </blockquote>
      </div>
      <div class="col-md-6">
        <blockquote class="blockquote p-4 bg-body rounded shadow-sm">
          <p>"Equipe atenciosa e profissional. Recomendo sem hesitar."</p>
          <footer class="blockquote-footer mt-2">Outro Cliente <cite title="Empresa">Empresa Y</cite></footer>
        </blockquote>
      </div>
    </div>
  </div>
</section>`.trim(),

    pricing: () => `
<section class="py-5">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Planos e preços</h2>
    <div class="row g-4 justify-content-center">
      <div class="col-md-4">
        <div class="card h-100 text-center border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="card-title">Básico</h5>
            <div class="display-6 fw-bold my-3">R$ 99<span class="fs-6 text-secondary">/mês</span></div>
            <ul class="list-unstyled text-secondary mb-4">
              <li class="mb-2">✓ 1 página</li>
              <li class="mb-2">✓ Suporte por e-mail</li>
              <li class="mb-2">✓ Atualizações</li>
            </ul>
            <a href="#" class="btn btn-outline-primary w-100">Assinar</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center border-primary shadow">
          <div class="card-body p-4">
            <span class="badge text-bg-primary mb-2">Mais popular</span>
            <h5 class="card-title">Pro</h5>
            <div class="display-6 fw-bold my-3">R$ 199<span class="fs-6 text-secondary">/mês</span></div>
            <ul class="list-unstyled text-secondary mb-4">
              <li class="mb-2">✓ 5 páginas</li>
              <li class="mb-2">✓ Suporte prioritário</li>
              <li class="mb-2">✓ SEO avançado</li>
            </ul>
            <a href="#" class="btn btn-primary w-100">Assinar</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="card-title">Premium</h5>
            <div class="display-6 fw-bold my-3">R$ 399<span class="fs-6 text-secondary">/mês</span></div>
            <ul class="list-unstyled text-secondary mb-4">
              <li class="mb-2">✓ Páginas ilimitadas</li>
              <li class="mb-2">✓ Suporte 24/7</li>
              <li class="mb-2">✓ Consultoria</li>
            </ul>
            <a href="#" class="btn btn-outline-primary w-100">Assinar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    cta: () => `
<section class="py-5 bg-primary text-white text-center">
  <div class="container py-4">
    <h2 class="fw-bold mb-3">Pronto para começar?</h2>
    <p class="lead mb-4 opacity-75">Fale com a gente e dê o próximo passo.</p>
    <a href="#contato" class="btn btn-light btn-lg px-4">Entre em contato</a>
  </div>
</section>`.trim(),

    gallery: () => `
<section class="py-5">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Galeria</h2>
    <div class="row g-3">
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
      <div class="col-6 col-md-4"><div class="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
    </div>
  </div>
</section>`.trim(),

    contact: () => `
<section class="py-5 bg-body-tertiary" id="contato">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Fale conosco</h2>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <form>
          <div class="mb-3">
            <label class="form-label">Nome</label>
            <input type="text" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">E-mail</label>
            <input type="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Mensagem</label>
            <textarea class="form-control" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</section>`.trim(),

    footer: () => `
<footer class="py-4 bg-body-tertiary border-top">
  <div class="container text-center text-secondary">
    <p class="mb-1">&copy; ${new Date().getFullYear()} Minha Marca. Todos os direitos reservados.</p>
    <small>Feito com Aton WEB Builder</small>
  </div>
</footer>`.trim()
  };

  const BLOCK_META = {
    navbar:       { name: 'Navbar',       icon: 'window-top' },
    hero:         { name: 'Hero',         icon: 'stars' },
    features:     { name: 'Features',     icon: 'list-check' },
    testimonials: { name: 'Depoimentos',  icon: 'quote' },
    pricing:      { name: 'Pricing',      icon: 'tags' },
    cta:          { name: 'CTA',          icon: 'megaphone' },
    gallery:      { name: 'Galeria',      icon: 'images' },
    contact:      { name: 'Contato',      icon: 'envelope' },
    footer:       { name: 'Footer',       icon: 'layout-text-window-reverse' }
  };

  /* ---------------------------------------------------------
     4. SELETORES
     --------------------------------------------------------- */
  const $  = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  const els = {
    pageTitle:      $('#pageTitle'),
    pageSubtitle:   $('#pageSubtitle'),
    navLinks:       $$('.sidebar .nav-link[data-section]'),
    sections:       $$('[id^="section-"]'),
    canvas:         $('.builder-canvas'),
    blockCount:     $$('.card-header .badge').length ? $('.card-header .badge.text-bg-secondary') : null
  };

  /* ---------------------------------------------------------
     5. NAVEGAÇÃO ENTRE SEÇÕES
     --------------------------------------------------------- */
  const SECTION_TITLES = {
    templates: ['Templates', 'Escolha um template pronto ou monte o seu bloco a bloco'],
    temas:     ['Temas', 'Selecione um tema pronto ou personalize fontes e cores'],
    seo:       ['SEO', 'Gere as metatags de SEO e OpenGraph do site'],
    plugins:   ['Plugins', 'Ative bibliotecas externas via CDN para usar nos templates'],
    gerar:     ['Gerar SITE', 'Exporte o HTML, CSS e JS finais do seu projeto']
  };

  function navigateTo(section) {
    els.navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === section));
    els.sections.forEach(s => s.classList.toggle('d-none', s.id !== 'section-' + section));

    const [t, s] = SECTION_TITLES[section] || ['', ''];
    els.pageTitle.textContent = t;
    els.pageSubtitle.textContent = s;
  }

  els.navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  /* ---------------------------------------------------------
     6. CONSTRUTOR — ADICIONAR / REMOVER BLOCOS
     --------------------------------------------------------- */
  function makeBlockId() {
    return 'b_' + Math.random().toString(36).slice(2, 9);
  }

  function addBlock(type) {
    if (!BLOCK_LIBRARY[type]) return;
    const meta = BLOCK_META[type];
    state.blocks.push({
      id: makeBlockId(),
      type,
      name: meta.name,
      icon: meta.icon,
      html: BLOCK_LIBRARY[type]()
    });
    renderCanvas();
  }

  function removeBlock(id) {
    state.blocks = state.blocks.filter(b => b.id !== id);
    renderCanvas();
  }

  function renderCanvas() {
    if (!els.canvas) return;

    if (state.blocks.length === 0) {
      els.canvas.innerHTML = `
        <i class="bi bi-plus-circle fs-1 text-secondary mb-2"></i>
        <p class="text-secondary mb-1">Arraste blocos aqui ou clique em "Adicionar bloco"</p>
        <small class="text-secondary">A página ainda está vazia</small>`;
      els.canvas.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    } else {
      els.canvas.classList.remove('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
      els.canvas.innerHTML = state.blocks.map((b, i) => `
        <div class="card bg-body border-secondary mb-3" data-block-id="${b.id}">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>
              <i class="bi bi-${b.icon} me-2"></i>
              <strong>${b.name}</strong>
              <span class="badge text-bg-secondary ms-2">#${i + 1}</span>
            </span>
            <button class="btn btn-sm btn-outline-danger" data-remove="${b.id}" title="Remover bloco">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="card-body p-0 bg-body-secondary">
            <div class="p-3 small text-secondary font-monospace" style="max-height:180px; overflow:auto; white-space:pre;">
${escapeHtml(b.html)}
            </div>
          </div>
        </div>
      `).join('');

      els.canvas.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => removeBlock(btn.dataset.remove));
      });
    }

    updateBlockBadge();
  }

  function updateBlockBadge() {
    const badge = document.querySelector('.card-header .badge.text-bg-secondary');
    if (badge) badge.textContent = state.blocks.length + ' blocos';
  }

  // Botões "Adicionar bloco"
  document.querySelectorAll('#section-templates button.btn-outline-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim().toLowerCase();
      const map = {
        'navbar': 'navbar', 'hero': 'hero', 'features': 'features',
        'depoimentos': 'testimonials', 'pricing': 'pricing', 'cta': 'cta',
        'galeria': 'gallery', 'contato': 'contact', 'footer': 'footer'
      };
      const key = Object.keys(map).find(k => label.includes(k));
      if (key) addBlock(map[key]);
    });
  });

  /* ---------------------------------------------------------
     7. TEMAS — APLICAR E PERSONALIZAR
     --------------------------------------------------------- */
  const THEME_PRESETS = {
    'Azul Corporativo':   { primary: '#0d6efd', secondary: '#6610f2', background: '#ffffff' },
    'Verde Natural':      { primary: '#198754', secondary: '#20c997', background: '#ffffff' },
    'Vermelho Energia':   { primary: '#dc3545', secondary: '#fd7e14', background: '#ffffff' },
    'Escuro Minimalista': { primary: '#0d6efd', secondary: '#495057', background: '#212529' }
  };

  document.querySelectorAll('#section-temas .btn-outline-primary').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const names = Object.keys(THEME_PRESETS);
      const name = names[i];
      if (!name) return;
      state.theme.name = name;
      Object.assign(state.theme, THEME_PRESETS[name]);

      // Atualiza os inputs do painel
      const colorInputs = document.querySelectorAll('#section-temas input[type="color"]');
      if (colorInputs[0]) colorInputs[0].value = state.theme.primary;
      if (colorInputs[1]) colorInputs[1].value = state.theme.secondary;
      if (colorInputs[2]) colorInputs[2].value = state.theme.background;

      toast(`Tema "${name}" aplicado.`);
    });
  });

  function bindThemeInputs() {
    const fontSelect = document.querySelector('#section-temas select');
    const [primary, secondary, background] = document.querySelectorAll('#section-temas input[type="color"]');
    const extraCss = document.querySelector('#section-temas textarea');

    if (fontSelect) fontSelect.addEventListener('change', e => state.theme.font = e.target.value);
    if (primary)    primary.addEventListener('input',    e => state.theme.primary = e.target.value);
    if (secondary)  secondary.addEventListener('input',  e => state.theme.secondary = e.target.value);
    if (background) background.addEventListener('input', e => state.theme.background = e.target.value);
    if (extraCss)   extraCss.addEventListener('input',   e => state.theme.extraCss = e.target.value);
  }

  /* ---------------------------------------------------------
     8. SEO — BIND DOS CAMPOS
     --------------------------------------------------------- */
  function bindSeoInputs() {
    const seoSection = document.getElementById('section-seo');
    if (!seoSection) return;

    const inputs = seoSection.querySelectorAll('input, textarea, select');
    const mapping = [
      { key: 'title',         match: /^Title/ },
      { key: 'description',   match: /^Description/ },
      { key: 'keywords',      match: /^Keywords/ },
      { key: 'canonical',     match: /^Canonical/ },
      { key: 'robots',        match: /^Robots/, isSelect: true },
      { key: 'ogTitle',       match: /^og:title/ },
      { key: 'ogDescription', match: /^og:description/ },
      { key: 'ogImage',       match: /^og:image/ },
      { key: 'ogType',        match: /^og:type/, isSelect: true },
      { key: 'ogLocale',      match: /^og:locale/ }
    ];

    inputs.forEach(input => {
      const label = input.closest('.mb-3, .col-md-6')?.querySelector('label')?.textContent.trim() || '';
      const found = mapping.find(m => m.match.test(label));
      if (!found) return;

      const event = found.isSelect ? 'change' : 'input';
      input.addEventListener(event, e => {
        state.seo[found.key] = e.target.value;
        updateHeadPreview();
      });
    });
  }

  function updateHeadPreview() {
    const pre = document.querySelector('#section-seo pre code');
    if (!pre) return;

    const s = state.seo;
    const lines = [
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `  <title>${escapeHtml(s.title || 'Título do site')}</title>`,
      s.description && `  <meta name="description" content="${escapeAttr(s.description)}">`,
      s.keywords    && `  <meta name="keywords" content="${escapeAttr(s.keywords)}">`,
      s.canonical   && `  <link rel="canonical" href="${escapeAttr(s.canonical)}">`,
      s.robots      && `  <meta name="robots" content="${escapeAttr(s.robots)}">`,
      '',
      '  <!-- OpenGraph -->',
      s.ogTitle       && `  <meta property="og:title" content="${escapeAttr(s.ogTitle)}">`,
      s.ogDescription && `  <meta property="og:description" content="${escapeAttr(s.ogDescription)}">`,
      s.ogImage       && `  <meta property="og:image" content="${escapeAttr(s.ogImage)}">`,
      `  <meta property="og:type" content="${escapeAttr(s.ogType || 'website')}">`,
      `  <meta property="og:locale" content="${escapeAttr(s.ogLocale || 'pt_BR')}">`,
      '</head>'
    ].filter(Boolean);

    pre.textContent = lines.join('\n');
  }

  /* ---------------------------------------------------------
     9. PLUGINS — TOGGLE
     --------------------------------------------------------- */
  function bindPlugins() {
    const cards = document.querySelectorAll('#section-plugins .plugin-card');
    const order = ['animatecss', 'bulma', 'gsap', 'splide', 'swiper', 'typed', 'chartjs', 'fancybox', 'aos'];

    cards.forEach((card, i) => {
      const key = order[i];
      if (!key) return;
      const toggle = card.querySelector('input[type="checkbox"]');
      if (!toggle) return;

      toggle.addEventListener('change', e => {
        state.plugins[key] = e.target.checked;
        card.classList.toggle('border-primary', e.target.checked);
        toast(`Plugin "${key}" ${e.target.checked ? 'ativado' : 'desativado'}.`);
      });
    });
  }

  /* ---------------------------------------------------------
     10. GERADOR DE HTML
     --------------------------------------------------------- */
  function buildHead() {
    const s = state.seo;
    const t = state.theme;

    const pluginCss = [];
    Object.entries(state.plugins).forEach(([key, on]) => {
      if (!on) return;
      PLUGIN_CDN[key]?.css?.forEach(url => pluginCss.push(`  <link href="${url}" rel="stylesheet">`));
    });

    const fontFamily = FONT_FAMILIES[t.font] || FONT_FAMILIES['Inter'];

    return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(s.title || 'Meu site')}</title>
${s.description ? `  <meta name="description" content="${escapeAttr(s.description)}">\n` : ''}${s.keywords ? `  <meta name="keywords" content="${escapeAttr(s.keywords)}">\n` : ''}${s.canonical ? `  <link rel="canonical" href="${escapeAttr(s.canonical)}">\n` : ''}${s.robots ? `  <meta name="robots" content="${escapeAttr(s.robots)}">\n` : ''}
  <!-- OpenGraph -->
${s.ogTitle ? `  <meta property="og:title" content="${escapeAttr(s.ogTitle)}">\n` : ''}${s.ogDescription ? `  <meta property="og:description" content="${escapeAttr(s.ogDescription)}">\n` : ''}${s.ogImage ? `  <meta property="og:image" content="${escapeAttr(s.ogImage)}">\n` : ''}  <meta property="og:type" content="${escapeAttr(s.ogType || 'website')}">
  <meta property="og:locale" content="${escapeAttr(s.ogLocale || 'pt_BR')}">

  <!-- Bootstrap 5.3 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
${pluginCss.length ? pluginCss.join('\n') + '\n' : ''}
  <!-- Tema: ${escapeHtml(t.name)} -->
  <style>
    :root {
      --bs-primary: ${t.primary};
      --bs-secondary: ${t.secondary};
      --bs-body-bg: ${t.background};
      --bs-body-font-family: ${fontFamily};
    }
    body { font-family: ${fontFamily}; }
${t.extraCss ? '    ' + t.extraCss.replace(/\n/g, '\n    ') + '\n' : ''}  </style>
</head>`.trimEnd();
  }

  function buildBody() {
    if (state.blocks.length === 0) {
      return '<body class="d-flex align-items-center justify-content-center" style="min-height:100vh;">\n  <p class="text-secondary">Página vazia — adicione blocos no Aton WEB Builder.</p>\n</body>';
    }
    const inner = state.blocks.map(b => b.html).join('\n\n');
    return `<body>\n${inner}\n</body>`;
  }

  function buildScripts() {
    const pluginJs = [];
    Object.entries(state.plugins).forEach(([key, on]) => {
      if (!on) return;
      PLUGIN_CDN[key]?.js?.forEach(url => pluginJs.push(`<script src="${url}"></script>`));
    });

    const init = [];
    if (state.plugins.aos) init.push('AOS.init();');
    if (state.plugins.fancybox) init.push('Fancybox.bind("[data-fancybox]");');

    return [
      '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>',
      ...pluginJs,
      init.length ? `<script>\n  ${init.join('\n  ')}\n</script>` : ''
    ].filter(Boolean).join('\n');
  }

  function buildHtml() {
    return `<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="light">
${buildHead()}
${buildBody()}
${buildScripts()}
</html>`;
  }

  /* ---------------------------------------------------------
     11. AÇÕES DE EXPORTAÇÃO
     --------------------------------------------------------- */
  function downloadHtml() {
    const html = buildHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = (state.projectName || 'meu-projeto') + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Download iniciado.');
  }

  function showHtmlModal() {
    const html = buildHtml();
    let modal = document.getElementById('htmlOutputModal');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'htmlOutputModal';
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-code-square me-2"></i>HTML gerado</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
              <pre class="m-0 p-3 small" style="max-height:65vh; overflow:auto;"><code id="htmlOutputCode" class="text-secondary"></code></pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
              <button type="button" class="btn btn-primary" id="copyHtmlBtn">
                <i class="bi bi-clipboard me-1"></i> Copiar HTML
              </button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    document.getElementById('htmlOutputCode').textContent = html;

    document.getElementById('copyHtmlBtn').onclick = async () => {
      try {
        await navigator.clipboard.writeText(html);
        toast('HTML copiado para a área de transferência.');
      } catch {
        toast('Falha ao copiar. Selecione o texto manualmente.');
      }
    };

    new bootstrap.Modal(modal).show();
  }

  // Botões da topbar e da aba "Gerar SITE"
  document.querySelectorAll('header button, #section-gerar button').forEach(btn => {
    const txt = btn.textContent.trim().toLowerCase();
    if (txt.includes('gerar site') || txt.includes('baixar')) {
      btn.addEventListener('click', downloadHtml);
    }
    if (txt.includes('exibir código')) {
      btn.addEventListener('click', showHtmlModal);
    }
  });

  // Botão "Copiar" da prévia do head
  const copyHeadBtn = document.querySelector('#section-seo .btn-outline-secondary');
  if (copyHeadBtn) {
    copyHeadBtn.addEventListener('click', async () => {
      const code = document.querySelector('#section-seo pre code');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent);
        toast('Prévia do <head> copiada.');
      } catch {
        toast('Falha ao copiar.');
      }
    });
  }

  /* ---------------------------------------------------------
     12. UTILITÁRIOS
     --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function toast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '1100';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-dark border-secondary';
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    container.appendChild(el);

    const t = new bootstrap.Toast(el, { delay: 2500 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    t.show();
  }

  /* ---------------------------------------------------------
     13. INICIALIZAÇÃO
     --------------------------------------------------------- */
  function init() {
    bindThemeInputs();
    bindSeoInputs();
    bindPlugins();
    renderCanvas();
    updateHeadPreview();

    // Expõe estado no console para inspeção durante o desenvolvimento
    window.AtonBuilder = { state, buildHtml };
    console.log('[Aton WEB Builder] pronto. Inspecione com window.AtonBuilder');
  }

  document.addEventListener('DOMContentLoaded', init);
})();