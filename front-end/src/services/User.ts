import api from "../app/axiosInstance";
import { API_ROUTES } from "../constant/apiRoute";


export const Login = async(email:string,password:string)=>{
    try {
       const response = await api.post(API_ROUTES.LOGIN,{
        email,
        password,
       });
       return response.data;
    } catch (error) {
       console.log(error);
       throw error
    }
};

export const Signup = async (email:string,password:string)=>{
    try {
        const response = await api.post(API_ROUTES.SIGNUP, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const extractPdfPages = async (
  userId: string,
  historyPage: number,
  itemsPerPage: number,
  pdfFile: File,
  selectedPages: number[]
) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);
  formData.append("pages", JSON.stringify(selectedPages));

  const response = await api.post(API_ROUTES.EXTRACT_PDF(userId,historyPage,itemsPerPage),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    }
  );

  return response.data;
};

export const pdfHistory = async (userId:string,historyPage:number,itemsPerPage:number)=>{
     const response = await api.get(API_ROUTES.PDF_HISTORY(userId,historyPage,itemsPerPage));
     
      return response.data;
}


export const downloadPdf = async (pdfId: string) => {
  const response = await api.get(API_ROUTES.DOWNLOAD_PDF(pdfId), {
    responseType: "blob",
  });

  return response.data;
};