import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all projects for the All filter', () => {
    component.selectFilter('All');

    expect(component.filteredProjects.length).toBe(component.projects.length);
  });

  it('should filter Salesforce projects correctly', () => {
    component.selectFilter('Salesforce');

    expect(component.filteredProjects.length).toBe(1);
    expect(component.filteredProjects[0].title).toBe('TechCare Support');
  });

  it('should generate a padded project module id', () => {
    expect(component.projectModule(0)).toBe('PROJECT_MODULE_01');
  });

  it('should update selectedFilter when selectFilter is called', () => {
    component.selectFilter('Backend');

    expect(component.selectedFilter).toBe('Backend');
  });

  it('should open and close project runtime inspection', () => {
    const [project] = component.projects;

    component.inspectProject(project);
    expect(component.inspectedProject).toBe(project);

    component.closeInspection();
    expect(component.inspectedProject).toBeUndefined();
  });
});
