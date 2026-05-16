import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('[data-test-section]').forEach((element) => element.remove());
    document.body.style.overflow = '';
  });

  it('should open and close the mobile menu', () => {
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();

    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should close the menu with Escape', () => {
    component.toggleMenu();

    component.onEscapeKey();

    expect(component.isMenuOpen).toBeFalse();
  });

  it('should update activeSection when navigating', () => {
    const target = document.createElement('div');
    target.id = 'projects';
    target.setAttribute('data-test-section', 'true');
    target.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(target);

    component.navigateTo({ label: 'Projects', id: 'projects', href: '#projects' }, new Event('click'));

    expect(component.activeSection).toBe('projects');
    expect(target.scrollIntoView).toHaveBeenCalled();
  });
});
