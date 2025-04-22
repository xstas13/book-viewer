export interface Document {
    name: string;
    pages: DocumentPage[];
}

export interface DocumentPage {
    number: number;
    imageUrl: string;
    comments?: DocumentPageComment[];
}

export interface Dimension {
    width: number;
    height: number;
};

export interface DocumentPageComment {
    id: number;
    type: TComment;
    position: [number, number];
    dimension: [number, number];
    data: string;
};

export interface DocumentPageCommentSave extends DocumentPageComment {
    pageNumber: number;
};

export type TComment = 'TEXT' | 'IMAGE';