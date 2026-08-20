import { Download, ZoomIn, ZoomOut, Maximize, Heart } from "lucide-react";
import { Miracle } from "../types";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useRef, useEffect } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './pdf-viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 z-20">
      <button 
        onClick={() => zoomIn()} 
        className="bg-white/90 hover:bg-white text-sky-900 p-2 rounded-full shadow-lg border-2 border-sky-200 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="bg-white/90 hover:bg-white text-sky-900 p-2 rounded-full shadow-lg border-2 border-sky-200 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="bg-white/90 hover:bg-white text-sky-900 p-2 rounded-full shadow-lg border-2 border-sky-200 transition-colors"
        title="Reset"
      >
        <Maximize className="w-5 h-5" />
      </button>
    </div>
  );
};

interface MiracleDetailProps {
  miracle: Miracle | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function MiracleDetail({ miracle, isFavorite, onToggleFavorite }: MiracleDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 1000 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]) {
          setContainerSize({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height
          });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const safeWidth = containerSize.width * 0.95;
  const safeHeight = containerSize.height * 0.95;
  const containerAspect = safeHeight > 0 ? safeWidth / safeHeight : 1;
  
  // The poster aspect ratio is roughly 3:4 (0.75).
  // If the container is narrower than the poster, constrain by width.
  // Otherwise, constrain by height to ensure top/bottom don't cut off.
  const constrainByWidth = containerAspect < 0.75;

  if (!miracle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-8 h-full">
        <img src="/Picture2.png" alt="Jesus" className="h-48 w-auto mb-6 object-contain drop-shadow-xl" />
        <h2 className="text-3xl font-extrabold text-sky-900 mb-2">Select a Miracle</h2>
        <p className="text-lg text-sky-700 font-medium text-center max-w-md">
          Explore the approved Eucharistic Miracles from around the world by selecting one from the sidebar.
        </p>
      </div>
    );
  }

  const pdfSlug = miracle.slug || miracle.pdfUrl.split('/').pop()?.toLowerCase().replace('.pdf', '');
  const pdfProxyUrl = `/api/pdf/${pdfSlug}.pdf`;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <div className="bg-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sky-100 shrink-0 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">{miracle.title}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-bold">
              {miracle.category}
            </span>
            {miracle.year && (
              <span className="text-slate-500 font-medium flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>
                {miracle.year}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleFavorite(miracle.id)}
            className={`flex items-center justify-center p-3 rounded-full shadow-sm transition-all border-2 ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-400'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
          <a 
            href={pdfProxyUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 px-5 py-2.5 rounded-full font-bold flex items-center transition-all shadow-sm hover:shadow-md"
            title="Download PDF"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </a>
        </div>
      </div>
      
      {/* Split Content */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* PDF Viewer - Full bleed */}
        <div 
          ref={containerRef}
          className="flex-[1.5] relative bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-sky-100"
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
            limitToBounds={false}
          >
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                  <Document
                    file={pdfProxyUrl}
                    className="w-full h-full flex items-center justify-center"
                    loading={
                      <div className="flex flex-col items-center justify-center p-12 text-sky-700 animate-pulse font-medium">
                        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading visual record...
                      </div>
                    }
                    error={
                      <div className="p-8 text-center text-red-400 font-medium bg-black/20 rounded-xl m-4">
                        Failed to load PDF. Please try downloading it directly using the button above.
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={1} 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false} 
                      width={constrainByWidth ? safeWidth : undefined}
                      height={!constrainByWidth ? safeHeight : undefined}
                      className="shadow-2xl"
                    />
                  </Document>
                </div>
              </TransformComponent>
              <Controls />
            </div>
          </TransformWrapper>
        </div>

        {/* Description Text */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50">
          <div className="prose prose-sky max-w-none">
            <h3 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-4">
              <img src="/Picture3.png" className="h-16 w-auto object-contain drop-shadow-sm" alt="Icon" />
              About this Miracle
            </h3>
            <div className="space-y-6">
              {miracle.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg text-slate-700 leading-relaxed font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="mt-10 p-5 bg-sky-100 rounded-2xl border border-sky-200">
              <p className="text-sm text-sky-900 font-medium">
                <strong>Historical Record:</strong> This information is part of the Eucharistic Miracles of the World exhibition created by Blessed Carlo Acutis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
