export const API_ROUTES = {
  LOGIN: "/api/user/login",
  SIGNUP:"/api/user/signup",
  EXTRACT_PDF: (userId: string, page: number, limit: number) =>
    `/api/user/extract/${userId}?page=${page}&limit=${limit}`,
  PDF_HISTORY: (userId: string, page: number, limit: number) =>
    `/api/user/history/${userId}?page=${page}&limit=${limit}`,
  DOWNLOAD_PDF: (pdfId: string) => `/api/user/download/${pdfId}`,
};
