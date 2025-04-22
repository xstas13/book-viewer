import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TuiNavigation } from '@taiga-ui/layout';
import { TuiButton, TuiError, TuiLoader } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

import { IResponse } from '../../../core/interfaces/response.interface';
import { DocumentViewerService } from './shared/document-viewer.service';
import { Document } from './shared/document.model';
import { PageItemComponent } from './page-item/page-item.component';
import { PageZoomerComponent } from './page-zoomer/page-zoomer.component';
import { ZOOM_DEFAULT } from './shared/config';

@Component({
  selector: 'app-document-viewer',
  imports: [
    FormsModule,
    TuiNavigation,
    TuiLoader,
    TuiButton,
    TuiButtonLoading,
    TuiError,
    PageItemComponent,
    PageZoomerComponent,
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DocumentViewerComponent implements OnDestroy {
  protected zoom: number = ZOOM_DEFAULT;
  protected documentResp: IResponse<Document> | undefined;
  protected saveDocumentCommentsResp: IResponse<void> | undefined;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private documentViewerService: DocumentViewerService,
  ) {
    this.documentViewerService.document$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => this.documentResp = resp);

    this.documentViewerService.saveDocumentComments$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => this.saveDocumentCommentsResp = resp);

    this.activatedRoute.params
      .subscribe(params => this.documentViewerService.fetchDocument(params['id']));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected saveDocumentComments(): void {
    this.documentViewerService.saveDocumentComments(this.documentResp!.data);
  }
}
