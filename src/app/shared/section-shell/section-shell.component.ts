import { isPlatformBrowser, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { SECTION_STATES } from '../../config/section-states.config';

export type SectionVariant = 'hero' | 'about' | 'projects' | 'contact';

@Component({
  selector: 'app-section-shell',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './section-shell.component.html',
  styleUrl: './section-shell.component.scss'
})
export class SectionShellComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) sectionId = '';
  @Input({ required: true }) labelledBy = '';
  @Input({ required: true }) variant: SectionVariant = 'hero';
  @Input() extraClass = '';

  readonly sectionStates = SECTION_STATES;

  get stateConfig() {
    return this.sectionStates[this.variant];
  }

  get stateStyleVars(): Record<string, string> {
    return this.stateConfig.cssVars;
  }

  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private shellElement?: HTMLElement;
  private animationFrame?: number;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private revealObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;
  private readonly revealTimers: ReturnType<typeof setTimeout>[] = [];
  private signalTimer?: ReturnType<typeof setTimeout>;
  private signalReleaseTimer?: ReturnType<typeof setTimeout>;
  private signalGhostTimer?: ReturnType<typeof setTimeout>;
  private scrollSettleTimer?: ReturnType<typeof setTimeout>;
  private isSectionVisible = false;
  private lastScrollY = 0;
  private lastScrollTime = 0;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.shellElement = this.elementRef.nativeElement.querySelector('.section-shell') ?? undefined;

    if (!this.shellElement || this.prefersReducedMotion) {
      return;
    }

    this.prepareScrollReveals();
    this.observeSectionProgress();
    this.applyStateVariables();
    this.updateDepth();
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }

    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();
    this.revealTimers.forEach((timer) => clearTimeout(timer));
    this.clearSignalTimers();
    clearTimeout(this.scrollSettleTimer);
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canAnimate || event.pointerType === 'touch') {
      return;
    }

    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    this.targetX = (event.clientX / width - 0.5) * 2;
    this.targetY = (event.clientY / height - 0.5) * 2;
    this.queueDepthUpdate();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (!this.canAnimate) {
      return;
    }

    this.updateScrollInstability();
    this.queueDepthUpdate();
  }

  private get canAnimate(): boolean {
    return this.isBrowser && !this.prefersReducedMotion && !!this.shellElement;
  }

  private get prefersReducedMotion(): boolean {
    return this.reduceMotionQuery?.matches ?? false;
  }

  private queueDepthUpdate(): void {
    if (this.animationFrame) {
      return;
    }

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.updateDepth();
    });
  }

  private updateDepth(): void {
    if (!this.shellElement) {
      return;
    }

    this.currentX += (this.targetX - this.currentX) * 0.12;
    this.currentY += (this.targetY - this.currentY) * 0.12;

    const rect = this.shellElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const scrollDepth = this.clamp((viewportHeight * 0.5 - rect.top) / viewportHeight, -1.15, 1.15);
    const pointerScale = window.matchMedia('(pointer: coarse)').matches ? 0.35 : 1;
    const x = this.currentX * pointerScale;
    const y = this.currentY * pointerScale;

    const energy = Number(this.stateConfig.cssVars['--state-energy'] ?? 1);

    this.setDepthVariable('--depth-grid-x', `${x * 5 * energy}px`);
    this.setDepthVariable('--depth-grid-y', `${y * 3 * energy + scrollDepth * 7 * energy}px`);
    this.setDepthVariable('--depth-aura-x', `${x * 8 * energy}px`);
    this.setDepthVariable('--depth-aura-y', `${y * 5 * energy + scrollDepth * 12 * energy}px`);
    this.setDepthVariable('--depth-particles-x', `${x * 10 * energy}px`);
    this.setDepthVariable('--depth-particles-y', `${y * 7 * energy + scrollDepth * 16 * energy}px`);
    this.setDepthVariable('--depth-content-x', `${x * -1.2}px`);
    this.setDepthVariable('--depth-content-y', `${y * -0.8 + scrollDepth * -2}px`);
    this.setDepthVariable('--depth-light-x', `${50 + x * 5}%`);
    this.setDepthVariable('--depth-light-y', `${28 + y * 4}%`);
    this.setDepthVariable('--depth-tilt-x', `${y * -0.22}deg`);
    this.setDepthVariable('--depth-tilt-y', `${x * 0.32}deg`);

    if (Math.abs(this.currentX - this.targetX) > 0.01 || Math.abs(this.currentY - this.targetY) > 0.01) {
      this.queueDepthUpdate();
    }
  }

  private setDepthVariable(name: string, value: string): void {
    if (!this.shellElement) {
      return;
    }

    this.renderer.setStyle(this.shellElement, name, value);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private prepareScrollReveals(): void {
    if (!this.shellElement) {
      return;
    }

    const revealItems = Array.from(
      this.shellElement.querySelectorAll<HTMLElement>(
        [
          'app-section-header',
          '.hero-copy',
          '.hero-visual',
          '.dossier-card',
          '.terminal-profile',
          '.stats-panel',
          '.stat-chip',
          '.module-card',
          '.filter-console',
          '.project-card',
          '.graveyard-console',
          '.bug-card',
          '.transmission-panel',
          '.status-card',
          '.social-card'
        ].join(', ')
      )
    );

    revealItems.forEach((item, index) => {
      this.renderer.addClass(item, 'scroll-reveal');
      this.renderer.setStyle(
        item,
        '--reveal-delay',
        `${Math.min(index * this.stateConfig.revealStepMs, this.stateConfig.revealMaxMs)}ms`
      );
    });

    if (typeof IntersectionObserver === 'undefined') {
      revealItems.forEach((item) => {
        this.renderer.removeClass(item, 'scroll-reveal');
        this.renderer.removeStyle(item, '--reveal-delay');
      });
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          this.renderer.addClass(target, 'is-revealed');
          this.revealObserver?.unobserve(target);

          const timer = setTimeout(() => {
            this.renderer.removeClass(target, 'scroll-reveal');
            this.renderer.removeClass(target, 'is-revealed');
            this.renderer.removeStyle(target, '--reveal-delay');
          }, 1250);

          this.revealTimers.push(timer);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -16% 0px',
        threshold: 0.16
      }
    );

    revealItems.forEach((item) => this.revealObserver?.observe(item));
  }

  private observeSectionProgress(): void {
    if (!this.shellElement || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!this.shellElement) {
          return;
        }

        if (entry.isIntersecting) {
          this.isSectionVisible = true;
          this.renderer.addClass(this.shellElement, 'is-section-visible');
          this.scheduleSignalCorruption();
          return;
        }

        this.isSectionVisible = false;
        this.renderer.removeClass(this.shellElement, 'is-section-visible');
        this.renderer.removeClass(this.shellElement, 'signal-corrupt');
        this.renderer.removeClass(this.shellElement, 'signal-ghost');
        this.clearSignalTimers();
      },
      {
        root: null,
        rootMargin: '-18% 0px -42% 0px',
        threshold: 0.08
      }
    );

    this.sectionObserver.observe(this.shellElement);
  }

  private scheduleSignalCorruption(): void {
    this.clearSignalTimers();

    if (!this.shellElement || !this.isSectionVisible) {
      return;
    }

    const quietTime = this.randomBetween(this.stateConfig.signalMinMs, this.stateConfig.signalMaxMs);

    this.signalTimer = setTimeout(() => {
      this.triggerSignalCorruption();
      this.scheduleSignalCorruption();
    }, quietTime);
  }

  private triggerSignalCorruption(): void {
    if (!this.shellElement || !this.isSectionVisible || this.prefersReducedMotion) {
      return;
    }

    this.renderer.removeClass(this.shellElement, 'signal-ghost');
    this.renderer.addClass(this.shellElement, 'signal-corrupt');

    this.signalReleaseTimer = setTimeout(() => {
      if (!this.shellElement) {
        return;
      }

      this.renderer.removeClass(this.shellElement, 'signal-corrupt');
      this.renderer.addClass(this.shellElement, 'signal-ghost');

      this.signalGhostTimer = setTimeout(() => {
        if (this.shellElement) {
          this.renderer.removeClass(this.shellElement, 'signal-ghost');
        }
      }, this.randomBetween(520, 980));
    }, this.randomBetween(110, 240));
  }

  private updateScrollInstability(): void {
    if (!this.shellElement) {
      return;
    }

    const now = performance.now();
    const scrollY = window.scrollY;
    const elapsed = Math.max(now - this.lastScrollTime, 16);
    const velocity = Math.abs(scrollY - this.lastScrollY) / elapsed;

    this.lastScrollY = scrollY;
    this.lastScrollTime = now;

    if (!this.isSectionVisible || velocity < 1.15) {
      return;
    }

    this.renderer.addClass(this.shellElement, 'scroll-desync');
    clearTimeout(this.scrollSettleTimer);
    this.scrollSettleTimer = setTimeout(() => {
      if (this.shellElement) {
        this.renderer.removeClass(this.shellElement, 'scroll-desync');
      }
    }, 180);
  }

  private clearSignalTimers(): void {
    clearTimeout(this.signalTimer);
    clearTimeout(this.signalReleaseTimer);
    clearTimeout(this.signalGhostTimer);
  }

  private applyStateVariables(): void {
    Object.entries(this.stateConfig.cssVars).forEach(([name, value]) => {
      this.setDepthVariable(name, value);
    });
  }

  private randomBetween(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }
}
