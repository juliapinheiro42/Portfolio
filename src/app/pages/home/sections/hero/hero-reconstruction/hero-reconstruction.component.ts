import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { HERO_RECONSTRUCTION_CONFIG } from '../../../../../config/hero-reconstruction.config';

@Component({
  selector: 'app-hero-reconstruction',
  standalone: true,
  imports: [NgFor],
  templateUrl: './hero-reconstruction.component.html',
  styleUrl: './hero-reconstruction.component.scss'
})
export class HeroReconstructionComponent implements OnInit, OnDestroy {
  @Output() finished = new EventEmitter<void>();

  readonly config = HERO_RECONSTRUCTION_CONFIG;

  isLeaving = false;
  isUnstable = false;

  private readonly isBrowser: boolean;
  private readonly reduceMotionQuery?: MediaQueryList;
  private finishTimer?: ReturnType<typeof setTimeout>;
  private leaveTimer?: ReturnType<typeof setTimeout>;
  private glitchStartTimer?: ReturnType<typeof setTimeout>;
  private glitchEndTimer?: ReturnType<typeof setTimeout>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    }
  }

  ngOnInit(): void {
    const duration = this.prefersReducedMotion ? this.config.reducedMotionDurationMs : this.config.totalDurationMs;

    this.glitchStartTimer = setTimeout(() => {
      this.isUnstable = true;
    }, this.config.glitchStartMs);

    this.glitchEndTimer = setTimeout(() => {
      this.isUnstable = false;
    }, this.config.glitchEndMs);

    this.leaveTimer = setTimeout(() => {
      this.isLeaving = true;
    }, Math.max(duration - 520, 0));

    this.finishTimer = setTimeout(() => {
      this.finished.emit();
    }, duration);
  }

  ngOnDestroy(): void {
    clearTimeout(this.finishTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.glitchStartTimer);
    clearTimeout(this.glitchEndTimer);
  }

  @HostListener('document:keydown.escape')
  skip(): void {
    this.finished.emit();
  }

  private get prefersReducedMotion(): boolean {
    return this.reduceMotionQuery?.matches ?? false;
  }
}
