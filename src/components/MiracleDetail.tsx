import { Download, ZoomIn, ZoomOut, Maximize, Heart, Church, Sparkles, BookOpen } from "lucide-react";
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
        className="bg-white/95 hover:bg-white text-sky-900 p-2.5 rounded-full shadow-lg border border-sky-200 hover:border-sky-400 transition-all active:scale-95"
        title="Zoom In"
        aria-label="Zoom in on document"
      >
        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="bg-white/95 hover:bg-white text-sky-900 p-2.5 rounded-full shadow-lg border border-sky-200 hover:border-sky-400 transition-all active:scale-95"
        title="Zoom Out"
        aria-label="Zoom out on document"
      >
        <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="bg-white/95 hover:bg-white text-sky-900 p-2.5 rounded-full shadow-lg border border-sky-200 hover:border-sky-400 transition-all active:scale-95"
        title="Reset Zoom"
        aria-label="Reset zoom and center document"
      >
        <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
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
  const [containerSize, setContainerSize] = useState({ width: 600, height: 750 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]) {
          const rect = entries[0].contentRect;
          if (rect.width > 0 && rect.height > 0) {
            setContainerSize({
              width: rect.width,
              height: rect.height
            });
          }
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const safeWidth = Math.max(containerSize.width * 0.92, 280);
  const safeHeight = Math.max(containerSize.height * 0.92, 380);
  const containerAspect = safeHeight > 0 ? safeWidth / safeHeight : 0.75;
  
  // The poster aspect ratio is roughly 3:4 (0.75).
  // If the container is narrower than the poster, constrain by width.
  // Otherwise, constrain by height to ensure top/bottom don't cut off.
  const constrainByWidth = containerAspect < 0.75;

  if (!miracle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-8 h-full">
        <img src="/Picture2.png" alt="Jesus" className="h-40 sm:h-48 w-auto mb-6 object-contain drop-shadow-xl" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-900 mb-2 font-serif text-center">Select a Miracle</h2>
        <p className="text-base sm:text-lg text-sky-700 font-medium text-center max-w-md">
          Explore the approved Eucharistic Miracles from around the world by selecting one from the sidebar.
        </p>
      </div>
    );
  }

  const pdfSlug = miracle.slug || miracle.pdfUrl.split('/').pop()?.toLowerCase().replace('.pdf', '');
  const pdfProxyUrl = `/api/pdf/${pdfSlug}.pdf`;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto lg:overflow-hidden relative">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sky-100 shrink-0 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950 font-serif leading-tight">{miracle.title}</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs sm:text-sm font-bold">
              {miracle.category}
            </span>
            {miracle.year && (
              <span className="text-slate-500 font-medium text-xs sm:text-sm flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>
                Year {miracle.year}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => onToggleFavorite(miracle.id)}
            className={`flex items-center justify-center p-2.5 sm:p-3 rounded-full shadow-sm transition-all border-2 ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-400'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
          <a 
            href={pdfProxyUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 px-4 sm:px-5 py-2.5 rounded-full font-bold text-sm sm:text-base flex items-center transition-all shadow-sm hover:shadow-md"
            title="Download PDF"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Download PDF
          </a>
        </div>
      </div>
      
      {/* Content Container: Unified vertical scroll on Mobile/Tablet (< lg), Split-Screen on Desktop (>= lg) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:overflow-hidden">
        {/* PDF Poster Viewer Section */}
        <div className="w-full lg:flex-[1.4] xl:flex-[1.5] min-h-[480px] sm:min-h-[580px] md:min-h-[660px] lg:min-h-0 lg:h-full relative bg-slate-200/70 border-b lg:border-b-0 lg:border-r border-sky-100 flex flex-col shrink-0 lg:shrink">
          
          {/* Subtle Mobile Scroll Hint Banner */}
          <div className="lg:hidden bg-sky-100/90 border-b border-sky-200/80 px-4 py-2 text-center text-xs font-semibold text-sky-800 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Poster &bull; Scroll down to read full narrative</span>
          </div>

          <div 
            ref={containerRef}
            className="flex-1 relative overflow-hidden flex items-center justify-center select-none"
          >
            <TransformWrapper
              initialScale={1}
              minScale={0.8}
              maxScale={4}
              centerOnInit
              limitToBounds={true}
              panning={{ velocityDisabled: true }}
              wheel={{ step: 0.1 }}
              doubleClick={{ mode: "reset" }}
            >
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                  <div className="w-full h-full overflow-hidden flex items-center justify-center p-3 sm:p-5">
                    <Document
                      file={pdfProxyUrl}
                      className="flex items-center justify-center"
                      loading={
                        <div className="flex flex-col items-center justify-center p-12 text-sky-700 animate-pulse font-medium">
                          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          Loading visual exhibition poster...
                        </div>
                      }
                      error={
                        <div className="p-8 text-center text-rose-700 font-medium bg-rose-50 border border-rose-200 rounded-2xl m-4 max-w-md shadow-sm">
                          <p className="font-bold text-lg mb-2">Exhibition Poster Preview</p>
                          <p className="text-sm mb-4">You can download or view the full official PDF directly using the button above.</p>
                          <a 
                            href={pdfProxyUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 text-sm font-bold rounded-xl shadow-sm"
                          >
                            <Download className="w-4 h-4 mr-1.5" />
                            Open Original PDF
                          </a>
                        </div>
                      }
                    >
                      <div className="rounded-xl shadow-2xl border border-slate-300/80 bg-white overflow-hidden ring-1 ring-black/5">
                        <Page 
                          pageNumber={1} 
                          renderTextLayer={false} 
                          renderAnnotationLayer={false} 
                          width={constrainByWidth ? safeWidth : undefined}
                          height={!constrainByWidth ? safeHeight : undefined}
                        />
                      </div>
                    </Document>
                  </div>
                </TransformComponent>
                <Controls />
              </div>
            </TransformWrapper>
          </div>
        </div>

        {/* Narrative / Description Text Section */}
        <div className="flex-1 p-5 sm:p-8 md:p-10 lg:overflow-y-auto bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-sky-100">
              <img src="/Picture3.png" className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm" alt="Icon" />
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950 font-serif">
                  About this Miracle
                </h3>
                <p className="text-xs sm:text-sm text-sky-600 font-medium">
                  Historical narrative and documented testimonies
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {miracle.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="mt-8 sm:mt-12 p-5 sm:p-6 bg-sky-100/70 rounded-2xl border border-sky-200 shadow-sm flex items-start gap-4">
              <Church className="w-6 h-6 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-sky-950">Official Historical Record</p>
                <p className="text-sm text-sky-800 font-medium mt-1 leading-relaxed">
                  This narrative is part of the International Exhibition of Eucharistic Miracles of the World, meticulously researched and curated by Blessed Carlo Acutis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
