
import React, { useEffect, useState } from 'react';
import { OilProduct, AIAnalysis } from '../types';
import { getOilGastronomy, generateDishImage } from '../services/geminiService';

interface OilModalProps {
  oil: OilProduct | null;
  onClose: () => void;
}

const OilModal: React.FC<OilModalProps> = ({ oil, onClose }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [dishImage, setDishImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (oil) {
      setLoading(true);
      setAnalysis(null);
      setDishImage('');
      
      getOilGastronomy(oil).then(async (res) => {
        setAnalysis(res);
        const img = await generateDishImage(res.recipe.dishName, res.recipe.country);
        setDishImage(img);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [oil]);

  if (!oil) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-md overflow-hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Partie Gauche : Visuel Gastronomique */}
        <div className="md:w-5/12 bg-slate-900 relative min-h-[300px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-emerald-900/50 backdrop-blur-sm z-10">
              <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <p className="text-xs font-black uppercase tracking-widest animate-pulse">Inspiration Culinaire AI...</p>
            </div>
          ) : (
            <div className="h-full w-full">
              <img src={dishImage || oil.image} alt="Dish" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2 inline-block">Suggestion du Chef</span>
                <h3 className="text-white text-3xl font-black serif italic">{analysis?.recipe.dishName}</h3>
                <p className="text-emerald-300 text-sm font-bold">{analysis?.recipe.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Partie Droite : Analyse & Recette */}
        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto bg-slate-50">
          <div className="mb-10">
            <h2 className="text-emerald-900 text-xs font-black uppercase tracking-[0.2em] mb-4">L'Huile d'Exception</h2>
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 serif italic">{oil.name}</h1>
                <p className="text-emerald-700 font-bold">{oil.producer} — {oil.origin}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-800">{oil.score}/10</div>
                <div className="text-[10px] font-black uppercase text-slate-400">Score Experts</div>
              </div>
            </div>
          </div>

          {!loading && analysis && (
            <div className="space-y-12">
              {/* Note de dégustation */}
              <section>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Note de Dégustation</h4>
                <p className="text-slate-700 text-lg leading-relaxed font-serif italic border-l-4 border-amber-400 pl-6 py-2">
                  "{analysis.sommelierNote}"
                </p>
              </section>

              {/* Recette détaillée */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h4 className="text-[10px] font-black uppercase text-emerald-900 tracking-widest whitespace-nowrap">Recette Signature</h4>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                      Ingrédients
                    </h5>
                    <ul className="space-y-2">
                      {analysis.recipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                      Préparation
                    </h5>
                    <ul className="space-y-4">
                      {analysis.recipe.instructions.map((step, i) => (
                        <li key={i} className="text-sm text-slate-600 leading-relaxed">
                          <span className="font-black text-emerald-800 mr-2">{i+1}.</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100">
                   <h5 className="font-bold text-slate-900 mb-2">Histoire Culturelle</h5>
                   <p className="text-sm text-slate-500 italic leading-relaxed">{analysis.recipe.history}</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OilModal;
