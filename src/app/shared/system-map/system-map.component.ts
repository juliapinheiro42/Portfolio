import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import {
  SYSTEM_MAP_CONFIG,
  SystemConnection,
  SystemEventParticle,
  SystemNode
} from '../../config/system-map.config';

@Component({
  selector: 'app-system-map',
  standalone: true,
  templateUrl: './system-map.component.html',
  styleUrl: './system-map.component.scss'
})
export class SystemMapComponent implements OnDestroy {
  readonly nodes = SYSTEM_MAP_CONFIG.nodes;
  readonly connections = SYSTEM_MAP_CONFIG.connections;
  readonly config = SYSTEM_MAP_CONFIG;

  activeNodeId?: string;

  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private animationFrame?: number;
  private pointerX = 0;
  private pointerY = 0;
  private currentX = 0;
  private currentY = 0;

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

  get particles(): SystemEventParticle[] {
    if (this.prefersReducedMotion) {
      return [];
    }

    const isMobile = this.isBrowser && window.matchMedia('(max-width: 768px)').matches;
    const limit = isMobile ? this.config.particleCountMobile : this.config.particleCountDesktop;
    return this.config.particles.slice(0, limit);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canAnimate || event.pointerType === 'touch') {
      return;
    }

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    this.pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    this.queueFrame();
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.activeNodeId = undefined;
    this.pointerX = 0;
    this.pointerY = 0;
    this.queueFrame();
  }

  activateNode(nodeId: string): void {
    this.activeNodeId = nodeId;
  }

  clearActiveNode(): void {
    this.activeNodeId = undefined;
  }

  isRelatedConnection(connection: SystemConnection): boolean {
    return connection.from === this.activeNodeId || connection.to === this.activeNodeId;
  }

  isRelatedNode(node: SystemNode): boolean {
    if (!this.activeNodeId) {
      return false;
    }

    return node.id === this.activeNodeId || this.connections.some((connection) =>
      this.isRelatedConnection(connection) &&
      (connection.from === node.id || connection.to === node.id)
    );
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  private get canAnimate(): boolean {
    return this.isBrowser && !this.prefersReducedMotion;
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
      this.updateDepth();
    });
  }

  private updateDepth(): void {
    this.currentX += (this.pointerX - this.currentX) * 0.12;
    this.currentY += (this.pointerY - this.currentY) * 0.12;

    this.renderer.setStyle(this.elementRef.nativeElement, '--map-drift-x', `${this.currentX * 10}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, '--map-drift-y', `${this.currentY * 8}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, '--map-near-x', `${this.currentX * -6}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, '--map-near-y', `${this.currentY * -5}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, '--map-light-x', `${50 + this.currentX * 16}%`);
    this.renderer.setStyle(this.elementRef.nativeElement, '--map-light-y', `${46 + this.currentY * 14}%`);

    if (Math.abs(this.currentX - this.pointerX) > 0.01 || Math.abs(this.currentY - this.pointerY) > 0.01) {
      this.queueFrame();
    }
  }
}
