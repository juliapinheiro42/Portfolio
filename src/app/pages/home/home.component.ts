import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { BugGraveyardComponent } from './sections/bug-graveyard/bug-graveyard.component';
import { ContactComponent } from './sections/contact/contact.component';
import { InteractiveBackgroundComponent } from '../../shared/interactive-background/interactive-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InteractiveBackgroundComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    BugGraveyardComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @Input() playHeroReconstruction = false;
}
