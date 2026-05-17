import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, ViewChild } from '@angular/core';
import { BUG_GRAVEYARD, BugGraveyardItem } from '../../../../data/bug-graveyard.data';
import { MagneticCardDirective } from '../../../../shared/magnetic-card/magnetic-card.directive';
import { SectionHeaderComponent } from '../../../../shared/section-header/section-header.component';
import { SectionShellComponent } from '../../../../shared/section-shell/section-shell.component';

@Component({
  selector: 'app-bug-graveyard',
  standalone: true,
  imports: [MagneticCardDirective, SectionHeaderComponent, SectionShellComponent],
  templateUrl: './bug-graveyard.component.html',
  styleUrl: './bug-graveyard.component.scss'
})
export class BugGraveyardComponent implements OnDestroy {
  @ViewChild('deathCertificate') private readonly deathCertificate?: ElementRef<HTMLElement>;

  readonly bugs = BUG_GRAVEYARD;

  selectedBug?: BugGraveyardItem;
  private previousBodyOverflow = '';
  private certificateTrigger?: HTMLElement;
  private isBodyScrollLocked = false;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  bugNumber(index: number): string {
    return String(index + 1).padStart(3, '0');
  }

  openCertificate(bug: BugGraveyardItem, event?: MouseEvent): void {
    this.certificateTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : undefined;
    this.selectedBug = bug;
    this.lockBodyScroll();

    window.requestAnimationFrame(() => {
      this.focusElement(this.deathCertificate?.nativeElement);
    });
  }

  closeCertificate(): void {
    if (!this.selectedBug) {
      return;
    }

    this.selectedBug = undefined;
    this.unlockBodyScroll();

    window.requestAnimationFrame(() => {
      this.focusElement(this.certificateTrigger);
    });
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.selectedBug) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeCertificate();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private lockBodyScroll(): void {
    if (this.isBodyScrollLocked) {
      return;
    }

    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.isBodyScrollLocked = true;
  }

  private unlockBodyScroll(): void {
    if (!this.isBodyScrollLocked) {
      return;
    }

    this.document.body.style.overflow = this.previousBodyOverflow;
    this.isBodyScrollLocked = false;
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialog = this.deathCertificate?.nativeElement;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
    ).filter((element) => element.offsetParent !== null || element === this.document.activeElement);

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      event.preventDefault();
      this.focusElement(dialog);
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
