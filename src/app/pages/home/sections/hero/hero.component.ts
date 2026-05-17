import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
import { SectionShellComponent } from '../../../../shared/section-shell/section-shell.component';
import { HERO_RECONSTRUCTION_CONFIG } from '../../../../config/hero-reconstruction.config';
import { HeroReconstructionComponent } from './hero-reconstruction/hero-reconstruction.component';
import { SystemMapComponent } from '../../../../shared/system-map/system-map.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HeroReconstructionComponent, SectionShellComponent, SystemMapComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @Input() set playReconstruction(value: boolean) {
    this.isReconstructing = HERO_RECONSTRUCTION_CONFIG.enabled && value;
  }

  isReconstructing = false;
  isMobileVisualMode = false;

  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private mascotElement?: HTMLElement;
  private animationFrame?: number;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private targetGlow = 0;
  private currentGlow = 0;
  private scrollReact = 0;

  finishReconstruction(): void {
    this.isReconstructing = false;
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.updateMobileVisualMode();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.prefersReducedMotion) {
      return;
    }

    this.mascotElement = this.elementRef.nativeElement.querySelector('.resting-mascot') ?? undefined;
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  navigateToSection(sectionId: string, event: Event): void {
    event.preventDefault();

    if (!this.isBrowser) {
      return;
    }

    const target = this.document.getElementById(sectionId);

    if (!target) {
      return;
    }

    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      target.scrollIntoView();
    }
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canAnimate || event.pointerType === 'touch') {
      return;
    }

    const mascotElement = this.mascotElement;

    if (!mascotElement) {
      return;
    }

    const rect = mascotElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const proximity = this.clamp(1 - distance / 420, 0, 1);

    this.targetX = this.clamp((event.clientX - centerX) / 220, -1, 1) * proximity;
    this.targetY = this.clamp((event.clientY - centerY) / 220, -1, 1) * proximity;
    this.targetGlow = proximity;
    this.queueMascotFrame();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.canAnimate) {
      return;
    }

    const mascotElement = this.mascotElement;

    if (!mascotElement) {
      return;
    }

    const rect = mascotElement.getBoundingClientRect();
    this.scrollReact = this.clamp((window.innerHeight * 0.55 - rect.top) / window.innerHeight, -0.6, 0.6);
    this.queueMascotFrame();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateMobileVisualMode();
  }

  private get canAnimate(): boolean {
    return this.isBrowser && !this.prefersReducedMotion && !this.isMobileVisualMode && !!this.mascotElement;
  }

  private get prefersReducedMotion(): boolean {
    return this.reduceMotionQuery?.matches ?? false;
  }

  private queueMascotFrame(): void {
    if (this.animationFrame) {
      return;
    }

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.updateMascotMotion();
    });
  }

  private updateMascotMotion(): void {
    if (!this.mascotElement) {
      return;
    }

    this.currentX += (this.targetX - this.currentX) * 0.14;
    this.currentY += (this.targetY - this.currentY) * 0.14;
    this.currentGlow += (this.targetGlow - this.currentGlow) * 0.12;

    this.renderer.setStyle(this.mascotElement, '--mascot-x', `${this.currentX * 3}px`);
    this.renderer.setStyle(this.mascotElement, '--mascot-y', `${this.currentY * 2 + this.scrollReact * 2}px`);
    this.renderer.setStyle(this.mascotElement, '--mascot-tilt', `${this.currentX * 1.4}deg`);
    this.renderer.setStyle(this.mascotElement, '--eye-x', `${this.currentX * 2.6}px`);
    this.renderer.setStyle(this.mascotElement, '--eye-y', `${this.currentY * 1.8}px`);
    this.renderer.setStyle(this.mascotElement, '--ear-left', `${this.currentX * 1.5}deg`);
    this.renderer.setStyle(this.mascotElement, '--ear-right', `${this.currentX * -1.2}deg`);
    this.renderer.setStyle(this.mascotElement, '--aura-opacity', `${0.58 + this.currentGlow * 0.22}`);
    this.renderer.setStyle(this.mascotElement, '--pink-glow', `${0.16 + this.currentGlow * 0.1}`);
    this.renderer.setStyle(this.mascotElement, '--aura-pink', `${0.12 + this.currentGlow * 0.14}`);
    this.renderer.setStyle(this.mascotElement, '--aura-blue', `${0.14 + this.currentGlow * 0.12}`);
    this.renderer.setStyle(this.mascotElement, '--face-blue-glow', `${0.06 + this.currentGlow * 0.08}`);
    this.renderer.setStyle(this.mascotElement, '--shine-opacity', `${0.75 + this.currentGlow * 0.2}`);
    this.renderer.setStyle(this.mascotElement, '--blush-opacity', `${0.78 + this.currentGlow * 0.12}`);

    if (
      Math.abs(this.currentX - this.targetX) > 0.01 ||
      Math.abs(this.currentY - this.targetY) > 0.01 ||
      Math.abs(this.currentGlow - this.targetGlow) > 0.01
    ) {
      this.queueMascotFrame();
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private updateMobileVisualMode(): void {
    if (!this.isBrowser) {
      return;
    }

    this.isMobileVisualMode = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  }
}
