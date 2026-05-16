import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { ContactComponent } from './contact.component';
import { ContactPayload, ContactService } from '../../../../services/contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    contactService = jasmine.createSpyObj<ContactService>('ContactService', ['sendMessage']);
    contactService.sendMessage.and.callFake((payload: ContactPayload) => of(payload).pipe(delay(1000)));

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: ContactService, useValue: contactService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component.contactForm.invalid).toBeTrue();
  });

  it('should mark fields as touched when trying to send an invalid form', () => {
    component.transmitMessage();

    expect(component.contactForm.controls.name.touched).toBeTrue();
    expect(component.contactForm.controls.email.touched).toBeTrue();
    expect(component.contactForm.controls.message.touched).toBeTrue();
  });

  it('should switch to sending when a valid form is submitted', () => {
    component.contactForm.setValue({
      name: 'Julia',
      email: 'julia@example.com',
      message: 'This is a valid message for the portfolio contact form.'
    });

    component.transmitMessage();

    expect(component.transmissionState).toBe('sending');
    expect(contactService.sendMessage).toHaveBeenCalled();
  });

  it('should update buttonLabel based on transmissionState', () => {
    expect(component.buttonLabel).toBe('Contact Me');

    component.transmissionState = 'sending';
    expect(component.buttonLabel).toBe('Sending...');

    component.transmissionState = 'sent';
    expect(component.buttonLabel).toBe('Message sent');

    component.transmissionState = 'error';
    expect(component.buttonLabel).toBe('Try again');
  });

  it('should reset the form after a successful simulated send', fakeAsync(() => {
    component.contactForm.setValue({
      name: 'Julia',
      email: 'julia@example.com',
      message: 'This is a valid message for the portfolio contact form.'
    });

    component.transmitMessage();
    tick(1000);

    expect(component.transmissionState).toBe('sent');
    expect(component.contactForm.controls.name.value).toBe('');

    tick(1800);
    expect(component.transmissionState).toBe('idle');
  }));

  it('should clean subscriptions and timers on destroy', () => {
    component.contactForm.setValue({
      name: 'Julia',
      email: 'julia@example.com',
      message: 'This is a valid message for the portfolio contact form.'
    });

    component.transmitMessage();
    const subscription = (component as unknown as { sendSubscription?: { unsubscribe: () => void } }).sendSubscription;
    const unsubscribeSpy = spyOn(subscription!, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
