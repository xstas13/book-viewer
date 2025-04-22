import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiLink } from '@taiga-ui/core';

@Component({
  selector: 'app-page-main',
  imports: [
    RouterLink,
    TuiLink,
  ],
  templateUrl: './page-main.component.html',
  styleUrl: './page-main.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageMainComponent {
}
