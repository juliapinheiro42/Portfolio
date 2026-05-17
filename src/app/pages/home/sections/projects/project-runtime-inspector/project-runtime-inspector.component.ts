import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Project } from '../../../../../data/projects.data';

type InspectorTab = 'overview' | 'architecture' | 'technical' | 'stack' | 'repository';

@Component({
  selector: 'app-project-runtime-inspector',
  standalone: true,
  templateUrl: './project-runtime-inspector.component.html',
  styleUrl: './project-runtime-inspector.component.scss'
})
export class ProjectRuntimeInspectorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) project!: Project;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('runtimeDialog') private readonly runtimeDialog?: ElementRef<HTMLElement>;
  @ViewChild('runtimeShell') private readonly runtimeShell?: ElementRef<HTMLElement>;
  @ViewChild('inspectorLayout') private readonly inspectorLayout?: ElementRef<HTMLElement>;
  @ViewChild('inspectorSidebar') private readonly inspectorSidebar?: ElementRef<HTMLElement>;
  @ViewChild('inspectorMain') private readonly inspectorMain?: ElementRef<HTMLElement>;

  readonly tabs: readonly { id: InspectorTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'technical', label: 'Technical Highlights' },
    { id: 'stack', label: 'Stack' },
    { id: 'repository', label: 'Repository' }
  ];

  activeTab: InspectorTab = 'overview';
  simulationActive = false;
  private previousBodyOverflow = '';
  private previousBodyPaddingRight = '';
  private resetScrollTimer?: ReturnType<typeof setTimeout>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  get logs(): readonly string[] {
    return this.simulationActive ? this.project.inspection.activeLogs : this.project.inspection.normalLogs;
  }

  ngAfterViewInit(): void {
    this.lockBodyScroll();
    this.queueInternalScrollReset();

    window.requestAnimationFrame(() => {
      this.focusElement(this.runtimeDialog?.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && !changes['project'].firstChange) {
      this.queueInternalScrollReset();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.resetScrollTimer);
    this.restoreBodyScroll();
  }

  toggleSimulation(): void {
    this.simulationActive = !this.simulationActive;
  }

  selectTab(tab: InspectorTab): void {
    this.activeTab = tab;
    this.queueInternalScrollReset('smooth');
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private lockBodyScroll(): void {
    const body = this.document.body;
    const scrollbarWidth = window.innerWidth - this.document.documentElement.clientWidth;

    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private restoreBodyScroll(): void {
    const body = this.document.body;

    body.style.overflow = this.previousBodyOverflow;
    body.style.paddingRight = this.previousBodyPaddingRight;
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialog = this.runtimeDialog?.nativeElement;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        [
          'a[href]',
          'button:not([disabled])',
          'textarea:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          '[tabindex]:not([tabindex="-1"])'
        ].join(', ')
      )
    ).filter((element) => element.offsetParent !== null || element === this.document.activeElement);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      this.focusElement(dialog);
      return;
    }

    if (event.shiftKey && this.document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && this.document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private queueInternalScrollReset(behavior: ScrollBehavior = 'auto'): void {
    clearTimeout(this.resetScrollTimer);

    this.resetScrollTimer = setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.resetScrollableElement(this.runtimeShell?.nativeElement, behavior);
        this.resetScrollableElement(this.inspectorLayout?.nativeElement, behavior);
        this.resetScrollableElement(this.inspectorSidebar?.nativeElement, behavior);
        this.resetScrollableElement(this.inspectorMain?.nativeElement, behavior);
      });
    }, 50);
  }

  private resetScrollableElement(element: HTMLElement | undefined, behavior: ScrollBehavior): void {
    if (!element) {
      return;
    }

    try {
      element.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    }
  }

  private focusElement(element: HTMLElement | undefined): void {
    if (!element) {
      return;
    }

    try {
      element.focus({ preventScroll: true });
    } catch {
      element.focus();
    }
  }
}
