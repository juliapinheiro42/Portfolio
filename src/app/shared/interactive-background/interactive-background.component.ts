import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';

interface AmbientParticle {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly delay: number;
  readonly depth: number;
}

@Component({
  selector: 'app-interactive-background',
  standalone: true,
  imports: [NgFor],
  templateUrl: './interactive-background.component.html',
  styleUrl: './interactive-background.component.scss'
})
export class InteractiveBackgroundComponent implements AfterViewInit, OnDestroy {
  readonly particles: readonly AmbientParticle[] = [
    { x: 8, y: 18, size: 0.46, delay: 0.2, depth: 0.28 },
    { x: 18, y: 68, size: 0.62, delay: 1.1, depth: 0.62 },
    { x: 30, y: 34, size: 0.38, delay: 2.4, depth: 0.4 },
    { x: 42, y: 78, size: 0.52, delay: 0.7, depth: 0.78 },
    { x: 53, y: 16, size: 0.42, delay: 1.8, depth: 0.36 },
    { x: 64, y: 58, size: 0.58, delay: 2.9, depth: 0.66 },
    { x: 76, y: 26, size: 0.5, delay: 1.4, depth: 0.5 },
    { x: 88, y: 72, size: 0.68, delay: 0.4, depth: 0.84 },
    { x: 94, y: 42, size: 0.36, delay: 2.2, depth: 0.32 }
  ];

  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private hostElement?: HTMLElement;
  private animationFrame?: number;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private currentGlow = 0;
  private targetGlow = 0;

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
    if (!this.isBrowser || this.prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    this.hostElement = this.elementRef.nativeElement.querySelector('.interactive-background') ?? undefined;
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canAnimate || event.pointerType === 'touch') {
      return;
    }

    this.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    this.targetGlow = 1;
    this.queueFrame();
  }

  @HostListener('window:pointerleave')
  onPointerLeave(): void {
    this.targetGlow = 0;
    this.queueFrame();
  }

  private get canAnimate(): boolean {
    return this.isBrowser && !this.prefersReducedMotion && !!this.hostElement;
  }

  private get prefersReducedMotion(): boolean {
    return this.reduceMotionQuery?.matches ?? false;
  }

  private queueFrame(): void {
    if (this.animationFrame) {
      return;
    }

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.updateAmbientMotion();
    });
  }

  private updateAmbientMotion(): void {
    if (!this.hostElement) {
      return;
    }

    this.currentX += (this.targetX - this.currentX) * 0.08;
    this.currentY += (this.targetY - this.currentY) * 0.08;
    this.currentGlow += (this.targetGlow - this.currentGlow) * 0.06;

    this.renderer.setStyle(this.hostElement, '--ambient-x', `${this.currentX * 18}px`);
    this.renderer.setStyle(this.hostElement, '--ambient-y', `${this.currentY * 14}px`);
    this.renderer.setStyle(this.hostElement, '--ambient-near-x', `${this.currentX * 34}px`);
    this.renderer.setStyle(this.hostElement, '--ambient-near-y', `${this.currentY * 24}px`);
    this.renderer.setStyle(this.hostElement, '--ambient-glow', this.currentGlow.toFixed(3));

    if (
      Math.abs(this.currentX - this.targetX) > 0.01 ||
      Math.abs(this.currentY - this.targetY) > 0.01 ||
      Math.abs(this.currentGlow - this.targetGlow) > 0.01
    ) {
      this.queueFrame();
    }
  }
}
