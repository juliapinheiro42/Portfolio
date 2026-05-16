import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ABOUT_MODULES, ABOUT_STATS, PROFILE_LINES } from '../../../../data/about.data';
import { SectionHeaderComponent } from '../../../../shared/section-header/section-header.component';
import { SectionShellComponent } from '../../../../shared/section-shell/section-shell.component';
import { MagneticCardDirective } from '../../../../shared/magnetic-card/magnetic-card.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MagneticCardDirective, NgFor, SectionHeaderComponent, SectionShellComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly modules = ABOUT_MODULES;
  readonly stats = ABOUT_STATS;
  readonly profileLines = PROFILE_LINES;
}
