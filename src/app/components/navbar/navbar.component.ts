import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';

interface NavLink {
  readonly label: string;
  readonly id: string;
  readonly href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly homeLink: NavLink = { label: 'Home', id: 'home', href: '#home' };
  readonly contactLink: NavLink = { label: 'Contact', id: 'contact', href: '#contact' };
  readonly links: NavLink[] = [
    { label: 'About', id: 'about', href: '#about' },
    { label: 'Projects', id: 'projects', href: '#projects' },
    { label: 'Graveyard', id: 'bugs', href: '#bugs' },
    this.contactLink
  ];

  activeSection = 'about';
  isMenuOpen = false;
  isScrolled = false;

  private readonly isBrowser: boolean;
  private previousBodyOverflow = '';
  private scrollFrame?: number;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateNavState();
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.scrollFrame) {
      window.cancelAnimationFrame(this.scrollFrame);
    }

    this.unlockBodyScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.queueNavStateUpdate();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isBrowser || window.innerWidth > 860) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.unlockBodyScroll();
  }

  navigateTo(link: NavLink, event: Event): void {
    event.preventDefault();

    if (!this.isBrowser) {
      return;
    }

    const target = this.document.getElementById(link.id);

    if (!target) {
      this.navigateHomeThenScroll(link);
      this.closeMenu();
      return;
    }

    this.scrollTargetIntoView(target);

    this.activeSection = link.id;
    this.closeMenu();
  }

  onLogoClick(event: Event): void {
    if (this.isBrowser) {
      window.dispatchEvent(new CustomEvent('julia-logo-click'));
    }

    this.navigateTo(this.homeLink, event);
  }

  openCommandCenter(): void {
    if (!this.isBrowser) {
      return;
    }

    window.dispatchEvent(new CustomEvent('open-command-center'));
    this.closeMenu();
  }

  private updateNavState(): void {
    this.isScrolled = window.scrollY > 18;

    const current = this.links
      .map((link) => ({
        id: link.id,
        top: this.document.getElementById(link.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      }))
      .filter((section) => section.top <= 180)
      .pop();

    if (current) {
      this.activeSection = current.id;
    }
  }

  private queueNavStateUpdate(): void {
    if (this.scrollFrame) {
      return;
    }

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = undefined;
      this.updateNavState();
    });
  }

  private scrollTargetIntoView(target: HTMLElement): void {
    try {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch {
      target.scrollIntoView();
    }
  }

  private navigateHomeThenScroll(link: NavLink): void {
    this.router.navigateByUrl('/').then(() => {
      window.requestAnimationFrame(() => {
        const target = this.document.getElementById(link.id);

        if (target) {
          this.scrollTargetIntoView(target);
        }
      });
    });
  }

  private syncBodyScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.isMenuOpen) {
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      return;
    }

    this.unlockBodyScroll();
  }

  private unlockBodyScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.document.body.style.overflow = this.previousBodyOverflow;
  }
}
