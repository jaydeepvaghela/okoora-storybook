import { OuterDocType } from "./enums";

/**
 * Enums
 */
export enum EFileExtensions {
    PNG = 'png',
    JPG = 'jpg',
    JPEG = 'jpeg',
    PDF = 'pdf',
    GIF = 'gif',
    DOCX ='docx',
    DOC ='doc'
}
export enum EFileErrors {
    FileType = 'file type error',
    FileSize = 'size error',
}

/**
 * Types
 */
export type TFileExtensions = EFileExtensions;
export type TFileErrors = EFileErrors;


export class Uploader {
    queue: OuterFileUpload[];

    constructor() {
        this.queue = [];
    }
}

export class OuterFileUpload {
    constructor(file: File) {
        this.file = file;
    }

    file: File;
    docType: OuterDocType | undefined;
}

/**
 * Data
 */
export class FileData {
    fileId: string | undefined;
    fileExtension: string | undefined;
    content: string | undefined;
    contentType: string | undefined;
}
export const supportedFormats = [
    'image/jpg',  // .jpg
    'image/jpeg', // .jpg
    'image/gif',  // .gif
    'image/png',   // .png
    'application/pdf',  // .pdf
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
    'application/msword',// .doc
];
export const supportedFileExtensions: TFileExtensions[] = [
    EFileExtensions.JPG,
    EFileExtensions.JPEG,
    EFileExtensions.GIF,
    EFileExtensions.PNG,
    EFileExtensions.PDF,
    EFileExtensions.DOCX,
    EFileExtensions.DOC
]
export const acceptSupportedFormats = supportedFormats.join(',');
export const MAX_UPLOAD_SIZE = 6; // 6MB