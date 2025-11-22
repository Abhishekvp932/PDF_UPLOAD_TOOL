import type {RenderParameters}  from "pdfjs-dist/types/src/display/api";

export interface RenderParamsWithFactory extends RenderParameters {
  canvasFactory: {
    create: (width: number, height: number) => {
      canvas: HTMLCanvasElement;
      context: CanvasRenderingContext2D | null;
    };
    reset: (canvas: HTMLCanvasElement, width: number, height: number) => void;
    destroy: (canvas: HTMLCanvasElement) => void;
  };
}
