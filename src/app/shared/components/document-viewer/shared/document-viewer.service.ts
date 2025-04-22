import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, Observable, of, Subject } from 'rxjs';

import { IResponse } from '../../../../core/interfaces/response.interface';

import { Document, DocumentPageCommentSave } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentViewerService {
  public document$ = new Subject<IResponse<Document>>();
  public saveDocumentComments$ = new Subject<IResponse<void>>();

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Получаем досумент по ID
   */
  public fetchDocument(id: number): void {
    this.fetchDocumentMock(id);
  }

  /**
   * Сохраняем добавленные комментарии
   */
  public saveDocumentComments(document: Document | null): void {
    this.saveDocumentCommentsMock(document);
  }

  /**
   * Подготавливаем комментарии к сохранению
   */
  private prepareComments(document: Document | null): DocumentPageCommentSave[] {
    const commentsToSave: DocumentPageCommentSave[] = [];

    document?.pages.forEach(page => {
      const comments = page?.comments || [];

      comments.forEach(comment =>
        commentsToSave.push({...comment, pageNumber: page.number})
      );
    });

    return commentsToSave;
  }

  private fetchDocumentMock(id: number): void {
    this.document$.next({ data: null, loading: true });

    this.http.get(`api.moc/${id}.json`)
      .pipe(
        catchError((error: any): Observable<any> => {
          this.document$.next({ data: null, loading: false, error: error.message });
          return of();
        }),
        delay(2000)
      )
      .subscribe((data: Document) => {
        this.document$.next({ data: data, loading: false, error: '' });
      });
  }

  private saveDocumentCommentsMock(document: Document | null): void {
    this.saveDocumentComments$.next({ data: null, loading: true });

    of(true)
      .pipe(delay(1000))
      .subscribe(() => {
        const commentsToSave = this.prepareComments(document);        
        this.saveDocumentComments$.next({ data: null, loading: false });

        console.log('---document', document);
        console.log('---commentsToSave', commentsToSave);
      });
  }
}
