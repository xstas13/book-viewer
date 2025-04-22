import { fromEvent, map, Observable, take } from 'rxjs';

/**
* Определяем размер картинки
*/
export function imageDimension(imageSrc: string): Observable<[number, number]> {
    const image = new Image();

    const img$ = fromEvent(image, 'load').pipe(take(1), map(event => {
        return [
            (event.target as HTMLImageElement).width,
            (event.target as HTMLImageElement).height
        ] as [number, number];
    }));

    image.src = imageSrc;

    return img$;
}

/**
 * Преобразуем File(image/*) -> Base64
 */
export function imageToBase64(uploadFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject();
        reader.readAsDataURL(uploadFile);
    });
}