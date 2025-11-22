# 📄 PDF Page Extractor (MERN + TypeScript)

A full-stack PDF extraction tool built with **MERN + TypeScript** that allows users to:

- Upload PDF files
- View each page as an image preview
- Select specific pages to extract
- Reorder selected pages
- Generate a new PDF from selected/reordered pages
- Download the generated PDF
- View PDF history with pagination
- Download previous PDFs
- User authentication with JWT + HttpOnly Cookies

---

## 🚀 Tech Stack

### **Frontend**
- React + TypeScript
- Redux Toolkit + Redux Persist
- Axios
- Tailwind CSS
- pdfjs-dist (PDF Viewer)
- React-Toastify

### **Backend**
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- Multer (file upload)
- pdf-lib (PDF manipulation)
- JWT (access + refresh tokens)
- HttpOnly cookies for secure auth
- Repository + Service Architecture (Clean Architecture)

---

## ✨ Features

### 🔐 **User Authentication**
- Login with JWT
- HttpOnly cookies for security
- Redux persistent login state

### 📤 **PDF Upload**
- Drag & Drop or select file
- Automatic preview of pages
- Uses pdfjs-dist to render each page

### 📝 **Page Selection + Reordering**
- Select single or multiple pages
- Reorder selected pages with Up/Down arrows
- Visual selection overlay

### 📄 **PDF Generation**
- Selected pages → merged into new PDF  
- PDF is streamed back to frontend as Blob  
- Auto-download + open in new tab

### 📚 **User PDF History**
- View all previously generated PDFs
- Pagination supported
- Download old PDFs anytime

### 🗂 **Modern UI**
- Clean header (fixed)
- Stylish card design
- Responsive layout

---

## 📁 Project Structure

PDF_UPLOAD_PROJECT/
│
├── front-end/
│ ├── src/
│ │ ├── pages/
│ │ │ └── Home.tsx
│ │ ├── features/ (Redux slices)
│ │ ├── store/ (Redux store)
│ │ ├── layout/Header.tsx
│ │ └── app/axiosInstance.ts
│ └── package.json
│
└── back-end/
├── src/
│ ├── controllers/
│ ├── services/
│ ├── repositories/
│ ├── middleware/
│ ├── models/
│ └── utils/
└── package.json
