import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { IntroScreenComponent } from './intro-screen.component';

describe('IntroScreenComponent', () => {
  let component: IntroScreenComponent;
  let fixture: ComponentFixture<IntroScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate and deactivate panic state on schedule', fakeAsync(() => {
    const intro = new IntroScreenComponent();

    intro.ngOnInit();
    expect(intro.isPanic).toBeFalse();
    expect(intro.isCritical).toBeFalse();

    tick(4300);
    expect(intro.isPanic).toBeTrue();
    expect(intro.isCritical).toBeFalse();

    tick(2600);
    expect(intro.isPanic).toBeTrue();
    expect(intro.isCritical).toBeTrue();

    tick(1500);
    expect(intro.isPanic).toBeFalse();
    expect(intro.isCritical).toBeTrue();

    tick(800);
    expect(intro.isCritical).toBeFalse();

    intro.ngOnDestroy();
  }));

  it('should emit finished after the intro and fade out timers', fakeAsync(() => {
    const intro = new IntroScreenComponent();
    const finishedSpy = spyOn(intro.finished, 'emit');

    intro.ngOnInit();

    tick(10000);
    expect(intro.isLeaving).toBeTrue();
    expect(finishedSpy).not.toHaveBeenCalled();

    tick(780);
    expect(finishedSpy).toHaveBeenCalled();

    intro.ngOnDestroy();
  }));
});
