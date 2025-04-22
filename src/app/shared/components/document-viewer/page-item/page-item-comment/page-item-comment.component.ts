import { ChangeDetectionStrategy, Component, input, output, Renderer2 } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { DocumentPageComment } from '../../shared/document.model';
import { ZOOM_DEFAULT } from '../../shared/config';
import { EnterToBrPipe } from '../../shared/enter-to-br.pipe';

@Component({
  selector: 'app-page-item-comment',
  imports: [
    TuiIcon,
    EnterToBrPipe,
  ],
  templateUrl: './page-item-comment.component.html',
  styleUrl: './page-item-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageItemCommentComponent {
  public comment = input<DocumentPageComment>();
  public offsetX = input<number>();
  public offsetY = input<number>();
  public zoom = input<number>(ZOOM_DEFAULT);

  public clickDelete = output<number>();

  private mousemoveEvent: any;
  private mouseupEvent: any;
  private pointDownOnComment!: [number, number];

  constructor(
    private renderer: Renderer2,
  ) { }

  protected zoomIn(value: number): number {
    return value * 100 / this.zoom();
  }

  protected zoomOut(value: number): number {
    return value * this.zoom() / 100;
  }

  /**
   * Нажали ЛКМ на блоке комментария
   */
  protected mousedownComment(event: MouseEvent): boolean {
    const commentPosX = this.zoomOut(this.comment()!.position[0]);
    const commentPosY = this.zoomOut(this.comment()!.position[1]);

    this.pointDownOnComment = [
      event.pageX - (this.offsetX() || 0) - commentPosX,
      event.pageY - (this.offsetY() || 0) - commentPosY
    ];

    this.mousemoveEvent = this.renderer.listen('document', 'mousemove', this.mousemoveHandler.bind(this));
    this.mouseupEvent = this.renderer.listen('document', 'mouseup', this.mouseupHandler.bind(this));

    return false; // Вызываем preventDefault()
  }

  /**
   * Обработчик события "mousemove"
   */
  private mousemoveHandler(event: any): boolean {
    const pointMoveOnPageX = event.pageX - (this.offsetX() || 0);
    const pointMoveOnPageY = event.pageY - (this.offsetY() || 0);

    this.comment()!.position = [
      this.zoomIn(pointMoveOnPageX) - this.zoomIn(this.pointDownOnComment[0]),
      this.zoomIn(pointMoveOnPageY) - this.zoomIn(this.pointDownOnComment[1]),
    ];

    return false; // Вызываем preventDefault()
  }

  /**
   * Обработчик события "mouseup"
   */
  private mouseupHandler(): boolean {
    this.mousemoveEvent();
    this.mouseupEvent();
    return false; // Вызываем preventDefault()
  }
}
