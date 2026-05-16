import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appMagneticCard]',
  standalone: true
})
export class MagneticCardDirective implements OnInit, OnDestroy {
  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private animationFrame?: number;
  private targetRotateX = 0;
  private targetRotateY = 0;
  private targetLift = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private currentLift = 0;

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

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'magnetic-card-surface');
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canAnimate || event.pointerType === 'touch') {
      return;
    }

    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;

    this.targetRotateX = (0.5 - relativeY) * 4;
    this.targetRotateY = (relativeX - 0.5) * 5;
    this.targetLift = 1;

    this.renderer.addClass(element, 'magnetic-active');
    this.renderer.setStyle(element, '--card-light-x', `${relativeX * 100}%`);
    this.renderer.setStyle(element, '--card-light-y', `${relativeY * 100}%`);
    this.queueFrame();
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.targetLift = 0;
    this.queueFrame();
  }

  private get canAnimate(): boolean {
    return this.isBrowser && !this.prefersReducedMotion && !window.matchMedia('(pointer: coarse)').matches;
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
      this.updateMotion();
    });
  }

  private updateMotion(): void {
    const element = this.elementRef.nativeElement;
    this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.16;
    this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.16;
    this.currentLift += (this.targetLift - this.currentLift) * 0.14;

    this.renderer.setStyle(element, '--card-rotate-x', `${this.currentRotateX.toFixed(3)}deg`);
    this.renderer.setStyle(element, '--card-rotate-y', `${this.currentRotateY.toFixed(3)}deg`);
    this.renderer.setStyle(element, '--card-lift', `${(-this.currentLift * 0.28).toFixed(3)}rem`);
    this.renderer.setStyle(element, '--card-light-opacity', this.currentLift.toFixed(3));

    if (this.currentLift < 0.02 && this.targetLift === 0) {
      this.renderer.removeClass(element, 'magnetic-active');
      this.renderer.removeStyle(element, '--card-rotate-x');
      this.renderer.removeStyle(element, '--card-rotate-y');
      this.renderer.removeStyle(element, '--card-lift');
      this.renderer.removeStyle(element, '--card-light-opacity');
      return;
    }

    this.queueFrame();
  }
}
