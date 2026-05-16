import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECT_FILTERS, PROJECTS, Project, ProjectFilter, ProjectStatus } from '../../../../data/projects.data';
import { MagneticCardDirective } from '../../../../shared/magnetic-card/magnetic-card.directive';
import { SectionHeaderComponent } from '../../../../shared/section-header/section-header.component';
import { SectionShellComponent } from '../../../../shared/section-shell/section-shell.component';
import { ProjectRuntimeInspectorComponent } from './project-runtime-inspector/project-runtime-inspector.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, MagneticCardDirective, ProjectRuntimeInspectorComponent, SectionHeaderComponent, SectionShellComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  readonly filters = PROJECT_FILTERS;
  readonly projects = PROJECTS;

  selectedFilter: ProjectFilter = 'All';

  inspectedProject?: Project;
  private inspectionTrigger?: HTMLElement;
  private inspectedCard?: HTMLElement;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  get filteredProjects(): readonly Project[] {
    if (this.selectedFilter === 'All') {
      return this.projects;
    }

    return this.projects.filter((project) => this.matchesFilter(project, this.selectedFilter));
  }

  selectFilter(filter: ProjectFilter): void {
    this.selectedFilter = filter;
  }

  projectModule(index: number): string {
    return `PROJECT_MODULE_${String(index + 1).padStart(2, '0')}`;
  }

  statusLabel(status: ProjectStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  inspectProject(project: Project, event?: MouseEvent): void {
    const trigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : undefined;
    const card = trigger?.closest<HTMLElement>('.project-card') ?? undefined;

    this.inspectionTrigger = trigger;
    this.inspectedCard = card;
    this.inspectedProject = project;
    this.scrollProjectsSectionIntoView();
  }

  closeInspection(): void {
    this.inspectedProject = undefined;

    window.requestAnimationFrame(() => {
      this.scrollElementIntoView(this.inspectedCard);
      this.inspectionTrigger?.focus({ preventScroll: true });
    });
  }

  private matchesFilter(project: Project, filter: ProjectFilter): boolean {
    if (filter === 'Full Stack') {
      return project.type.toLowerCase().includes('full stack');
    }

    if (filter === 'Backend') {
      return project.type.toLowerCase().includes('backend') || project.tags.includes('ASP.NET Core');
    }

    if (filter === 'Salesforce') {
      return project.tags.includes('Salesforce');
    }

    return project.type.toLowerCase().includes('ai') || project.tags.some((tag) => tag.toLowerCase().includes('ai'));
  }

  private scrollElementIntoView(element?: HTMLElement): void {
    if (!element) {
      return;
    }

    const topOffset = window.innerWidth <= 640 ? 72 : 104;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth'
    });
  }

  private scrollProjectsSectionIntoView(): void {
    const projectsSection = this.document.getElementById('projects');

    if (!projectsSection) {
      this.scrollElementIntoView(this.inspectedCard);
      return;
    }

    const topOffset = window.innerWidth <= 640 ? 72 : 104;
    const targetTop = projectsSection.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth'
    });
  }
}
