
import React, { useState } from 'react';
import { CameraView } from './CameraView';
import { analyzePlantDisease } from '../services/geminiService';
import { DiseaseAnalysis } from '../types';

export const DiseaseScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);

  const handleCapture = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzePlantDisease(base64);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert("AI Analysis encountered an issue. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">PLANT CLINIC <span className="text-emerald-500">AI</span></h2>
        <p className="text-slate-500 font-medium mt-2">Enterprise-grade diagnostic tool. Capture a clear leaf image to detect pathogens instantly.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <CameraView isActive={true} onCapture={handleCapture} />
          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-info-circle" />
            </div>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              LEGAL DISCLAIMER: This AI diagnostic is for guidance only. Consult a certified agronomist for commercial use.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 min-h-[500px] flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <i className="fas fa-microscope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-800">Analyzing Pathogens</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Processing AI Inference...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{result.species}</h3>
                    <p className="text-emerald-600 font-black uppercase text-xs tracking-widest">{result.diseaseName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase">Confidence</div>
                    <div className="text-xl font-black text-slate-800">{(result.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl flex items-center gap-4 ${
                  result.severity === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                  result.severity === 'Moderate' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  <i className={`fas ${result.severity === 'High' ? 'fa-exclamation-triangle' : 'fa-check-circle'} text-2xl`} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Severity Level</p>
                    <p className="font-bold">{result.severity} Risk</p>
                  </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Treatment Plan</h4>
                   <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.treatment}</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recommended Products</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.recommendedProducts.map((prod, idx) => (
                      <div key={idx} className="w-full p-3 bg-slate-50 text-slate-800 rounded-xl text-xs font-black flex justify-between items-center">
                        {prod}
                        <i className="fas fa-shopping-cart opacity-30" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={() => setResult(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm">
                  NEW SCAN
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4">
                <i className="fas fa-leaf text-6xl opacity-20" />
                <p className="font-black text-center text-sm uppercase tracking-widest">Awaiting Capture</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseScanner;
