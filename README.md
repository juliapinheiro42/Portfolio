# Julia.dev Portfolio

Portfolio interativo da Julia Pinheiro, construído em Angular com uma estética cyber/dreamy, glitch, terminal/dev e interface operacional viva. O projeto combina apresentação profissional, projetos técnicos reais, estudo de caso, Command Center interativo, easter eggs, mascote assistente, Bug Graveyard e uma experiência inicial cinematográfica.

## Stack

- Angular 19
- TypeScript strict mode
- Standalone components
- SCSS
- Angular Reactive Forms
- Angular Router
- RxJS
- Karma/Jasmine para testes

## Como Rodar

Instale as dependências:

```bash
npm install
```

Suba o servidor local:

```bash
npm start
```

Acesse:

```text
http://localhost:4200/
```

Build de produção:

```bash
npm run build
```

Testes:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

O projeto não possui script de lint configurado atualmente.

## Scripts Disponíveis

| Script          | Função                                           |
| --------------- | ------------------------------------------------ |
| `npm start`     | Inicia `ng serve` em modo desenvolvimento        |
| `npm run build` | Gera build de produção em `dist/julia-portfolio` |
| `npm run watch` | Build em modo watch com configuração development |
| `npm test`      | Executa testes com Karma/Jasmine                 |

## Rotas

As rotas ficam em `src/app/app.routes.ts`.

| Rota | Componente | Observação |
| ---
| ---
| ---
|
| `/` | `HomeComponent` | Página principal do portfolio |
| `/projects/skinmatch-ai` | lazy-loaded `SkinmatchAiCaseStudyComponent` | Case study completo do SkinMatch AI |
| `**` | redirect | Redireciona para home |

O case study é carregado sob demanda com `loadComponent`, reduzindo o peso inicial dessa página.

## Arquitetura Geral

```text
src/
  app/
    components/              # Componentes de interface globais
      intro-screen/          # Intro inicial glitch/corruption
      navbar/                # Navegação principal
    config/                  # Configurações visuais e de motion
    data/                    # Dados editáveis do portfolio
    pages/
      home/                  # Home e seções principais
      project-case-studies/  # Páginas de estudo de caso
    services/                # Services Angular
    shared/                  # Componentes/diretivas reutilizáveis
```

O projeto usa standalone components. Não existe `AppModule`; o bootstrap acontece em `src/main.ts` usando `bootstrapApplication(AppComponent, appConfig)`.

## Fluxo da Aplicação

1. O app inicia em `AppComponent`.
2. Se o usuário está na home, a intro glitch aparece primeiro.
3. Ao finalizar a intro, a home é liberada com navbar, Command Center, Lore Modal e Mascot Assistant.
4. A home renderiza as seções principais:
   - Hero
   - About / Stack
   - Case Files / Projects
   - Bug Graveyard
   - Contact
5. Se o usuário acessa `/projects/skinmatch-ai`, a intro é pulada e a página de case study abre diretamente no topo.

## App Root

Arquivo principal:

```text
src/app/app.component.ts
```

Responsabilidades:

- Controlar exibição da intro inicial.
- Detectar se a rota atual é uma página de projeto.
- Ativar/desativar chaos mode.
- Exibir toast de camada secreta.
- Contar cliques no logo para desbloquear easter egg.
- Renderizar componentes globais como Navbar, Command Center, Lore Modal e Mascot Assistant.

O componente usa `takeUntilDestroyed` para limpar a subscription do Router e `OnDestroy` para limpar timers.

## Intro Inicial

Arquivos:

```text
src/app/components/intro-screen/
```

A intro é a abertura glitch/corruption do site. Ela simula uma interface quebrando/quase desligando antes de liberar o portfolio.

Características:

- Mensagem principal `Julia.dev is glitching...`
- Flicker, tearing, scanlines e blackout curto
- Suporte a `prefers-reduced-motion`
- Duração controlada no componente/SCSS
- Emite `finished` para o `AppComponent`

## Hero e Reconstrução

Arquivos:

```text
src/app/pages/home/sections/hero/
src/app/pages/home/sections/hero/hero-reconstruction/
src/app/config/hero-reconstruction.config.ts
```

O Hero apresenta Julia como Full Stack Developer e cria a sensação de sistema reconstruído depois da intro.

A configuração da reconstrução fica em:

```text
src/app/config/hero-reconstruction.config.ts
```

Você pode ajustar:

- `totalDurationMs`
- `reducedMotionDurationMs`
- `glitchStartMs`
- `glitchEndMs`
- `statusLines`
- `modules`

## About e Stack

Arquivos:

```text
src/app/pages/home/sections/about/
src/app/data/about.data.ts
```

A seção About explica o posicionamento profissional e a Stack mostra competências aplicadas, não só lista de ferramentas.

Dados editáveis:

```text
ABOUT_MODULES
ABOUT_STATS
PROFILE_LINES
```

Exemplo de módulo:

```ts
{
  label: 'Backend',
  title: 'API Layer',
  items: [
    'Build REST APIs with ASP.NET Core',
    'Model relational data with EF Core'
  ]
}
```

## Projects / Case Files

Arquivos:

```text
src/app/pages/home/sections/projects/
src/app/data/projects.data.ts
```

A seção de projetos funciona como `Case Files`, com cards em estilo dossiê técnico. Cada projeto representa um sistema/protótipo real.

Projetos atuais:

1. SkinMatch AI
2. Perfumaria AI
3. TechCare Support
4. Corretor Imobiliário API

Cada projeto possui:

- Título
- Categoria/tipo
- Status
- Complexidade
- Problema
- Solução
- Papel da Julia(eu)
- Boss fight
- Features
- Stack/tags
- Link GitHub
- Dados para o Project Runtime Inspector
- Technical Breakdown

Para editar projetos, altere:

```text
src/app/data/projects.data.ts
```

## Project Runtime Inspector

Arquivos:

```text
src/app/pages/home/sections/projects/project-runtime-inspector/
```

É o modal amplo de inspeção de projetos, funcionando como uma mini case-study/runtime view.

Tabs:

- Overview
- Architecture
- Technical Highlights
- Stack
- Repository

Boas práticas implementadas:

- `role="dialog"`
- `aria-modal="true"`
- Fechamento com `Escape`
- Focus trap
- Body scroll lock
- Reset do scroll interno ao abrir/trocar projeto
- Retorno de foco para o botão que abriu

## SkinMatch AI Case Study

Arquivos:

```text
src/app/pages/project-case-studies/skinmatch-ai-case-study/
```

Rota:

```text
/projects/skinmatch-ai
```

Esta página apresenta o projeto SkinMatch AI como um protótipo full stack com IA para apoio à decisão em skincare. O texto evita linguagem médica, diagnóstico ou promessa de precisão dermatológica.

## Bug Graveyard

Arquivos:

```text
src/app/pages/home/sections/bug-graveyard/
src/app/data/bug-graveyard.data.ts
```

Seção criativa e técnica que mostra bugs reais enfrentados e resolvidos.

Cada bug possui:

- `id`
- `title`
- `status`
- `category`
- `severity`
- `context`
- `error`
- `fix`
- `lesson`
- `skills`

O modal `Death Certificate` possui:

- Focus trap
- Fechamento com `Escape`
- Body scroll lock
- Retorno de foco ao botão de origem

## Contact

Arquivos:

```text
src/app/pages/home/sections/contact/
src/app/services/contact.service.ts
src/app/data/social-links.data.ts
```

A seção Contact possui um formulário reativo com validações básicas:

- Nome obrigatório, mínimo 2 caracteres
- E-mail obrigatório e válido
- Mensagem obrigatória, mínimo 20 caracteres

Atualmente o envio é simulado por `ContactService` usando `of(payload).pipe(delay(1400))`. Não há backend real conectado.

Links sociais editáveis:

```text
src/app/data/social-links.data.ts
```

Inclui:

- GitHub
- LinkedIn
- E-mail
- WhatsApp
- Resume PDF

## Command Center

Arquivos:

```text
src/app/shared/command-center/
```

O Command Center é uma interface de terminal/modal que transforma a navegação em uma experiência de sistema operacional.

Atalhos:

- `Ctrl + K` no Windows/Linux
- `Cmd + K` no Mac
- `Esc` fecha
- Setas navegam pelos chips
- `Enter` executa comando digitado

Comandos principais:

```text
/help
/about
/projects
/bugs
/skills
/contact
/hire
/lore
/chaos
/secret
sudo hire julia
```

Definições e respostas dos comandos:

```text
src/app/shared/command-center/command-center.commands.ts
```

O Command Center também emite eventos globais usados por outras partes da experiência, como mascote, chaos mode e lore modal.

## Lore Video

Arquivos:

```text
src/app/shared/lore-video-modal/
public/assets/lore/julia-lore.mp4
```

O comando `/lore` abre uma transmissão em vídeo com a origin story.

Comportamento:

- Modal fullscreen/overlay
- Play somente após ação do usuário
- Botões de close, skip e mute/unmute
- `Escape` fecha
- Focus trap
- Body scroll lock
- Ao terminar ou pular, envia evento para o Command Center e Mascot Assistant

O vídeo usa:

```text
/assets/lore/julia-lore.mp4
```

## Mascot Assistant

Arquivos:

```text
src/app/shared/mascot-assistant/
```

O mascote funciona como assistente contextual (`Juno.exe`). Ele reage a:

- Scroll por seções
- Abertura do Command Center
- Comandos executados
- Easter eggs
- Lore transmission
- Inatividade do usuário

Mensagens principais ficam em:

```text
src/app/shared/mascot-assistant/mascot-assistant.component.ts
```

## Easter Eggs

Existem interações secretas opcionais:

- `/secret`
- `/chaos`
- `/lore`
- `sudo hire julia`
- clicar no logo `Julia.dev` 5 vezes

Quando a camada secreta é desbloqueada, o app mostra:

```text
[ACCESS GRANTED]
Hidden layer unlocked.
```

## Componentes Compartilhados

```text
src/app/shared/
```

Principais itens:

- `command-center`: terminal interativo
- `interactive-background`: fundo interativo/parallax
- `lore-video-modal`: player modal da origin story
- `magnetic-card`: diretiva de tilt/mouse proximity
- `mascot-assistant`: assistente Juno.exe
- `section-header`: header reutilizável de seção
- `section-shell`: wrapper de seção com estados visuais/motion
- `system-boot`: boot visual curto
- `system-map`: mapa visual de arquitetura no Hero

## Configurações Visuais

```text
src/app/config/
```

Arquivos importantes:

- `hero-reconstruction.config.ts`: timing e textos da reconstrução do Hero
- `section-states.config.ts`: moods/estados visuais das seções
- `system-map.config.ts`: nós, conexões e partículas do mapa de arquitetura

Esses arquivos são os melhores pontos para ajustar intensidade visual sem mexer diretamente nos componentes.

## Dados Editáveis

```text
src/app/data/
```

| Arquivo                 | Conteúdo                                         |
| ----------------------- | ------------------------------------------------ |
| `about.data.ts`         | Stack aplicada, stats e linhas do perfil         |
| `projects.data.ts`      | Projetos, inspector, technical breakdown e links |
| `bug-graveyard.data.ts` | Bugs resolvidos e detalhes técnicos              |
| `social-links.data.ts`  | GitHub, LinkedIn, e-mail, WhatsApp e resume      |

## Acessibilidade

O projeto inclui cuidados básicos:

- Modais com `role="dialog"` e `aria-modal="true"`
- Fechamento via `Escape`
- Focus trap em modais principais
- Labels em inputs do formulário
- Mensagens de erro no formulário
- `aria-live` em feedbacks/status
- Botões usados como botões e links usados como links
- Suporte a `prefers-reduced-motion` em animações principais

## Performance

Pontos já aplicados:

- Case study lazy-loaded por rota
- Standalone components
- `ChangeDetectionStrategy.OnPush` em componentes seguros/presentacionais
- Timers, requestAnimationFrame e observers limpos em `ngOnDestroy`
- `eventCoalescing` ativado em `app.config.ts`

Pontos de atenção:

- O bundle inicial fica perto do budget configurado em `angular.json`.
- O vídeo de lore é um asset pesado. Uma versão `.webm` otimizada pode melhorar carregamento.
- Command Center, Lore Modal e Mascot Assistant são globais porque fazem parte da experiência do sistema, mas poderiam ser carregados mais tarde numa refatoração futura.

## Segurança

Cuidados atuais:

- Não há tokens, senhas ou API keys no código.
- Links externos usam `rel="noopener noreferrer"`.
- Não há uso de `eval`, `innerHTML` ou `bypassSecurityTrustHtml`.
- Dados do usuário no formulário não são enviados para backend real no estado atual.

Se o formulário for conectado a um backend futuramente, implemente validação server-side, proteção contra spam e tratamento real de erro.

## Como Adicionar um Projeto

1. Abra:

```text
src/app/data/projects.data.ts
```

2. Adicione um novo objeto seguindo a interface `Project`.
3. Preencha:
   - Dados do card
   - `systemFlow`
   - `highlights`
   - `inspection`
   - `technicalBreakdown`
   - `githubUrl`
4. O projeto aparecerá automaticamente na seção Case Files.

## Como Adicionar um Bug ao Graveyard

1. Abra:

```text
src/app/data/bug-graveyard.data.ts
```

2. Adicione um item seguindo `BugGraveyardItem`.
3. A seção atualizará o contador e renderizará o novo card automaticamente.

## Como Editar Contatos

Abra:

```text
src/app/data/social-links.data.ts
```

Edite ou adicione links no array `SOCIAL_LINKS`.

## Como Editar Comandos do Terminal

Abra:

```text
src/app/shared/command-center/command-center.commands.ts
```

Para adicionar um comando:

1. Adicione o comando em `AVAILABLE_COMMANDS`.
2. Adicione um `case` em `resolveCommandLines`.
3. Se ele precisar navegar, use uma action existente ou crie uma nova em `CommandAction`.
4. Se outros componentes precisarem reagir, emita um evento no `CommandCenterComponent`.

## Build Budgets

Os budgets estão em:

```text
angular.json
```

Configuração atual:

- Initial warning: `690kB`
- Initial error: `1MB`
- Component style warning: `23kB`
- Component style error: `24kB`

## Testes

Os testes atuais cobrem componentes principais como app, navbar, contact, home, intro, projects e inspector.

Rodar:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

## Manutenção Recomendada

Próximos passos úteis:

- Adicionar ESLint/Prettier.
- Criar um `UiEventService` para substituir eventos globais via `window.dispatchEvent`.
- Dividir `ProjectRuntimeInspector` em subcomponentes menores.
- Otimizar `public/assets/lore/julia-lore.mp4`.
- Adicionar testes para Command Center, Lore Modal, Bug Graveyard e Mascot Assistant.
- Avaliar lazy loading de partes globais não essenciais sem prejudicar a narrativa da intro.

## Identidade do Projeto

Este portfolio busca comunicar:

```text
Full Stack Developer focused on APIs, intelligent systems and expressive interfaces.
```

A experiência visual é parte da proposta: A ideia era sair dos portfolios que são apenas uma landing page, o transformando em uma interface viva do sistema `julia.dev`, com comandos, arquivos secretos, projetos inspecionáveis e uma camada narrativa técnica.
