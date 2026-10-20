Para o cenário da Aton WEB (PHP puro + MySQL + Bootstrap 5.3), a escolha entre **2FA OTP e CSRF** deve ser: **CSRF como proteção obrigatória em todos os formulários, e OTP como um segundo fator opcional apenas para o login do administrador**. O motivo é que CSRF resolve um problema de segurança fundamental (requisições forjadas) e é barato de implementar; OTP agrega complexidade de gerenciamento de dispositivos e códigos de backup, o que pode ser excessivo para um sistema interno simples, mas ainda assim útil para o "adm" que gerencia tudo.

Abaixo seguem as etapas organizadas para construir o sistema, com as decisões técnicas e de arquitetura para cada módulo.

### 🔐 Etapa 1: Autenticação e Controle de Acesso

O sistema precisa distinguir **Administrador** (acesso total) de **Editor** (acesso às ferramentas de criação).

**1.1 Estrutura de Banco e Sessão**
- Tabela `usuarios` com campos: `id`, `nome`, `email`, `senha_hash`, `papel` (enum: `admin`, `editor`), `otp_secret` (nullable), `criado_em`.
- A senha deve usar `password_hash()` com `PASSWORD_DEFAULT`.
- A sessão deve ser regenerada após o login (`session_regenerate_id(true)`) para prevenir fixação de sessão.

**1.2 Proteção CSRF (Obrigatória)**
Como o sistema terá muitos formulários (criar template, salvar SEO, ativar plugins), o CSRF é indispensável. A implementação é simples:
- No início de cada sessão, gerar um token: `$_SESSION['csrf_token'] = bin2hex(random_bytes(32));`
- Em cada formulário, incluir um campo oculto: `<input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">`
- No processamento do POST, verificar com `hash_equals()` se o token recebido confere com o da sessão. Se não, abortar com HTTP 403.

A referência técnica confirma que CSRF e OTP são mecanismos diferentes: CSRF protege a **intenção** da requisição, enquanto OTP autentica a **identidade** do usuário. Para um projeto simples, priorizar o CSRF é o caminho correto.

**1.3 OTP para o Admin (Opcional, mas Recomendado)**
Se o cliente exigir 2FA, a implementação mais direta em PHP puro é via **TOTP** (Time-based One-Time Password), compatível com Google Authenticator. Bibliotecas como `pragmarx/google2fa` podem ser instaladas via Composer para evitar reinventar a geração de códigos.
- No cadastro do admin, gerar um segredo e exibir um QR Code.
- No login, após validar a senha, solicitar o código de 6 dígitos e validar com a biblioteca.
- Para a Aton WEB, isso agrega valor de segurança sem comprometer a simplicidade, desde que restrito ao usuário `admin`.

**1.4 CRUD de Usuários**
Apenas o `admin` pode listar, criar, editar e desativar usuários `editor`. O editor não vê essa seção no menu. A verificação é feita no topo de cada página restrita: `if ($_SESSION['papel'] !== 'admin') { header('Location: dashboard.php'); exit; }`.

---

### 📊 Etapa 2: Dashboard e Módulos de Construção

O menu lateral deve ser fixo em desktop e colapsável em mobile, usando o componente **Offcanvas** ou **Sidebar** do Bootstrap 5.3.

**2.1 Templates (Construtor de Seções)**
Em vez de um editor visual complexo, a abordagem mais viável para PHP puro é um **sistema de seleção e ordenação de blocos**.
- O usuário escolhe os blocos desejados: Navbar, Hero, CTA, Footer, etc.
- O sistema armazena a escolha em uma tabela `templates_blocos` (ou JSON na sessão) com a ordem definida.
- Ao renderizar o preview, um `foreach` inclui o arquivo PHP parcial correspondente a cada bloco.

**2.2 Temas (CSS e Variáveis)**
- Criar uma tabela `temas` com campos para `nome`, `fonte_primaria`, `cor_primaria`, `cor_secundaria`, `cor_fundo`, `css_extra`.
- O usuário pode escolher um tema pronto ou montar o seu.
- O sistema gera um `<style>` dinâmico no `<head>` do preview, sobrescrevendo as variáveis CSS do Bootstrap (`:root { --bs-primary: #...; }`).

**2.3 SEO (Metatags e OpenGraph)**
- Formulário simples com campos: `title`, `description`, `og_image`, `og_type`.
- Ao gerar o site, esses valores são injetados no `<head>` do HTML final.
- Para manter o sistema leve, não é necessário biblioteca externa; a renderização manual das tags é suficiente.

**2.4 Plugins via CDN**
- Criar uma tabela `plugins` com os registros fixos: Animate.css, GSAP, SplideJS, SwiperJS, TypedJS, ChartJS, Fancybox, AOS.
- O admin (ou editor) marca quais plugins deseja ativar para aquele projeto.
- O sistema armazena os IDs ativos e, na geração do site, insere os `<link>` e `<script>` correspondentes no HTML.

**2.5 Integração Plugins ↔ Templates**
Se um plugin estiver ativo, ele aparece como opção no construtor de templates. Por exemplo: se o **SwiperJS** estiver ativo, o bloco "Carousel" fica disponível para ser adicionado à página. Se o **AOS** estiver ativo, as seções ganham automaticamente os atributos `data-aos` no HTML gerado.

---

### 📤 Etapa 3: Geração e Exportação do Site

O botão **"Gerar SITE"** deve compilar o que foi montado e produzir uma saída utilizável.

**3.1 Estratégia de Saída**
Como o sistema não terá um servidor de arquivos complexo, a geração pode ser feita de duas formas:
- **Download de um `.zip`**: O PHP compila o HTML final (com CSS e JS embutidos ou links CDN) e cria um arquivo temporário para download. Requer a extensão `ZipArchive`.
- **Exibição em modal com "Copiar"**: Para facilitar a vida do cliente da agência, exibir o HTML gerado em um `<textarea>` ou `<pre>` dentro de um modal Bootstrap, com um botão "Copiar para a área de transferência" (JavaScript `navigator.clipboard.writeText()`).

**3.2 Estrutura do HTML Gerado**
O PHP deve montar uma string com:
1. `<!DOCTYPE html>` e `<html>`.
2. `<head>` com: Bootstrap 5.3 (CDN), os plugins ativos (CDN), o CSS do tema dinâmico e as metatags de SEO.
3. `<body>` com os blocos na ordem escolhida.
4. `<script>` do Bootstrap e dos plugins.

**3.3 Segurança na Geração**
Ao interpolar variáveis do usuário (título SEO, cores, etc.) no HTML final, usar `htmlspecialchars()` para evitar quebra de layout ou injeção de scripts no site exportado.

---

### 🗄️ Resumo do Banco (Tabelas Principais)

| Tabela | Campos Essenciais |
| :--- | :--- |
| `usuarios` | `id`, `nome`, `email`, `senha_hash`, `papel`, `otp_secret` |
| `projetos` | `id`, `nome`, `usuario_id`, `tema_id`, `seo_json`, `plugins_ativos_json`, `template_json` |
| `temas` | `id`, `nome`, `fonte`, `cor_primaria`, `cor_secundaria`, `cor_fundo` |
| `plugins` | `id`, `nome`, `cdn_css`, `cdn_js`, `ativo` (global) |

Essa estrutura mantém o sistema simples o suficiente para rodar em qualquer hospedagem PHP/MySQL padrão, mas com a organização necessária para a agência escalar os projetos dos clientes.
