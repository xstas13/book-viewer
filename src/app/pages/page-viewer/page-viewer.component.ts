import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocumentViewerComponent } from '../../shared/components/document-viewer/document-viewer.component';

@Component({
  selector: 'app-page-viewer',
  imports: [
    DocumentViewerComponent,
  ],
  templateUrl: './page-viewer.component.html',
  styleUrl: './page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageViewerComponent {
}
