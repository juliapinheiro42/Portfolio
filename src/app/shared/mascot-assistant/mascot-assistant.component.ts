import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

type AssistantSection = 'home' | 'about' | 'stack' | 'projects' | 'bugs' | 'contact';

const SECTION_MESSAGES: Record<AssistantSection, string> = {
  home: 'System online. Welcome to Julia.dev.',
  about: 'She builds interfaces, APIs and creative digital experiences.',
  stack: 'Skill tree loaded. Debugging level: dangerously high.',
  projects: 'Opening mission archive. These files contain real builds.',
  bugs: 'Careful. Some of these bugs almost won.',
  contact: 'Transmission channels available. Recruiters may proceed.'
};

const COMMAND_MESSAGES: Record<string, string> = {
  '/about': 'Opening identity file.',
  '/projects': 'Mission archive unlocked.',
  '/bugs': 'Debug logs recovered. Proceed with caution.',
  '/skills': 'Compiling skill tree.',
  '/contact': 'Transmission channel ready.',
  '/secret': 'I was not supposed to show you that.',
  '/lore': 'Opening origin file. This one is special.',
  '/chaos': 'Please do not press that again. Just kidding.',
  '/hire': 'Recruitment protocol looks promising.',
  'sudo hire julia': 'Permission granted. Excellent taste.'
};

@Component({
  selector: 'app-mascot-assistant',
  standalone: true,
  templateUrl: './mascot-assistant.component.html',
  styleUrl: './mascot-assistant.component.scss'
})
export class MascotAssistantComponent implements OnInit, OnDestroy {
  message = SECTION_MESSAGES.home;
  isBubbleOpen = true;
  isCommandCenterOpen = false;
  activeSection: AssistantSection = 'home';

  private readonly isBrowser: boolean;
  private scrollFrame?: number;
  private idleTimer?: number;
  private resetTimer?: number;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateSectionMessage();
    this.resetIdleTimer();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.scrollFrame) {
      window.cancelAnimationFrame(this.scrollFrame);
    }

    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
    }

    if (this.resetTimer) {
      window.clearTimeout(this.resetTimer);
    }
  }

  toggleBubble(): void {
    this.isBubbleOpen = !this.isBubbleOpen;

    if (this.isBubbleOpen) {
      this.setTemporaryMessage(this.message);
    }
  }

  minimizeBubble(): void {
    this.isBubbleOpen = false;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser || this.scrollFrame) {
      return;
    }

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = undefined;
      this.updateSectionMessage();
      this.resetIdleTimer();
    });
  }

  @HostListener('window:pointermove')
  @HostListener('window:keydown')
  onUserActivity(): void {
    this.resetIdleTimer();
  }

  @HostListener('window:open-command-center')
  @HostListener('window:command-center-opened')
  onCommandCenterOpen(): void {
    this.isCommandCenterOpen = true;
    this.setTemporaryMessage('Try typing /help. Some commands are not what they seem.');
  }

  @HostListener('window:command-center-closed')
  onCommandCenterClosed(): void {
    this.isCommandCenterOpen = false;
  }

  @HostListener('window:terminal-command-executed', ['$event'])
  onTerminalCommand(event: Event): void {
    const detail = (event as CustomEvent<{ command: string; found: boolean }>).detail;

    if (!detail?.found) {
      this.setTemporaryMessage('That command does not exist... yet.');
      return;
    }

    this.setTemporaryMessage(COMMAND_MESSAGES[detail.command] ?? 'Command acknowledged.');
  }

  @HostListener('window:secret-layer-unlocked')
  onSecretUnlocked(): void {
    this.setTemporaryMessage('Access granted. I knew you were curious.');
  }

  @HostListener('window:activate-chaos-mode')
  onChaosMode(): void {
    this.setTemporaryMessage('Please do not press that again. Just kidding.');
  }

  @HostListener('window:lore-transmission-completed')
  onLoreTransmissionCompleted(): void {
    this.setTemporaryMessage('Transmission closed. The story is still being written.');
  }

  private updateSectionMessage(): void {
    const sections: readonly AssistantSection[] = ['home', 'about', 'stack', 'projects', 'bugs', 'contact'];
    const current = sections
      .map((id) => ({
        id,
        top: this.document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      }))
      .filter((section) => section.top <= 220)
      .pop();

    if (!current || current.id === this.activeSection) {
      return;
    }

    this.activeSection = current.id;
    this.message = SECTION_MESSAGES[current.id];
    this.isBubbleOpen = true;
  }

  private setTemporaryMessage(message: string): void {
    this.message = message;
    this.isBubbleOpen = true;

    if (this.resetTimer) {
      window.clearTimeout(this.resetTimer);
    }

    this.resetTimer = window.setTimeout(() => {
      this.message = SECTION_MESSAGES[this.activeSection];
    }, 5200);
  }

  private resetIdleTimer(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
    }

    this.idleTimer = window.setTimeout(() => {
      this.setTemporaryMessage('Still there? Try exploring the Command Center.');
    }, 18000);
  }
}
