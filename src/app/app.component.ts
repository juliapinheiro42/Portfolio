import { Component, DestroyRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { IntroScreenComponent } from './components/intro-screen/intro-screen.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { CommandCenterComponent } from './shared/command-center/command-center.component';
import { LoreVideoModalComponent } from './shared/lore-video-modal/lore-video-modal.component';
import { MascotAssistantComponent } from './shared/mascot-assistant/mascot-assistant.component';
import { SystemBootComponent } from './shared/system-boot/system-boot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    IntroScreenComponent,
    NavbarComponent,
    HomeComponent,
    SystemBootComponent,
    CommandCenterComponent,
    LoreVideoModalComponent,
    MascotAssistantComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  showIntro = true;
  showSystemBoot = false;
  playHeroReconstruction = false;
  isProjectRoute = false;
  isChaosModeActive = false;
  showSecretToast = false;

  private readonly destroyRef = inject(DestroyRef);
  private logoClickCount = 0;
  private logoClickResetTimer?: number;
  private chaosTimer?: number;
  private toastTimer?: number;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.syncRouteState(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => this.syncRouteState(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.logoClickResetTimer) {
        window.clearTimeout(this.logoClickResetTimer);
      }

      if (this.chaosTimer) {
        window.clearTimeout(this.chaosTimer);
      }

      if (this.toastTimer) {
        window.clearTimeout(this.toastTimer);
      }
    }
  }

  onIntroFinished(): void {
    this.showIntro = false;
    this.showSystemBoot = false;
    this.playHeroReconstruction = true;
  }

  @HostListener('window:activate-chaos-mode')
  activateChaosMode(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.showAccessGrantedToast();
      return;
    }

    this.isChaosModeActive = true;

    if (this.chaosTimer) {
      window.clearTimeout(this.chaosTimer);
    }

    this.chaosTimer = window.setTimeout(() => {
      this.isChaosModeActive = false;
    }, 5000);
  }

  @HostListener('window:secret-layer-unlocked')
  showAccessGrantedToast(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.showSecretToast = true;

    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }

    this.toastTimer = window.setTimeout(() => {
      this.showSecretToast = false;
    }, 4200);
  }

  @HostListener('window:julia-logo-click')
  onJuliaLogoClick(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.logoClickCount += 1;

    if (this.logoClickResetTimer) {
      window.clearTimeout(this.logoClickResetTimer);
    }

    this.logoClickResetTimer = window.setTimeout(() => {
      this.logoClickCount = 0;
    }, 1600);

    if (this.logoClickCount >= 5) {
      this.logoClickCount = 0;
      window.dispatchEvent(new CustomEvent('secret-layer-unlocked'));
    }
  }

  private syncRouteState(url: string): void {
    this.isProjectRoute = url.startsWith('/projects/');

    if (this.isProjectRoute) {
      this.showIntro = false;
      this.showSystemBoot = false;
      this.playHeroReconstruction = false;

      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          } catch {
            window.scrollTo(0, 0);
          }
        });
      }
    }
  }
}
