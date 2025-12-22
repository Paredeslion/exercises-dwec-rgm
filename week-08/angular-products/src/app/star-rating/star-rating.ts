import { ChangeDetectionStrategy, Component, model, linkedSignal } from '@angular/core';

@Component({
  selector: 'star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  rating = model.required<number>();
  auxRating = linkedSignal(() => this.rating());
}
