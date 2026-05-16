import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PROJECTS } from '../../../../../data/projects.data';
import { ProjectRuntimeInspectorComponent } from './project-runtime-inspector.component';

describe('ProjectRuntimeInspectorComponent', () => {
  let component: ProjectRuntimeInspectorComponent;
  let fixture: ComponentFixture<ProjectRuntimeInspectorComponent>;
  let previousBodyOverflow: string;
  let previousBodyPaddingRight: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectRuntimeInspectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectRuntimeInspectorComponent);
    component = fixture.componentInstance;
    component.project = PROJECTS[0];
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  });

  it('should create in overview tab', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab).toBe('overview');
  });

  it('should switch to technical highlights tab', () => {
    component.selectTab('technical');

    expect(component.activeTab).toBe('technical');
  });

  it('should render project technical breakdown data', () => {
    component.selectTab('technical');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Skincare discovery');
    expect(compiled.textContent).toContain('Recommendation Logic');
  });

  it('should render project system flow data', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('User profile');
    expect(compiled.textContent).toContain('Personalized result');
  });

  it('should lock and restore body scroll', () => {
    expect(document.body.style.overflow).toBe('hidden');

    fixture.destroy();

    expect(document.body.style.overflow).toBe(previousBodyOverflow);
    expect(document.body.style.paddingRight).toBe(previousBodyPaddingRight);
  });

  it('should emit closed when Escape is pressed', () => {
    spyOn(component.closed, 'emit');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.closed.emit).toHaveBeenCalled();
  });
});
