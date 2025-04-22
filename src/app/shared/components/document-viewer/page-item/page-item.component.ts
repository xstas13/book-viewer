import { ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, map, of, switchMap, tap } from 'rxjs';
import { TuiDataList, TuiDropdown, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListDropdownManager, TuiTextarea } from '@taiga-ui/kit';

import { DocumentPage, DocumentPageComment } from '../shared/document.model';
import { imageDimension, imageToBase64 } from '../shared/utils';
import { INIT_IMAGE_SIZE, INIT_TEXT_SIZE, ZOOM_DEFAULT } from '../shared/config';
import { PageItemCommentComponent } from './page-item-comment/page-item-comment.component';

@Component({
  selector: 'app-page-item',
  imports: [
    FormsModule,
    TuiDropdown,
    TuiDataList,
    TuiIcon,
    TuiTextfield,
    TuiTextarea,
    TuiDataListDropdownManager,
    PageItemCommentComponent,
  ],
  templateUrl: './page-item.component.html',
  styleUrl: './page-item.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageItemComponent {
  public pageItem = input<DocumentPage>();
  public zoom = input<number>(ZOOM_DEFAULT);

  protected pageImageUrl: string | null = null;
  protected pageDimension!: [number, number];
  protected loaded: boolean = false;
  protected commentEditShow: boolean = false;
  protected commentEditPosition: [number, number] = [0, 0];
  protected commentEditText: string = '';  

  protected get styleWidth(): string {
    const width = Math.round((this.pageDimension[0] || 0) * this.zoom() / 100);
    return `${width}px`;
  }

  protected get comments(): DocumentPageComment[] {
    return this.pageItem()?.comments || [];
  }

  @ViewChild('textareaCommentEdit')
  private readonly textareaCommentEdit!: any;
  // <textarea> изменен при помощи Taiga UI потому тип "any" а не ElementRef<HTMLTextAreaElement>

  private pointRightClick!: [number, number];

  constructor() {
    this.pageItemChangeHandler();
  }

  protected positionPercentX(x: number): number {
    return x * 100 / this.pageDimension[0];
  }

  protected positionPercentY(y: number): number {
    return y * 100 / this.pageDimension[1];
  }

  /**
   * Обрабатываем событие при нажатии ПКМ
   */
  protected rightClickHandler(event: MouseEvent): void {
    this.pointRightClick = [event.offsetX, event.offsetY];
  }

  protected contentMenuComment(): void {
    this.commentEditShow = true;
    this.commentEditPosition = [this.pointRightClick[0], this.pointRightClick[1]];
    this.commentEditFocus();
  }

  /**
   * Событие потери фокуса на поле ввода комментария.
   */
  protected focusOutCommentEdit(): void {
    if (!this.commentEditText) {
      this.commentEditText = '';
      this.commentEditShow = false;
      return;
    }

    if (!this.pageItem()?.comments) {
      this.pageItem()!.comments = [];
    }

    this.pageItem()!.comments!.push({
      id: this.newCommentId(),
      type: 'TEXT',
      position: this.pointRightClickZoomed(),
      dimension: [INIT_TEXT_SIZE, 0],
      data: this.commentEditText,
    });

    this.commentEditText = '';
    this.commentEditShow = false;
  }

  /**
   * Обрабатываем событие загрузки файла (картинки)
   */
  protected fileSelectedHandler(event: Event): void {
    const files: FileList | null = (event.target as HTMLInputElement).files;

    if (!files || !files[0]) {
      //TODO Добавить обработку ошибок
      return;
    }

    if (!this.pageItem()?.comments) {
      this.pageItem()!.comments = [];
    }

    const imgDim = Math.round(this.pageDimension[0] * INIT_IMAGE_SIZE / 100);

    imageToBase64(files[0])
      .then(base64 => {
        this.pageItem()!.comments!.push({
          id: this.newCommentId(),
          type: 'IMAGE',
          position: this.pointRightClickZoomed(),
          dimension: [imgDim, 0],
          data: base64,
        });

        (event.target as HTMLInputElement).value = '';
      });
  }

  /**
   * Удоляем комментарий
   */
  protected commentDelete(id: number): void {
    this.pageItem()!.comments = this.pageItem()!.comments!.filter(c => c.id !== id);
  }

  /**
   * Обрабатываем изменения входного параметра - pageItem
   */
  private pageItemChangeHandler(): void {
    toObservable(this.pageItem)
      .pipe(
        tap(() => {
          this.pageImageUrl = null;
          this.loaded = false;
        }),
        filter(pageItem => !!pageItem?.imageUrl),
        switchMap(pageItem => {
          return imageDimension(pageItem!.imageUrl)
            .pipe(map(dimension => {
              this.pageDimension = dimension;
              return pageItem;
            }))
        })
      )
      .subscribe(pageItem => {
        this.pageImageUrl = pageItem!.imageUrl;
        this.loaded = true;
      });
  }

  /**
   * Устанвливаем фокус на поле ввода комментария
  */
  private commentEditFocus(): void {
    of(true)
      .pipe(delay(200))
      .subscribe(() => this.textareaCommentEdit.el.focus());
  }

  /**
   * Генерируем id для нового коммента.
   */
  private newCommentId(): number {
    if (!this.pageItem()?.comments?.length) {
      return 1;
    }

    const maxId = Math.max(...this.pageItem()!.comments!.map(c => c.id || 0));

    return maxId + 1;
  }

  /**
   * Сохраненная позиция при нажатии ПКМ с умножением на zoom
   */
  private pointRightClickZoomed(): [number, number] {
    return [this.pointRightClick[0] * (100 / this.zoom()), this.pointRightClick[1] * (100 / this.zoom())];
  }
}
