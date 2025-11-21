import { PDFDocument } from "pdf-lib";

export const extractPages = async (buffer: Buffer, pages: number[]) => {
  const originalPdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  const totalPages = originalPdf.getPageCount();

  for (const page of pages) {
    if (page < 1 || page > totalPages) {
      throw new Error(`Invalid page number: ${page}`);
    }
    
    const [copied] = await newPdf.copyPages(originalPdf, [page - 1]);
    newPdf.addPage(copied);
  }

  return await newPdf.save();
};
