"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Check, ArrowUp, ArrowDown, Download } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/handleApiError";
import api from "../../app/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Header from "../../layout/Header";
import { useNavigate } from "react-router-dom";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { RenderParamsWithFactory } from "../../utils/RenderParamsWithFactory ";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
const canvasFactory = {
  create: (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    return { canvas, context };
  },
  reset: (canvas: HTMLCanvasElement, width: number, height: number) => {
    canvas.width = width;
    canvas.height = height;
  },
  destroy: (canvas: HTMLCanvasElement) => {
    canvas.width = 0;
    canvas.height = 0;
  },
};

interface IUserPdf {
  _id: string;
  userId: string;
  fileName: string;
  filePath: string;
  pages: number[];
  createdAt: string;
  updatedAt: string;
}

export function HomePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageImages, setPageImages] = useState<Map<number, string>>(new Map());
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = useSelector((state: RootState) => state.user.id);

  const [history, setHistory] = useState<IUserPdf[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPagesHistory, setTotalPagesHistory] = useState(1);

  const itemsPerPage = 3;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!pdfFile) return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        const buffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        setTotalPages(pdf.numPages);
        await renderAllPages(pdf);
      } catch (err) {
        console.error("PDF load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfFile]);

  const renderAllPages = async (pdf: PDFDocumentProxy) => {
    const images = new Map<number, string>();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height
      );

      const params: RenderParamsWithFactory = {
        viewport,
        canvasContext: context!,
        canvasFactory,
        canvas,
      };

      await page.render(params).promise;

      images.set(i, canvas.toDataURL());
    }

    setPageImages(images);
  };

  const togglePage = (num: number) => {
    setSelectedPages((prev) =>
      prev.includes(num) ? prev.filter((p) => p !== num) : [...prev, num]
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...selectedPages];
    [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
    setSelectedPages(sorted);
  };

  const moveDown = (index: number) => {
    if (index === selectedPages.length - 1) return;
    const sorted = [...selectedPages];
    [sorted[index + 1], sorted[index]] = [sorted[index], sorted[index + 1]];
    setSelectedPages(sorted);
  };

  const handleCreatePdf = async () => {
    if (!pdfFile) {
      alert("Upload a PDF first");
      return;
    }
    if (selectedPages.length === 0) {
      alert("Select at least one page");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("pages", JSON.stringify(selectedPages));

    try {
      const response = await api.post(
        `/api/user/extract/${userId}?page=${historyPage}&limit=${itemsPerPage}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted.pdf";
      a.click();

      URL.revokeObjectURL(url);

      fetchPdfHistory();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const fetchPdfHistory = async () => {
    try {
      const response = await api.get(
        `/api/user/history/${userId}?page=${historyPage}&limit=${itemsPerPage}`
      );

      console.log("History backend:", response.data);

      setHistory(response.data.data);
      setTotalPagesHistory(response.data.totalPages);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  useEffect(() => {
    if (userId) fetchPdfHistory();
  }, [historyPage]);

  const handlePdfDownload = async (pdfId: string, fileName: string) => {
    try {
      const response = await api.get(`/api/user/download/${pdfId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);

      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 pt-24">
      <Header />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">PDF Page Extractor</h1>

        <div
          className="cursor-pointer border-2 border-dashed p-10 text-center bg-white rounded-xl shadow"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-600" />
          <p className="mt-3 text-lg">Click to upload your PDF</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file?.type === "application/pdf") {
                setPdfFile(file);
                setSelectedPages([]);
              }
            }}
          />
        </div>

        {pdfFile && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">
              Pages ({totalPages})
            </h2>

            {loading && <p>Loading PDF...</p>}

            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: totalPages }, (_, i) => {
                  const num = i + 1;
                  const selected = selectedPages.includes(num);
                  const img = pageImages.get(num);

                  return (
                    <div
                      key={num}
                      className="border bg-white rounded-xl overflow-hidden shadow"
                    >
                      <div
                        onClick={() => togglePage(num)}
                        className="cursor-pointer relative"
                      >
                        {img ? (
                          <img src={img} className="w-full" />
                        ) : (
                          <div className="h-40 bg-gray-200 flex items-center justify-center">
                            Loading...
                          </div>
                        )}

                        {selected && (
                          <div className="absolute inset-0 bg-blue-500/30 flex justify-center items-center">
                            <Check className="h-10 w-10 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 flex justify-between items-center">
                        <span className="font-medium">Page {num}</span>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => togglePage(num)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedPages.length > 0 && (
              <div className="mt-12 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Reorder Pages</h3>

                <div className="space-y-3">
                  {selectedPages.map((page, index) => (
                    <div
                      key={page}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                    >
                      <span className="font-medium">Page {page}</span>

                      <div className="flex gap-3">
                        <button
                          onClick={() => moveUp(index)}
                          className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          <ArrowUp />
                        </button>

                        <button
                          onClick={() => moveDown(index)}
                          className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          <ArrowDown />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
                  onClick={handleCreatePdf}
                >
                  Create PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-6">Your Recent PDFs</h2>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {history.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <p className="font-semibold text-lg">{item.fileName}</p>
                <p className="text-sm text-gray-600">
                  Pages: {item.pages.join(", ")}
                </p>
                <p className="text-xs text-gray-400">
                  Created:{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <button
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => handlePdfDownload(item._id, item.fileName)}
              >
                <Download size={18} /> Download
              </button>
            </div>
          ))}

          <div className="flex justify-center mt-6 gap-3">
            <button
              disabled={historyPage === 1}
              onClick={() => setHistoryPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPagesHistory }, (_, i) => (
              <button
                key={i}
                onClick={() => setHistoryPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  historyPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={historyPage === totalPagesHistory}
              onClick={() => setHistoryPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
