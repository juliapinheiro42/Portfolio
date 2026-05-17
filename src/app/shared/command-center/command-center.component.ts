import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {
  AVAILABLE_COMMANDS,
  BOOT_SEQUENCE,
  KNOWN_SECRET_COMMANDS,
  resolveCommandLines
} from './command-center.commands';
import type { CommandAction, TerminalCommand, TerminalLine, TerminalLineKind } from './command-center.commands';

@Component({
  selector: 'app-command-center',
  standalone: true,
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss'
})
export class CommandCenterComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('promptInput') private promptInput?: ElementRef<HTMLInputElement>;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;
  @ViewChild('terminalOutput') private terminalOutput?: ElementRef<HTMLElement>;

  readonly availableCommands = AVAILABLE_COMMANDS;
  readonly bootSequence = BOOT_SEQUENCE;

  isOpen = false;
  commandInput = '';
  activeCommandIndex = 0;
  terminalLines: TerminalLine[] = [];

  private readonly isBrowser: boolean;
  private shouldFocusInput = false;
  private shouldScrollOutput = false;
  private previousBodyOverflow = '';
  private highlightTimer?: number;
  private navigationTimer?: number;
  private readonly bootTimers: number[] = [];

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get activeCommand(): TerminalCommand {
    return this.availableCommands[this.activeCommandIndex] ?? this.availableCommands[0];
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusInput && this.promptInput) {
      this.shouldFocusInput = false;
      this.promptInput.nativeElement.focus();
    }

    if (this.shouldScrollOutput && this.terminalOutput) {
      this.shouldScrollOutput = false;
      this.scrollTerminalToBottom(this.terminalOutput.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.unlockBodyScroll();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    const isCommandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

    if (isCommandShortcut) {
      event.preventDefault();
      this.toggle();
      return;
    }

    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveCommandSelection(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveCommandSelection(-1);
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  @HostListener('window:open-command-center')
  openFromEvent(): void {
    this.open();
  }

  open(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.isOpen) {
      this.shouldFocusInput = true;
      return;
    }

    this.clearTimers();
    this.isOpen = true;
    this.commandInput = '';
    this.activeCommandIndex = 0;
    this.terminalLines = [];
    this.shouldFocusInput = true;
    this.lockBodyScroll();
    this.startBootSequence();
    window.dispatchEvent(new CustomEvent('command-center-opened'));
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.commandInput = '';
    this.activeCommandIndex = 0;
    this.clearTimers();
    this.unlockBodyScroll();
    window.dispatchEvent(new CustomEvent('command-center-closed'));
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

  updateCommandInput(value: string): void {
    this.commandInput = value;
  }

  runTypedCommand(): void {
    const command = this.commandInput.trim();

    if (!command) {
      this.runCommand(this.activeCommand.command);
      return;
    }

    this.runCommand(command);
  }

  runCommand(command: string): void {
    const normalizedCommand = this.normalizeCommand(command);
    this.commandInput = '';
    this.appendLine('prompt', `julia.dev@portfolio:~$ ${normalizedCommand}`);

    const commandLines = resolveCommandLines(normalizedCommand);
    commandLines.forEach((line) => this.appendLine(line.kind, line.text));

    const matchedCommand = this.availableCommands.find((item) => item.command === normalizedCommand);
    const isKnownSecretCommand = KNOWN_SECRET_COMMANDS.some((secretCommand) => secretCommand === normalizedCommand);
    const found = !!matchedCommand || isKnownSecretCommand;

    window.dispatchEvent(new CustomEvent('terminal-command-executed', {
      detail: {
        command: normalizedCommand,
        found
      }
    }));

    if (normalizedCommand === '/chaos') {
      window.dispatchEvent(new CustomEvent('activate-chaos-mode'));
    }

    if (normalizedCommand === '/lore') {
      window.dispatchEvent(new CustomEvent('open-lore-transmission'));
    }

    if (normalizedCommand === '/secret') {
      window.dispatchEvent(new CustomEvent('secret-layer-unlocked'));
    }

    if (matchedCommand?.action || normalizedCommand === 'sudo hire julia') {
      this.scheduleNavigation(matchedCommand?.action ?? 'hire');
    }
  }

  @HostListener('window:secret-layer-unlocked')
  onSecretLayerUnlocked(): void {
    if (!this.isOpen) {
      return;
    }

    this.appendLine('success', '> hidden files unlocked.');
    this.appendLine('output', '> opening /classified/julia_notes...');
    this.appendLine('output', '> bug_graveyard.txt :: Here lie the bugs that almost won.');
    this.appendLine('output', '> things_that_worked_yesterday.md :: A tragic archive of code that was working perfectly 24 hours ago.');
    this.appendLine('output', '> emotional_damage_report.json :: {"bugs_defeated":128,"coffee_required":true,"current_status":"still compiling"}');
  }

  @HostListener('window:lore-transmission-completed', ['$event'])
  onLoreTransmissionCompleted(event: Event): void {
    if (!this.isOpen) {
      return;
    }

    const detail = (event as CustomEvent<{ reason: string }>).detail;
    this.appendLine('success', detail?.reason === 'skipped' ? '> lore file skipped.' : '> lore file completed.');
    this.appendLine('output', '> transmission closed.');
    this.appendLine('output', '> current status: still learning, still building, still debugging.');
  }

  setActiveCommandIndex(index: number): void {
    this.activeCommandIndex = index;
  }

  private startBootSequence(): void {
    this.bootSequence.forEach((line, index) => {
      const timer = window.setTimeout(() => {
        this.appendLine(index === this.bootSequence.length - 1 ? 'success' : 'boot', line);
      }, index * 220);

      this.bootTimers.push(timer);
    });

    const helpTimer = window.setTimeout(() => {
      this.appendLine('output', '> type /help or select a command chip.');
    }, this.bootSequence.length * 220 + 180);

    this.bootTimers.push(helpTimer);
  }

  private scheduleNavigation(action: CommandAction | undefined): void {
    if (!action) {
      return;
    }

    if (this.navigationTimer) {
      window.clearTimeout(this.navigationTimer);
    }

    this.navigationTimer = window.setTimeout(() => {
      const targetId = action === 'projects' ? 'projects' : action === 'bugs' ? 'bugs' : 'contact';
      const target = this.document.getElementById(targetId);

      this.close();

      window.setTimeout(() => {
        this.scrollTargetIntoView(target);

        if (target) {
          this.highlightTarget(target);
        }
      }, 80);
    }, 1050);
  }

  private appendLine(kind: TerminalLineKind, text: string): void {
    this.terminalLines = [...this.terminalLines, { kind, text }];
    this.shouldScrollOutput = true;
  }

  private scrollTerminalToBottom(element: HTMLElement): void {
    try {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    } catch {
      element.scrollTop = element.scrollHeight;
    }
  }

  private scrollTargetIntoView(target: HTMLElement | null): void {
    if (!target) {
      return;
    }

    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      target.scrollIntoView();
    }
  }

  private moveCommandSelection(direction: number): void {
    const commandCount = this.availableCommands.length;
    this.activeCommandIndex = (this.activeCommandIndex + direction + commandCount) % commandCount;
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.panel?.nativeElement.querySelectorAll<HTMLElement>(
      'button, input, [href], [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) {
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private highlightTarget(target: HTMLElement): void {
    target.classList.add('command-target-pulse');

    if (this.highlightTimer) {
      window.clearTimeout(this.highlightTimer);
    }

    this.highlightTimer = window.setTimeout(() => {
      target.classList.remove('command-target-pulse');
    }, 1700);
  }

  private lockBodyScroll(): void {
    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.document.body.style.overflow = this.previousBodyOverflow;
  }

  private clearTimers(): void {
    if (!this.isBrowser) {
      return;
    }

    while (this.bootTimers.length) {
      const timer = this.bootTimers.pop();

      if (timer) {
        window.clearTimeout(timer);
      }
    }

    if (this.navigationTimer) {
      window.clearTimeout(this.navigationTimer);
      this.navigationTimer = undefined;
    }

    if (this.highlightTimer) {
      window.clearTimeout(this.highlightTimer);
      this.highlightTimer = undefined;
    }
  }

  private normalizeCommand(command: string): string {
    const normalizedCommand = command.trim().toLowerCase();

    if (normalizedCommand.startsWith('sudo ')) {
      return normalizedCommand;
    }

    return normalizedCommand.startsWith('/') ? normalizedCommand : `/${normalizedCommand}`;
  }
}
