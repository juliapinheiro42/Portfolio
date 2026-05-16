import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-system-boot',
  standalone: true,
  templateUrl: './system-boot.component.html',
  styleUrl: './system-boot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemBootComponent implements OnInit, OnDestroy {
  @Output() finished = new EventEmitter<void>();

  private readonly bootDuration = 2800;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.timer = setTimeout(() => {
      this.finished.emit();
    }, this.bootDuration);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
