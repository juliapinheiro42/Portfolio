import { ABOUT_MODULES } from '../../data/about.data';
import { BUG_GRAVEYARD } from '../../data/bug-graveyard.data';
import { PROJECTS } from '../../data/projects.data';

export type TerminalLineKind = 'boot' | 'prompt' | 'output' | 'success' | 'warning' | 'error';
export type CommandAction = 'projects' | 'bugs' | 'contact' | 'hire';

export interface TerminalLine {
  readonly kind: TerminalLineKind;
  readonly text: string;
}

export interface TerminalCommand {
  readonly command: string;
  readonly label: string;
  readonly description: string;
  readonly action?: CommandAction;
}

export const KNOWN_SECRET_COMMANDS = ['sudo hire julia'] as const;

export const AVAILABLE_COMMANDS: readonly TerminalCommand[] = [
  { command: '/help', label: '/help', description: 'list available commands' },
  { command: '/about', label: '/about', description: 'inspect Julia profile' },
  { command: '/projects', label: '/projects', description: 'open selected project files', action: 'projects' },
  { command: '/bugs', label: '/bugs', description: 'open bug graveyard', action: 'bugs' },
  { command: '/skills', label: '/skills', description: 'compile applied skill tree' },
  { command: '/contact', label: '/contact', description: 'open transmission channels', action: 'contact' },
  { command: '/hire', label: '/hire', description: 'start recruitment protocol', action: 'hire' },
  { command: '/lore', label: '/lore', description: 'open origin story file' },
  { command: '/chaos', label: '/chaos', description: 'activate controlled glitch mode' },
  { command: '/secret', label: '/secret', description: 'unlock hidden file' }
];

export const BOOT_SEQUENCE: readonly string[] = [
  '> booting julia.dev...',
  '> loading personality module...',
  '> loading skills...',
  '> scanning projects...',
  '> opening command center...',
  '> system status: available for hire',
  '> system ready.'
];

export function resolveCommandLines(command: string): readonly TerminalLine[] {
  switch (command) {
    case '/help':
      return [
        { kind: 'output', text: 'Main commands:' },
        { kind: 'output', text: '/about      conhecer Julia' },
        { kind: 'output', text: '/projects   ver projetos' },
        { kind: 'output', text: '/bugs       abrir bug graveyard' },
        { kind: 'output', text: '/skills     ver tecnologias aplicadas' },
        { kind: 'output', text: '/contact    abrir contato' },
        { kind: 'output', text: '/lore       open origin story file' },
        { kind: 'output', text: '/hire       iniciar protocolo de contratação' },
        { kind: 'output', text: 'Hidden commands: /lore, /chaos, /secret, sudo hire julia' },
        { kind: 'output', text: 'Interface hint: click the Julia.dev logo 5 times.' }
      ];

    case '/about':
      return [
        { kind: 'output', text: '> Name: Julia Pinheiro' },
        { kind: 'output', text: '> Role: Full Stack Developer' },
        { kind: 'output', text: '> Focus: APIs, AI prototypes, Salesforce automation and expressive interfaces' },
        { kind: 'success', text: '> Status: open to opportunities' }
      ];

    case '/projects':
      return [
        { kind: 'boot', text: '> accessing project database...' },
        { kind: 'boot', text: '> loading case files...' },
        { kind: 'success', text: `> found ${PROJECTS.length} active missions.` },
        ...PROJECTS.map((project, index) => ({
          kind: 'output' as const,
          text: `> Case File #0${index + 1} — ${project.title} :: ${project.tags.slice(0, 4).join(', ')}`
        })),
        { kind: 'success', text: '> routing viewport to project modules...' }
      ];

    case '/bugs':
      return [
        { kind: 'boot', text: '> opening bug graveyard...' },
        { kind: 'success', text: `> ${BUG_GRAVEYARD.length} buried bugs found.` },
        { kind: 'warning', text: '> warning: emotional damage detected.' },
        { kind: 'success', text: '> routing viewport to recovered debug logs...' }
      ];

    case '/skills':
      return [
        { kind: 'boot', text: '> compiling skill tree...' },
        { kind: 'success', text: '> frontend module loaded.' },
        { kind: 'success', text: '> backend module loaded.' },
        { kind: 'success', text: '> architecture module loaded.' },
        ...ABOUT_MODULES.map((module) => ({
          kind: 'output' as const,
          text: `> ${module.title}: ${module.items[0]}`
        })),
        { kind: 'output', text: '> Debugging      LVL 999' }
      ];

    case '/contact':
      return [
        { kind: 'boot', text: '> opening transmission channels...' },
        { kind: 'success', text: '> Email available: juliapinheiro.142@gmail.com' },
        { kind: 'success', text: '> WhatsApp available: +55 21 98912-4775' },
        { kind: 'success', text: '> LinkedIn available.' },
        { kind: 'success', text: '> GitHub available.' },
        { kind: 'output', text: '> type /hire to start a transmission.' },
        { kind: 'success', text: '> routing viewport to contact gateway...' }
      ];

    case '/hire':
    case 'sudo hire julia':
      return [
        ...(command === 'sudo hire julia'
          ? [
              { kind: 'success' as const, text: '> permission granted.' },
              { kind: 'boot' as const, text: '> scanning portfolio...' }
            ]
          : []),
        { kind: 'boot', text: '> initializing recruitment protocol...' },
        { kind: 'boot', text: '> checking availability...' },
        { kind: 'success', text: '> status: open to opportunities' },
        ...(command === 'sudo hire julia'
          ? [
              { kind: 'success' as const, text: '> charisma module: loaded' },
              { kind: 'warning' as const, text: '> debugging powers: unstable but powerful' }
            ]
          : []),
        { kind: 'success', text: '> redirecting to contact module...' }
      ];

    case '/lore':
      return [
        { kind: 'success', text: '> origin file detected.' },
        { kind: 'boot', text: '> loading memory archive...' },
        { kind: 'success', text: '> file found: julia_origin_story.mp4' },
        { kind: 'output', text: '> duration: 00:40' },
        { kind: 'output', text: '> awaiting user confirmation...' }
      ];

    case '/chaos':
      return [
        { kind: 'warning', text: '> chaos mode activated.' },
        { kind: 'warning', text: '> warning: reality may be unstable for 5 seconds.' },
        { kind: 'success', text: '> stabilizing interface...' }
      ];

    case '/secret':
      return [
        { kind: 'success', text: '> secret module detected.' },
        { kind: 'output', text: '> available hidden commands:' },
        { kind: 'output', text: '> sudo hire julia' },
        { kind: 'output', text: '> /lore' },
        { kind: 'output', text: '> /chaos' },
        { kind: 'warning', text: '> hint: the logo is listening.' }
      ];

    default:
      return [
        { kind: 'error', text: '> command not found.' },
        { kind: 'output', text: '> type /help to see available commands.' }
      ];
  }
}
