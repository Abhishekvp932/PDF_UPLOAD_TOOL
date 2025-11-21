export interface userType {
    id:string;
    email:string;
}

export interface UserPdf {
        userId?:string;
        fileName?:string;
        filePath?:string;
        pages?:number[];
        createdAt?:Date;
        updatedAt?:Date;
}

export interface UserPdfDTO {
    pdfHistory : UserPdf[];
    total:number;
}