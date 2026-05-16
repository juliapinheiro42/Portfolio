import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

interface BootLine {
  readonly text: string;
  readonly delayClass: string;
}

@Component({
  selector: 'app-intro-screen',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './intro-screen.component.html',
  styleUrl: './intro-screen.component.scss'
})
export class IntroScreenComponent implements OnInit, OnDestroy {
  private static readonly PANIC_START_MS = 4300;
  private static readonly PANIC_END_MS = 8400;
  private static readonly CRITICAL_START_MS = 6900;
  private static readonly CRITICAL_END_MS = 9200;
  private static readonly LEAVE_START_MS = 10000;
  private static readonly FADE_OUT_MS = 780;

  @Output() finished = new EventEmitter<void>();

  readonly bootLines: BootLine[] = [
    { text: '> booting julia.dev...', delayClass: 'delay-0' },
    { text: '> loading angular magic...', delayClass: 'delay-1' },
    { text: '> compiling dreams...', delayClass: 'delay-2' },
    { text: '> installing sparkle.css...', delayClass: 'delay-3' },
    { text: '> error: cuteness overflow...', delayClass: 'delay-4' },
    { text: '> system ready.', delayClass: 'delay-5' }
  ];

  isLeaving = false;
  isPanic = false;
  isCritical = false;

  private leaveTimer?: ReturnType<typeof setTimeout>;
  private finishTimer?: ReturnType<typeof setTimeout>;
  private panicStartTimer?: ReturnType<typeof setTimeout>;
  private panicEndTimer?: ReturnType<typeof setTimeout>;
  private criticalStartTimer?: ReturnType<typeof setTimeout>;
  private criticalEndTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.panicStartTimer = setTimeout(() => {
      this.isPanic = true;
    }, IntroScreenComponent.PANIC_START_MS);

    this.panicEndTimer = setTimeout(() => {
      this.isPanic = false;
    }, IntroScreenComponent.PANIC_END_MS);

    this.criticalStartTimer = setTimeout(() => {
      this.isCritical = true;
    }, IntroScreenComponent.CRITICAL_START_MS);

    this.criticalEndTimer = setTimeout(() => {
      this.isCritical = false;
    }, IntroScreenComponent.CRITICAL_END_MS);

    this.leaveTimer = setTimeout(() => {
      this.isLeaving = true;

      this.finishTimer = setTimeout(() => {
        this.finished.emit();
      }, IntroScreenComponent.FADE_OUT_MS);
    }, IntroScreenComponent.LEAVE_START_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.panicStartTimer);
    clearTimeout(this.panicEndTimer);
    clearTimeout(this.criticalStartTimer);
    clearTimeout(this.criticalEndTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.finishTimer);
  }
}
