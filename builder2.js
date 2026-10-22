/* =========================================================
   Aton WEB Builder — builder.js
   Lógica de estado, biblioteca de blocos, temas, SEO,
   plugins externos, pré-visualização ao vivo e exportação de HTML
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
     2. CDNs DOS PLUGINS E FONTES
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

  const GOOGLE_FONT_URLS = {
    'Inter':       'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'Roboto':      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'Poppins':     'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
    'Montserrat':  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap',
    'Open Sans':   'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
    'Lato':        'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'
  };

  /* ---------------------------------------------------------
     3. BIBLIOTECA DE BLOCOS (Bootstrap 5.3 + Plugins)
     --------------------------------------------------------- */
  const BLOCK_LIBRARY = {
    navbar: () => `<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
      <span class="badge bg-primary text-white p-2 rounded-3"><i class="bi bi-layers-fill"></i></span>
      Minha Marca
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMain">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
        <li class="nav-item"><a class="nav-link active" href="#">Início</a></li>
        <li class="nav-item"><a class="nav-link" href="#sobre">Sobre</a></li>
        <li class="nav-item"><a class="nav-link" href="#servicos">Serviços</a></li>
        <li class="nav-item"><a class="nav-link" href="#precos">Preços</a></li>
        <li class="nav-item"><a class="nav-link" href="#contato">Contato</a></li>
        <li class="nav-item ms-lg-2">
          <a href="#contato" class="btn btn-primary btn-sm px-3 rounded-pill">Começar</a>
        </li>
      </ul>
    </div>
  </div>
</nav>`.trim(),

    hero: () => `<header class="py-5 text-center bg-body-tertiary position-relative overflow-hidden">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8">
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3">
          <i class="bi bi-sparkles me-1"></i> Nova Solução Web
        </span>
        <h1 class="display-4 fw-bold mb-3 tracking-tight">Construa sua presença online com excelência</h1>
        <p class="lead text-secondary mb-4">
          Desenvolvemos experiências digitais completas, responsivas e de alta conversão para o seu negócio decolar no mercado.
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a href="#contato" class="btn btn-primary btn-lg px-4 shadow-sm">
            <i class="bi bi-rocket-takeoff me-2"></i>Começar agora
          </a>
          <a href="#sobre" class="btn btn-outline-secondary btn-lg px-4">
            <i class="bi bi-info-circle me-2"></i>Saiba mais
          </a>
        </div>
      </div>
    </div>
  </div>
</header>`.trim(),

    features: () => `<section class="py-5" id="servicos">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h6 class="text-primary text-uppercase fw-bold letter-spacing-1">Recursos</h6>
      <h2 class="fw-bold">Tudo que você precisa para crescer</h2>
      <p class="text-secondary">Funcionalidades pensadas para oferecer a melhor performance ao usuário.</p>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm p-3 rounded-4">
          <div class="card-body">
            <div class="d-inline-flex p-3 rounded-3 bg-primary-subtle text-primary mb-3 fs-3">
              <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <h5 class="card-title fw-bold">Performance Otimizada</h5>
            <p class="card-text text-secondary">
              Carregamento ultrarrápido com boas práticas de código limpo e arquitetura moderna.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm p-3 rounded-4">
          <div class="card-body">
            <div class="d-inline-flex p-3 rounded-3 bg-success-subtle text-success mb-3 fs-3">
              <i class="bi bi-shield-check"></i>
            </div>
            <h5 class="card-title fw-bold">Totalmente Seguro</h5>
            <p class="card-text text-secondary">
              Padrões elevados de segurança, formulários validados e proteção de ponta a ponta.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm p-3 rounded-4">
          <div class="card-body">
            <div class="d-inline-flex p-3 rounded-3 bg-info-subtle text-info mb-3 fs-3">
              <i class="bi bi-phone-fill"></i>
            </div>
            <h5 class="card-title fw-bold">100% Responsivo</h5>
            <p class="card-text text-secondary">
              Design adaptável que se ajusta com perfeição a smartphones, tablets e desktops.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    testimonials: () => `<section class="py-5 bg-body-tertiary" id="depoimentos">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h6 class="text-primary text-uppercase fw-bold">Depoimentos</h6>
      <h2 class="fw-bold">O que nossos clientes dizem</h2>
      <p class="text-secondary">Depoimentos reais de quem confia no nosso trabalho.</p>
    </div>
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
          <div class="text-warning mb-3">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <p class="fs-5 text-secondary fst-italic mb-4">
            "A experiência foi transformadora para nossa agência. O site foi entregue antes do prazo e com um nível visual impressionante."
          </p>
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width:48px;height:48px;">
              CS
            </div>
            <div>
              <h6 class="mb-0 fw-bold">Camila Santos</h6>
              <small class="text-secondary">Diretora de Marketing • Innova Tech</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
          <div class="text-warning mb-3">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <p class="fs-5 text-secondary fst-italic mb-4">
            "Suporte impecável e código limpo. Conseguimos dobrar a taxa de conversão nas primeiras semanas no ar."
          </p>
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style="width:48px;height:48px;">
              RO
            </div>
            <div>
              <h6 class="mb-0 fw-bold">Rafael Oliveira</h6>
              <small class="text-secondary">CEO • Aton Consultoria</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    pricing: () => `<section class="py-5" id="precos">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h6 class="text-primary text-uppercase fw-bold">Investimento</h6>
      <h2 class="fw-bold">Planos transparentes e sob medida</h2>
      <p class="text-secondary">Escolha o pacote ideal para os objetivos do seu negócio.</p>
    </div>
    <div class="row g-4 justify-content-center align-items-stretch">
      <div class="col-lg-4 col-md-6">
        <div class="card h-100 text-center border-0 shadow-sm p-4 rounded-4 bg-body">
          <h5 class="fw-bold mb-1">Starter</h5>
          <p class="text-secondary small mb-3">Para pequenas empresas e profissionais</p>
          <div class="display-5 fw-bold my-3 text-body">
            R$ 99<span class="fs-6 text-secondary fw-normal">/mês</span>
          </div>
          <ul class="list-unstyled text-start text-secondary mb-4 flex-grow-1">
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Página única institucional</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Design 100% responsivo</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Formulário de contato direto</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Suporte por e-mail</li>
          </ul>
          <a href="#contato" class="btn btn-outline-primary w-100 rounded-pill py-2">Escolher Starter</a>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card h-100 text-center border border-primary border-2 shadow-lg p-4 rounded-4 bg-body position-relative">
          <span class="badge bg-primary text-white position-absolute top-0 start-50 translate-middle px-3 py-2 rounded-pill shadow-sm">
            MAIS POPULAR
          </span>
          <h5 class="fw-bold mb-1 mt-2">Profissional</h5>
          <p class="text-secondary small mb-3">Ideal para empresas em crescimento</p>
          <div class="display-5 fw-bold my-3 text-primary">
            R$ 199<span class="fs-6 text-secondary fw-normal">/mês</span>
          </div>
          <ul class="list-unstyled text-start text-secondary mb-4 flex-grow-1">
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Até 5 páginas completas</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>SEO técnico configurado</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Integração com WhatsApp</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Suporte prioritário 24/7</li>
          </ul>
          <a href="#contato" class="btn btn-primary w-100 rounded-pill py-2 shadow-sm">Escolher Profissional</a>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card h-100 text-center border-0 shadow-sm p-4 rounded-4 bg-body">
          <h5 class="fw-bold mb-1">Enterprise</h5>
          <p class="text-secondary small mb-3">Projetos customizados e alto tráfego</p>
          <div class="display-5 fw-bold my-3 text-body">
            R$ 399<span class="fs-6 text-secondary fw-normal">/mês</span>
          </div>
          <ul class="list-unstyled text-start text-secondary mb-4 flex-grow-1">
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Páginas ilimitadas</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Animações e plugins avançados</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Consultoria de conversão</li>
            <li class="mb-2"><i class="bi bi-check2 text-primary me-2"></i>Gerente de conta exclusivo</li>
          </ul>
          <a href="#contato" class="btn btn-outline-primary w-100 rounded-pill py-2">Falar com Consultor</a>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    cta: () => `<section class="py-5 bg-primary text-white text-center position-relative">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="display-5 fw-bold mb-3">Pronto para transformar sua presença digital?</h2>
        <p class="lead opacity-90 mb-4">
          Entre em contato hoje mesmo e receba uma análise completa sem compromisso.
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a href="#contato" class="btn btn-light btn-lg px-4 fw-semibold text-primary shadow">
            <i class="bi bi-telephone-outbound me-2"></i>Falar com a Equipe
          </a>
          <a href="#precos" class="btn btn-outline-light btn-lg px-4">
            <i class="bi bi-tags me-2"></i>Ver Planos
          </a>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    gallery: () => `<section class="py-5" id="galeria">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h6 class="text-primary text-uppercase fw-bold">Portfólio</h6>
      <h2 class="fw-bold">Nossos Trabalhos Recentes</h2>
      <p class="text-secondary">Conheça alguns dos projetos entregues com sucesso.</p>
    </div>
    <div class="row g-4">
      <div class="col-md-4 col-sm-6">
        <div class="card border-0 shadow-sm overflow-hidden rounded-4">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80" class="card-img-top" alt="Dashboard Analytics" style="height:220px; object-fit:cover;">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-1">Painel Analytics SaaS</h6>
            <small class="text-secondary">Interface web de relatórios e métricas</small>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-6">
        <div class="card border-0 shadow-sm overflow-hidden rounded-4">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80" class="card-img-top" alt="Fintech App" style="height:220px; object-fit:cover;">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-1">Portal Financeiro</h6>
            <small class="text-secondary">Gestão ágil para corretoras e bancos</small>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-6">
        <div class="card border-0 shadow-sm overflow-hidden rounded-4">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80" class="card-img-top" alt="Landing Page" style="height:220px; object-fit:cover;">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-1">Landing Page Corporativa</h6>
            <small class="text-secondary">Campanha de captação de leads qualificados</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    contact: () => `<section class="py-5 bg-body-tertiary" id="contato">
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-7">
        <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-body">
          <div class="text-center mb-4">
            <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2">Contato</span>
            <h2 class="fw-bold">Vamos conversar sobre seu projeto?</h2>
            <p class="text-secondary">Preencha o formulário abaixo que retornaremos em menos de 2 horas úteis.</p>
          </div>
          <form onsubmit="event.preventDefault(); alert('Mensagem enviada com sucesso!');">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Seu Nome</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control" placeholder="Ex: Lucas Silva" required>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Seu E-mail</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" placeholder="lucas@exemplo.com" required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Telefone / WhatsApp</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                  <input type="tel" class="form-control" placeholder="(11) 99999-9999">
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Como podemos te ajudar?</label>
                <textarea class="form-control" rows="4" placeholder="Conte brevemente sobre o seu projeto..." required></textarea>
              </div>
              <div class="col-12 mt-4">
                <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm">
                  <i class="bi bi-send-fill me-2"></i>Enviar Mensagem
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    footer: () => `<footer class="py-5 bg-body-tertiary border-top">
  <div class="container">
    <div class="row g-4 justify-content-between">
      <div class="col-lg-4">
        <h5 class="fw-bold mb-2">Aton WEB</h5>
        <p class="text-secondary small mb-3">
          Especialistas em desenvolvimento de páginas web ágeis, designs modernos e soluções escaláveis.
        </p>
        <div class="d-flex gap-2">
          <a href="#" class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;"><i class="bi bi-instagram"></i></a>
          <a href="#" class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;"><i class="bi bi-linkedin"></i></a>
          <a href="#" class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;"><i class="bi bi-github"></i></a>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-2">
        <h6 class="fw-bold mb-3">Links</h6>
        <ul class="list-unstyled small text-secondary">
          <li class="mb-2"><a href="#" class="text-decoration-none text-secondary">Início</a></li>
          <li class="mb-2"><a href="#sobre" class="text-decoration-none text-secondary">Sobre nós</a></li>
          <li class="mb-2"><a href="#servicos" class="text-decoration-none text-secondary">Serviços</a></li>
          <li class="mb-2"><a href="#precos" class="text-decoration-none text-secondary">Preços</a></li>
        </ul>
      </div>
      <div class="col-6 col-md-3 col-lg-2">
        <h6 class="fw-bold mb-3">Suporte</h6>
        <ul class="list-unstyled small text-secondary">
          <li class="mb-2"><a href="#contato" class="text-decoration-none text-secondary">Central de Ajuda</a></li>
          <li class="mb-2"><a href="#" class="text-decoration-none text-secondary">Termos de Uso</a></li>
          <li class="mb-2"><a href="#" class="text-decoration-none text-secondary">Privacidade</a></li>
        </ul>
      </div>
    </div>
    <hr class="my-4 border-secondary opacity-25">
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary gap-2">
      <div>&copy; ${new Date().getFullYear()} Aton WEB. Todos os direitos reservados.</div>
      <div>Feito com <span class="text-primary fw-semibold">Aton WEB Builder</span></div>
    </div>
  </div>
</footer>`.trim(),

    /* BLOCOS DE PLUGINS */
    aosSection: () => `<section class="py-5" data-aos="fade-up">
  <div class="container py-4 text-center">
    <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-3" data-aos="zoom-in" data-aos-delay="100">
      <i class="bi bi-arrow-down-circle me-1"></i> Animação com AOS
    </span>
    <h2 class="fw-bold mb-3" data-aos="fade-up" data-aos-delay="200">Seção Interativa com Efeito de Rolagem</h2>
    <p class="lead text-secondary mb-4 mx-auto" style="max-width:700px;" data-aos="fade-up" data-aos-delay="300">
      Os elementos aparecem suavemente na tela à medida que o visitante rola a página, garantindo dinamismo e engajamento.
    </p>
    <div class="row g-4 mt-2">
      <div class="col-md-4" data-aos="flip-left" data-aos-delay="300">
        <div class="card h-100 p-4 border-0 shadow-sm rounded-4">
          <div class="fs-1 text-primary mb-2"><i class="bi bi-speedometer2"></i></div>
          <h5 class="fw-bold">Fade & Zoom</h5>
          <p class="text-secondary small">Transições fluidas aceleradas por hardware.</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="flip-left" data-aos-delay="450">
        <div class="card h-100 p-4 border-0 shadow-sm rounded-4">
          <div class="fs-1 text-success mb-2"><i class="bi bi-bounding-box-circles"></i></div>
          <h5 class="fw-bold">Delays Customizados</h5>
          <p class="text-secondary small">Controle preciso sobre a ordem de revelação.</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="flip-left" data-aos-delay="600">
        <div class="card h-100 p-4 border-0 shadow-sm rounded-4">
          <div class="fs-1 text-info mb-2"><i class="bi bi-check-circle"></i></div>
          <h5 class="fw-bold">Fácil Configuração</h5>
          <p class="text-secondary small">Basta adicionar o atributo data-aos nas tags.</p>
        </div>
      </div>
    </div>
  </div>
</section>`.trim(),

    swiperCarousel: () => `<section class="py-5 bg-body-tertiary">
  <div class="container py-4">
    <div class="text-center mb-5">
      <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-2">SwiperJS</span>
      <h2 class="fw-bold">Carrossel Touch & Responsivo</h2>
      <p class="text-secondary">Deslize com o mouse ou arraste com o dedo no celular.</p>
    </div>
    <!-- Swiper Container -->
    <div class="swiper myAtonSwiper p-2">
      <div class="swiper-wrapper mb-4">
        <div class="swiper-slide p-5 bg-primary text-white text-center rounded-4 shadow">
          <i class="bi bi-display fs-1 mb-2"></i>
          <h4 class="fw-bold">Design Responsivo</h4>
          <p class="mb-0 opacity-90">Transição suave e perfeita em qualquer tamanho de tela.</p>
        </div>
        <div class="swiper-slide p-5 bg-dark text-white text-center rounded-4 shadow">
          <i class="bi bi-phone fs-1 mb-2"></i>
          <h4 class="fw-bold">Suporte Mobile First</h4>
          <p class="mb-0 opacity-90">Navegação intuitiva por gestos e toques.</p>
        </div>
        <div class="swiper-slide p-5 bg-secondary text-white text-center rounded-4 shadow">
          <i class="bi bi-lightning-charge fs-1 mb-2"></i>
          <h4 class="fw-bold">Performance Otimizada</h4>
          <p class="mb-0 opacity-90">Carregamento sob demanda e zero travamento.</p>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</section>`.trim(),

    fancyboxGallery: () => `<section class="py-5">
  <div class="container py-4 text-center">
    <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-2">Fancybox</span>
    <h2 class="fw-bold mb-3">Galeria com Zoom e Lightbox</h2>
    <p class="text-secondary mb-5">Clique em qualquer foto para abrir a pré-visualização em alta resolução.</p>
    <div class="row g-4">
      <div class="col-md-4 col-sm-6">
        <a href="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80" data-fancybox="gallery" data-caption="Desenvolvimento Web Moderno" class="d-block overflow-hidden rounded-4 shadow-sm">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" class="img-fluid w-100" alt="Coding" style="height:240px; object-fit:cover; transition:transform 0.3s ease;">
        </a>
      </div>
      <div class="col-md-4 col-sm-6">
        <a href="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80" data-fancybox="gallery" data-caption="Dashboards e Analytics" class="d-block overflow-hidden rounded-4 shadow-sm">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" class="img-fluid w-100" alt="Dashboard" style="height:240px; object-fit:cover; transition:transform 0.3s ease;">
        </a>
      </div>
      <div class="col-md-4 col-sm-6">
        <a href="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80" data-fancybox="gallery" data-caption="Equipe Colaborativa" class="d-block overflow-hidden rounded-4 shadow-sm">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" class="img-fluid w-100" alt="Equipe" style="height:240px; object-fit:cover; transition:transform 0.3s ease;">
        </a>
      </div>
    </div>
  </div>
</section>`.trim(),

    typedHero: () => `<header class="py-5 text-center bg-body-tertiary">
  <div class="container py-5">
    <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">Typed.js</span>
    <h1 class="display-4 fw-bold mb-3">
      Desenvolvemos websites <br>
      <span id="typedAton" class="text-primary border-bottom border-primary border-3"></span>
    </h1>
    <p class="lead text-secondary mb-4 mx-auto" style="max-width:650px;">
      Captamos a atenção dos visitantes com animações de digitação dinâmicas e palavras-chave de impacto.
    </p>
    <a href="#contato" class="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">Solicitar Orçamento</a>
  </div>
</header>`.trim(),

    chartSection: () => `<section class="py-5 bg-body-tertiary">
  <div class="container py-4">
    <div class="text-center mb-4">
      <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-2">ChartJS</span>
      <h2 class="fw-bold">Resultados e Métricas em Gráficos</h2>
      <p class="text-secondary">Visualize o impacto e o crescimento com clareza.</p>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-body">
          <canvas id="atonMetricsChart" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
</section>`.trim()
  };

  const BLOCK_META = {
    navbar:          { name: 'Navbar',          icon: 'window-top' },
    hero:            { name: 'Hero',            icon: 'stars' },
    features:        { name: 'Features',        icon: 'list-check' },
    testimonials:    { name: 'Depoimentos',     icon: 'quote' },
    pricing:         { name: 'Pricing',         icon: 'tags' },
    cta:             { name: 'CTA',             icon: 'megaphone' },
    gallery:         { name: 'Galeria',         icon: 'images' },
    contact:         { name: 'Contato',         icon: 'envelope' },
    footer:          { name: 'Footer',          icon: 'layout-text-window-reverse' },
    aosSection:      { name: 'AOS Section',     icon: 'arrow-down-circle' },
    swiperCarousel:  { name: 'Swiper Carousel', icon: 'arrow-repeat' },
    fancyboxGallery: { name: 'Galeria Lightbox',icon: 'images' },
    typedHero:       { name: 'Typed Hero',      icon: 'keyboard' },
    chartSection:    { name: 'Gráfico ChartJS', icon: 'bar-chart' }
  };

  /* ---------------------------------------------------------
     4. SELETORES
     --------------------------------------------------------- */
  const $  = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  const els = {
    pageTitle:          $('#pageTitle'),
    pageSubtitle:       $('#pageSubtitle'),
    navLinks:           $$('.sidebar .nav-link[data-section], #sidebarOffcanvas .nav-link[data-section]'),
    sections:           $$('[id^="section-"]'),
    canvas:             $('.builder-canvas'),
    blockCount:         $('#availableBlocksCount'),
    blocksBadge:        $('#blocksBadge'),
    projectNameInput:   $('#projectNameInput')
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
    if (els.pageTitle) els.pageTitle.textContent = t;
    if (els.pageSubtitle) els.pageSubtitle.textContent = s;
  }

  els.navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  /* ---------------------------------------------------------
     6. CONSTRUTOR — ADICIONAR / MOVER / REMOVER / EDITAR BLOCOS
     --------------------------------------------------------- */
  function makeBlockId() {
    return 'b_' + Math.random().toString(36).slice(2, 9);
  }

  function addBlock(type) {
    if (!BLOCK_LIBRARY[type]) return;
    const meta = BLOCK_META[type] || { name: type, icon: 'square' };
    state.blocks.push({
      id: makeBlockId(),
      type,
      name: meta.name,
      icon: meta.icon,
      html: BLOCK_LIBRARY[type]()
    });
    renderCanvas();
    toast(`Bloco "${meta.name}" adicionado à página.`);
  }

  function removeBlock(id) {
    const idx = state.blocks.findIndex(b => b.id === id);
    if (idx !== -1) {
      const removed = state.blocks[idx];
      state.blocks.splice(idx, 1);
      renderCanvas();
      toast(`Bloco "${removed.name}" removido.`);
    }
  }

  function moveBlockUp(id) {
    const idx = state.blocks.findIndex(b => b.id === id);
    if (idx > 0) {
      const temp = state.blocks[idx];
      state.blocks[idx] = state.blocks[idx - 1];
      state.blocks[idx - 1] = temp;
      renderCanvas();
    }
  }

  function moveBlockDown(id) {
    const idx = state.blocks.findIndex(b => b.id === id);
    if (idx !== -1 && idx < state.blocks.length - 1) {
      const temp = state.blocks[idx];
      state.blocks[idx] = state.blocks[idx + 1];
      state.blocks[idx + 1] = temp;
      renderCanvas();
    }
  }

  function editBlockHtml(id) {
    const block = state.blocks.find(b => b.id === id);
    if (!block) return;

    let modal = document.getElementById('editBlockModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editBlockModal';
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editBlockModalTitle"><i class="bi bi-pencil-square me-2"></i>Editar Bloco</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p class="small text-secondary mb-2">Edite o código HTML deste bloco específico. As alterações refletirão no código gerado e na pré-visualização.</p>
              <textarea id="editBlockTextarea" class="form-control font-monospace small" rows="12" style="white-space: pre;"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="saveBlockBtn">Salvar Alterações</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    document.getElementById('editBlockModalTitle').innerHTML = `<i class="bi bi-${block.icon} me-2"></i>Editar Bloco: ${escapeHtml(block.name)}`;
    const textarea = document.getElementById('editBlockTextarea');
    textarea.value = block.html;

    const saveBtn = document.getElementById('saveBlockBtn');
    saveBtn.onclick = () => {
      block.html = textarea.value;
      renderCanvas();
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
      toast(`Bloco "${block.name}" atualizado.`);
    };

    new bootstrap.Modal(modal).show();
  }

  function renderCanvas() {
    if (!els.canvas) return;

    if (state.blocks.length === 0) {
      els.canvas.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-plus-circle fs-1 text-secondary mb-2 d-block"></i>
          <p class="text-secondary mb-1">Clique em qualquer bloco na coluna à esquerda para adicionar à sua página</p>
          <small class="text-secondary opacity-75">Sua página está pronta para receber seções</small>
        </div>`;
      els.canvas.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    } else {
      els.canvas.classList.remove('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
      els.canvas.innerHTML = state.blocks.map((b, i) => `
        <div class="card bg-body border-secondary mb-3 shadow-sm" data-block-id="${b.id}">
          <div class="card-header d-flex justify-content-between align-items-center py-2 bg-body-tertiary">
            <span class="d-flex align-items-center gap-2">
              <i class="bi bi-${b.icon} text-primary"></i>
              <strong>${escapeHtml(b.name)}</strong>
              <span class="badge text-bg-secondary">#${i + 1}</span>
            </span>
            <div class="d-flex align-items-center gap-1">
              <button class="btn btn-sm btn-outline-secondary py-0 px-2" data-move-up="${b.id}" title="Mover para cima" ${i === 0 ? 'disabled' : ''}>
                <i class="bi bi-arrow-up"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary py-0 px-2" data-move-down="${b.id}" title="Mover para baixo" ${i === state.blocks.length - 1 ? 'disabled' : ''}>
                <i class="bi bi-arrow-down"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary py-0 px-2" data-edit="${b.id}" title="Editar HTML">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger py-0 px-2" data-remove="${b.id}" title="Remover bloco">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-body p-0 bg-body-secondary">
            <div class="p-3 small text-secondary font-monospace" style="max-height:140px; overflow:auto; white-space:pre;">${escapeHtml(b.html)}</div>
          </div>
        </div>
      `).join('');

      els.canvas.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => removeBlock(btn.dataset.remove));
      });
      els.canvas.querySelectorAll('[data-move-up]').forEach(btn => {
        btn.addEventListener('click', () => moveBlockUp(btn.dataset.moveUp));
      });
      els.canvas.querySelectorAll('[data-move-down]').forEach(btn => {
        btn.addEventListener('click', () => moveBlockDown(btn.dataset.moveDown));
      });
      els.canvas.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => editBlockHtml(btn.dataset.edit));
      });
    }

    updateBlockBadge();
  }

  function updateBlockBadge() {
    const badge = $('#blocksBadge') || $('.card-header .badge.text-bg-secondary');
    if (badge) badge.textContent = `${state.blocks.length} ${state.blocks.length === 1 ? 'bloco' : 'blocos'}`;
  }

  function bindBlockButtons() {
    // Escuta cliques em todos os botões com data-block no section-templates
    document.querySelectorAll('#section-templates button[data-block]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.block;
        if (type) addBlock(type);
      });
    });
  }

  /* ---------------------------------------------------------
     7. TEMAS — APLICAR E PERSONALIZAR
     --------------------------------------------------------- */
  const THEME_PRESETS = {
    'Azul Corporativo':   { primary: '#0d6efd', secondary: '#6610f2', background: '#ffffff' },
    'Verde Natural':      { primary: '#198754', secondary: '#20c997', background: '#ffffff' },
    'Vermelho Energia':   { primary: '#dc3545', secondary: '#fd7e14', background: '#ffffff' },
    'Escuro Minimalista': { primary: '#0d6efd', secondary: '#495057', background: '#212529' }
  };

  function bindThemePresets() {
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
  }

  function bindThemeInputs() {
    const fontSelect = document.querySelector('#section-temas select');
    const colorInputs = document.querySelectorAll('#section-temas input[type="color"]');
    const extraCss = document.querySelector('#section-temas textarea');

    if (fontSelect) {
      fontSelect.addEventListener('change', e => {
        const val = e.target.value.split(' ')[0]; // 'Inter', 'Roboto', etc.
        state.theme.font = val;
        toast(`Fonte alterada para ${val}.`);
      });
    }

    if (colorInputs[0]) {
      colorInputs[0].addEventListener('input', e => state.theme.primary = e.target.value);
    }
    if (colorInputs[1]) {
      colorInputs[1].addEventListener('input', e => state.theme.secondary = e.target.value);
    }
    if (colorInputs[2]) {
      colorInputs[2].addEventListener('input', e => state.theme.background = e.target.value);
    }
    if (extraCss) {
      extraCss.addEventListener('input', e => state.theme.extraCss = e.target.value);
    }
  }

  /* ---------------------------------------------------------
     8. SEO — BIND DOS CAMPOS
     --------------------------------------------------------- */
  function bindSeoInputs() {
    const seoSection = document.getElementById('section-seo');
    if (!seoSection) return;

    const inputs = seoSection.querySelectorAll('input, textarea, select');
    const mapping = [
      { key: 'title',         match: /^Title/i },
      { key: 'description',   match: /^Description/i },
      { key: 'keywords',      match: /^Keywords/i },
      { key: 'canonical',     match: /^Canonical/i },
      { key: 'robots',        match: /^Robots/i, isSelect: true },
      { key: 'ogTitle',       match: /^og:title/i },
      { key: 'ogDescription', match: /^og:description/i },
      { key: 'ogImage',       match: /^og:image/i },
      { key: 'ogType',        match: /^og:type/i, isSelect: true },
      { key: 'ogLocale',      match: /^og:locale/i }
    ];

    inputs.forEach(input => {
      const label = input.closest('.mb-3, .col-md-6, .col-12')?.querySelector('label')?.textContent.trim() || '';
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
     9. PLUGINS — TOGGLE E ATIVAÇÃO DE BLOCOS EXTRAS
     --------------------------------------------------------- */
  function bindPlugins() {
    const cards = document.querySelectorAll('#section-plugins .plugin-card');
    cards.forEach(card => {
      const key = card.dataset.plugin;
      if (!key) return;

      const toggle = card.querySelector('input[type="checkbox"]');
      if (!toggle) return;

      toggle.addEventListener('change', e => {
        state.plugins[key] = e.target.checked;
        card.classList.toggle('border-primary', e.target.checked);
        updatePluginBlocksVisibility();
        toast(`Plugin "${key}" ${e.target.checked ? 'ativado' : 'desativado'}.`);
      });
    });
  }

  function updatePluginBlocksVisibility() {
    const anyActive = Object.values(state.plugins).some(Boolean);
    const noPluginsMsg = document.getElementById('noPluginsMessage');
    const hintBadge = document.getElementById('pluginBlocksHint');

    if (noPluginsMsg) {
      noPluginsMsg.classList.toggle('d-none', anyActive);
    }

    let activePluginBlocksCount = 0;
    document.querySelectorAll('#pluginBlocks [data-requires]').forEach(el => {
      const req = el.dataset.requires;
      const isActive = !!state.plugins[req];
      el.classList.toggle('d-none', !isActive);
      if (isActive) activePluginBlocksCount++;
    });

    if (hintBadge) {
      hintBadge.textContent = activePluginBlocksCount > 0 ? `${activePluginBlocksCount} ativos` : 'ative plugins';
      hintBadge.className = activePluginBlocksCount > 0 ? 'badge text-bg-primary' : 'badge text-bg-secondary';
    }

    const availableCountEl = document.getElementById('availableBlocksCount');
    if (availableCountEl) {
      availableCountEl.textContent = 9 + activePluginBlocksCount;
    }
  }

  /* ---------------------------------------------------------
     10. GERADOR DE HTML COMPLETO
     --------------------------------------------------------- */
  function buildHead() {
    const s = state.seo;
    const t = state.theme;
    const fontKey = t.font || 'Inter';
    const fontUrl = GOOGLE_FONT_URLS[fontKey] || GOOGLE_FONT_URLS['Inter'];
    const fontFamily = FONT_FAMILIES[fontKey] || FONT_FAMILIES['Inter'];

    const pluginCss = [];
    Object.entries(state.plugins).forEach(([key, on]) => {
      if (!on) return;
      PLUGIN_CDN[key]?.css?.forEach(url => pluginCss.push(`  <link href="${url}" rel="stylesheet">`));
    });

    return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(s.title || 'Meu Site')}</title>
${s.description ? `  <meta name="description" content="${escapeAttr(s.description)}">\n` : ''}${s.keywords ? `  <meta name="keywords" content="${escapeAttr(s.keywords)}">\n` : ''}${s.canonical ? `  <link rel="canonical" href="${escapeAttr(s.canonical)}">\n` : ''}${s.robots ? `  <meta name="robots" content="${escapeAttr(s.robots)}">\n` : ''}  <!-- OpenGraph -->
${s.ogTitle ? `  <meta property="og:title" content="${escapeAttr(s.ogTitle)}">\n` : ''}${s.ogDescription ? `  <meta property="og:description" content="${escapeAttr(s.ogDescription)}">\n` : ''}${s.ogImage ? `  <meta property="og:image" content="${escapeAttr(s.ogImage)}">\n` : ''}  <meta property="og:type" content="${escapeAttr(s.ogType || 'website')}">
  <meta property="og:locale" content="${escapeAttr(s.ogLocale || 'pt_BR')}">

  <!-- Fontes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">

  <!-- Bootstrap 5.3 & Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
${pluginCss.length ? pluginCss.join('\n') + '\n' : ''}
  <!-- Tema Personalizado: ${escapeHtml(t.name)} -->
  <style>
    :root {
      --bs-primary: ${t.primary};
      --bs-secondary: ${t.secondary};
      --bs-body-bg: ${t.background};
      --bs-body-font-family: ${fontFamily};
    }
    body {
      font-family: ${fontFamily};
    }
${t.extraCss ? '    ' + t.extraCss.replace(/\n/g, '\n    ') + '\n' : ''}
  </style>
</head>`.trimEnd();
  }

  function buildBody() {
    if (state.blocks.length === 0) {
      return `<body class="d-flex align-items-center justify-content-center bg-body-tertiary" style="min-height:100vh;">
  <div class="text-center p-4">
    <h3 class="fw-bold mb-2">Página em Construção</h3>
    <p class="text-secondary mb-0">Adicione blocos no Aton WEB Builder para ver seu site aqui.</p>
  </div>
</body>`;
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

    const initScripts = [];
    if (state.plugins.aos) {
      initScripts.push('if (typeof AOS !== "undefined") { AOS.init({ duration: 800, once: true }); }');
    }
    if (state.plugins.fancybox) {
      initScripts.push('if (typeof Fancybox !== "undefined") { Fancybox.bind("[data-fancybox]"); }');
    }
    if (state.plugins.swiper) {
      initScripts.push(`if (typeof Swiper !== "undefined") {
    new Swiper(".myAtonSwiper", {
      loop: true,
      autoplay: { delay: 3500 },
      pagination: { el: ".swiper-pagination", clickable: true }
    });
  }`);
    }
    if (state.plugins.typed) {
      initScripts.push(`if (typeof Typed !== "undefined" && document.getElementById("typedAton")) {
    new Typed("#typedAton", {
      strings: ["de Alta Conversão", "Ultrarrápidos", "100% Responsivos", "Sob Medida"],
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 1800,
      loop: true
    });
  }`);
    }
    if (state.plugins.chartjs) {
      initScripts.push(`if (typeof Chart !== "undefined" && document.getElementById("atonMetricsChart")) {
    new Chart(document.getElementById("atonMetricsChart"), {
      type: "bar",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [{
          label: "Crescimento de Visitas",
          data: [1200, 1900, 3000, 5200, 7800, 11400],
          backgroundColor: "${state.theme.primary}",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } }
      }
    });
  }`);
    }

    return [
      '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>',
      ...pluginJs,
      initScripts.length ? `<script>\n  document.addEventListener("DOMContentLoaded", () => {\n    ${initScripts.join('\n    ')}\n  });\n</script>` : ''
    ].filter(Boolean).join('\n');
  }

  function buildHtml() {
    return `<!DOCTYPE html>\n<html lang="pt-BR" data-bs-theme="light">\n${buildHead()}\n${buildBody()}\n${buildScripts()}\n</html>`;
  }

  /* ---------------------------------------------------------
     11. AÇÕES DE EXPORTAÇÃO E PRÉ-VISUALIZAÇÃO AO VIVO
     --------------------------------------------------------- */
  function getFilename() {
    const raw = (els.projectNameInput?.value || state.projectName || 'meu-projeto').trim();
    return raw.replace(/[^a-zA-Z0-9_-]/g, '_') || 'meu-projeto';
  }

  function downloadHtml() {
    const html = buildHtml();
    const filename = getFilename() + '.html';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Download iniciado: ${filename}`);
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
              <h5 class="modal-title"><i class="bi bi-code-square me-2"></i>HTML Completo Gerado</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
              <pre class="m-0 p-3 small font-monospace" style="max-height:65vh; overflow:auto;"><code id="htmlOutputCode" class="text-body"></code></pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
              <button type="button" class="btn btn-primary" id="copyHtmlBtn">
                <i class="bi bi-clipboard me-1"></i> Copiar Código
              </button>
              <button type="button" class="btn btn-success" id="modalDownloadBtn">
                <i class="bi bi-download me-1"></i> Baixar Arquivo .HTML
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
        toast('HTML copiado para a área de transferência!');
      } catch {
        toast('Falha ao copiar automaticamente. Selecione e copie o texto.');
      }
    };
    document.getElementById('modalDownloadBtn').onclick = downloadHtml;

    new bootstrap.Modal(modal).show();
  }

  function showPreviewModal() {
    const html = buildHtml();
    let modal = document.getElementById('livePreviewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'livePreviewModal';
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content bg-body-tertiary">
            <div class="modal-header py-2 px-3 border-secondary bg-body d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <h6 class="modal-title mb-0 fw-bold"><i class="bi bi-eye me-2 text-primary"></i>Pré-visualização ao Vivo</h6>
                <span class="badge text-bg-secondary" id="previewBlockCount"></span>
              </div>

              <!-- Switcher de Resolução -->
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-secondary active" id="btnViewDesktop" title="Desktop (100%)">
                  <i class="bi bi-display me-1"></i> Desktop
                </button>
                <button type="button" class="btn btn-outline-secondary" id="btnViewTablet" title="Tablet (768px)">
                  <i class="bi bi-tablet me-1"></i> Tablet
                </button>
                <button type="button" class="btn btn-outline-secondary" id="btnViewMobile" title="Mobile (375px)">
                  <i class="bi bi-phone me-1"></i> Mobile
                </button>
              </div>

              <div class="d-flex gap-2 align-items-center">
                <button type="button" class="btn btn-sm btn-outline-secondary" id="btnReloadPreview" title="Recarregar">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button type="button" class="btn btn-sm btn-primary" id="btnPreviewCopy">
                  <i class="bi bi-clipboard me-1"></i> Copiar
                </button>
                <button type="button" class="btn btn-sm btn-success" id="btnPreviewDownload">
                  <i class="bi bi-download me-1"></i> Baixar
                </button>
                <button type="button" class="btn-close ms-2" data-bs-dismiss="modal"></button>
              </div>
            </div>
            <div class="modal-body p-0 d-flex justify-content-center align-items-stretch bg-dark-subtle overflow-hidden">
              <iframe id="previewIframe" title="Live Preview" style="width: 100%; height: 100%; border: none; background: #ffffff; transition: width 0.3s ease;"></iframe>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);

      const iframe = document.getElementById('previewIframe');
      const btnDesk = document.getElementById('btnViewDesktop');
      const btnTab  = document.getElementById('btnViewTablet');
      const btnMob  = document.getElementById('btnViewMobile');

      btnDesk.onclick = () => {
        iframe.style.width = '100%';
        btnDesk.classList.add('active');
        btnTab.classList.remove('active');
        btnMob.classList.remove('active');
      };
      btnTab.onclick = () => {
        iframe.style.width = '768px';
        btnTab.classList.add('active');
        btnDesk.classList.remove('active');
        btnMob.classList.remove('active');
      };
      btnMob.onclick = () => {
        iframe.style.width = '375px';
        btnMob.classList.add('active');
        btnDesk.classList.remove('active');
        btnTab.classList.remove('active');
      };

      document.getElementById('btnReloadPreview').onclick = () => {
        iframe.srcdoc = buildHtml();
      };
      document.getElementById('btnPreviewCopy').onclick = async () => {
        try {
          await navigator.clipboard.writeText(buildHtml());
          toast('HTML copiado para a área de transferência!');
        } catch {
          toast('Falha ao copiar.');
        }
      };
      document.getElementById('btnPreviewDownload').onclick = downloadHtml;
    }

    const countBadge = document.getElementById('previewBlockCount');
    if (countBadge) {
      countBadge.textContent = `${state.blocks.length} blocos`;
    }

    const iframe = document.getElementById('previewIframe');
    if (iframe) {
      iframe.srcdoc = html;
    }

    new bootstrap.Modal(modal).show();
  }

  function bindGlobalActions() {
    // Topbar & Section Gerar
    document.querySelectorAll('header button, #section-gerar button, #btnTopPreview, #btnTopExport').forEach(btn => {
      const txt = btn.textContent.trim().toLowerCase();
      const id = btn.id || '';

      if (id === 'btnTopPreview' || txt.includes('pré-visualizar')) {
        btn.addEventListener('click', showPreviewModal);
      } else if (id === 'btnTopExport' || txt.includes('gerar site') || txt.includes('baixar')) {
        btn.addEventListener('click', downloadHtml);
      } else if (txt.includes('exibir código')) {
        btn.addEventListener('click', showHtmlModal);
      }
    });

    // Project Name input
    if (els.projectNameInput) {
      els.projectNameInput.addEventListener('input', e => {
        state.projectName = e.target.value;
      });
    }

    // Botão "Copiar" da prévia do head
    const copyHeadBtn = document.querySelector('#section-seo .btn-outline-secondary');
    if (copyHeadBtn) {
      copyHeadBtn.addEventListener('click', async () => {
        const code = document.querySelector('#section-seo pre code');
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent);
          toast('Prévia do <head> copiada para a área de transferência.');
        } catch {
          toast('Falha ao copiar.');
        }
      });
    }
  }

  /* ---------------------------------------------------------
     12. UTILITÁRIOS
     --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(str) {
    return String(str || '')
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
    el.className = 'toast align-items-center text-bg-dark border-secondary shadow';
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-check-circle-fill text-success"></i>
          <span>${escapeHtml(message)}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    container.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 2800 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    t.show();
  }

  /* ---------------------------------------------------------
     13. INICIALIZAÇÃO
     --------------------------------------------------------- */
  function init() {
    bindBlockButtons();
    bindThemePresets();
    bindThemeInputs();
    bindSeoInputs();
    bindPlugins();
    bindGlobalActions();
    renderCanvas();
    updateHeadPreview();
    updatePluginBlocksVisibility();

    // Expõe estado no window para depuração ou extensões
    window.AtonBuilder = {
      state,
      buildHtml,
      addBlock,
      removeBlock,
      downloadHtml,
      showPreviewModal,
      showHtmlModal
    };
    console.log('[Aton WEB Builder] Inicializado com sucesso. Disponível em window.AtonBuilder');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();