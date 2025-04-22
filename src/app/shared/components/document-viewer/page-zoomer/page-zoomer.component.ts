import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiSliderComponent } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { ZOOM_DEFAULT } from '../shared/config';

const LABELS_DEFAULT: number[] = [50, 100, 150];

@Component({
  selector: 'app-page-zoomer',
  imports: [
    FormsModule,
    TuiSliderComponent,
    TuiIcon,
    TuiButton,
  ],
  templateUrl: './page-zoomer.component.html',
  styleUrl: './page-zoomer.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageZoomerComponent {
  public value = model<number>(ZOOM_DEFAULT);
  public min = input<number>(50);
  public max = input<number>(150);
  public step = input<number>(25);
  public labels = input<number[]>(LABELS_DEFAULT);

  protected get segments(): number {
    return Math.round((this.max() - this.min()) / this.step());
  }

  protected get canZoomIn(): boolean {
    return this.value() < this.max();
  }

  protected get canZoomOut(): boolean {
    return this.value() > this.min();
  }

  protected setZoom(newValue: number): void {
    this.value.update(() => newValue);
  }

  protected zoomIn(): void {
    if (this.canZoomIn) {
      this.value.update(() => this.value() + this.step());
    }
  }

  protected zoomOut(): void {
    if (this.canZoomOut) {
      this.value.update(() => this.value() - this.step());
    }
  }
}
