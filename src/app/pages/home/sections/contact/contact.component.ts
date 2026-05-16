import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SOCIAL_LINKS } from '../../../../data/social-links.data';
import { ContactService } from '../../../../services/contact.service';
import { MagneticCardDirective } from '../../../../shared/magnetic-card/magnetic-card.directive';
import { SectionHeaderComponent } from '../../../../shared/section-header/section-header.component';
import { SectionShellComponent } from '../../../../shared/section-shell/section-shell.component';

type TransmissionState = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MagneticCardDirective, NgFor, NgIf, ReactiveFormsModule, SectionHeaderComponent, SectionShellComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly socialLinks = SOCIAL_LINKS;

  transmissionState: TransmissionState = 'idle';

  readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(20)]]
  });

  private resetTimer?: ReturnType<typeof setTimeout>;
  private sendSubscription?: Subscription;

  get buttonLabel(): string {
    if (this.transmissionState === 'sending') {
      return 'Sending...';
    }

    if (this.transmissionState === 'sent') {
      return 'Message sent';
    }

    if (this.transmissionState === 'error') {
      return 'Try again';
    }

    return 'Contact Me';
  }

  get isSending(): boolean {
    return this.transmissionState === 'sending';
  }

  hasError(controlName: 'name' | 'email' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  errorMessage(controlName: 'name' | 'email' | 'message'): string {
    const control = this.contactForm.controls[controlName];

    if (control.hasError('required')) {
      return `${controlName} is required to open the channel.`;
    }

    if (control.hasError('email')) {
      return 'Enter a valid e-mail address.';
    }

    if (control.hasError('minlength')) {
      const minimum = control.getError('minlength').requiredLength;
      return `${controlName} needs at least ${minimum} characters.`;
    }

    return 'This field needs a tiny adjustment.';
  }

  transmitMessage(): void {
    if (this.contactForm.invalid || this.isSending) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.transmissionState = 'sending';
    this.sendSubscription?.unsubscribe();

    this.sendSubscription = this.contactService.sendMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.transmissionState = 'sent';
        this.contactForm.reset();

        this.resetTimer = setTimeout(() => {
          this.transmissionState = 'idle';
        }, 1800);
      },
      error: () => {
        this.transmissionState = 'error';
      }
    });
  }

  ngOnDestroy(): void {
    this.sendSubscription?.unsubscribe();
    clearTimeout(this.resetTimer);
  }
}
