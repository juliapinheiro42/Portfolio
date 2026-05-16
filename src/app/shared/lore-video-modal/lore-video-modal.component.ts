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

@Component({
  selector: 'app-lore-video-modal',
  standalone: true,
  templateUrl: './lore-video-modal.component.html',
  styleUrl: './lore-video-modal.component.scss'
})
export class LoreVideoModalComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('loreVideo') private loreVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('playButton') private playButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('loreDialog') private loreDialog?: ElementRef<HTMLElement>;

  readonly videoSrc = '/assets/lore/julia-lore.mp4';

  isOpen = false;
  hasStarted = false;
  isMuted = false;
  progress = 0;

  private readonly isBrowser: boolean;
  private previousBodyOverflow = '';
  private shouldFocusPlay = false;
  private closeTimer?: number;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewChecked(): void {
    if (!this.shouldFocusPlay || !this.playButton) {
      return;
    }

    this.shouldFocusPlay = false;
    this.playButton.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.unlockBodyScroll();
  }

  @HostListener('window:open-lore-transmission')
  open(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.isOpen) {
      this.shouldFocusPlay = true;
      return;
    }

    this.clearCloseTimer();
    this.isOpen = true;
    this.hasStarted = false;
    this.progress = 0;
    this.shouldFocusPlay = true;
    this.lockBodyScroll();
    window.dispatchEvent(new CustomEvent('lore-transmission-opened'));
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close('closed');
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  async startTransmission(): Promise<void> {
    const video = this.loreVideo?.nativeElement;

    if (!video) {
      return;
    }

    this.hasStarted = true;
    video.muted = this.isMuted;

    try {
      await video.play();
    } catch {
      this.hasStarted = false;
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.loreVideo) {
      this.loreVideo.nativeElement.muted = this.isMuted;
    }
  }

  skip(): void {
    this.close('skipped');
  }

  close(reason: 'closed' | 'completed' | 'skipped' = 'closed'): void {
    if (!this.isOpen) {
      return;
    }

    const video = this.loreVideo?.nativeElement;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    this.isOpen = false;
    this.hasStarted = false;
    this.progress = 0;
    this.clearCloseTimer();
    this.unlockBodyScroll();

    if (reason !== 'closed') {
      window.dispatchEvent(new CustomEvent('lore-transmission-completed', {
        detail: { reason }
      }));
    }
  }

  onTimeUpdate(): void {
    const video = this.loreVideo?.nativeElement;

    if (!video?.duration) {
      this.progress = 0;
      return;
    }

    this.progress = Math.min((video.currentTime / video.duration) * 100, 100);
  }

  onEnded(): void {
    this.clearCloseTimer();
    this.closeTimer = window.setTimeout(() => this.close('completed'), 2000);
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

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialog = this.loreDialog?.nativeElement;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])')
    ).filter((element) => element.offsetParent !== null || element === this.document.activeElement);

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      return;
    }

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
}
