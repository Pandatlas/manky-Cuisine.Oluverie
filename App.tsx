
import React, { useState, useMemo } from 'react';
import { OilCategory, OilProduct, MedalType } from './types';
import { OIL_DATA } from './constants';
import OilModal from './components/OilModal';
import AIChatAssistant from './components/AIChatAssistant';
import { getGlobalSummary } from './services/geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous les pays');
  const [selectedOil, setSelectedOil] = useState<OilProduct | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const countries = useMemo(() => {
    const list = OIL_DATA.map(oil => oil.origin);
    return ['Tous les pays', ...Array.from(new Set(list))];
  }, []);

  const filteredOils = useMemo(() => {
    return OIL_DATA.filter(oil => {
      const matchesSearch = oil.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           oil.producer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === 'Tous les pays' || oil.origin === selectedCountry;
      return matchesSearch && matchesCountry;
    }).sort((a, b) => a.rank - b.rank);
  }, [searchTerm, selectedCountry]);

  const handleRowClick = (oil: OilProduct) => {
    if (loadingId) return;
    setLoadingId(oil.id);
    setTimeout(() => {
      setSelectedOil(oil);
    }, 250);
  };

  const triggerGlobalSummary = async () => {
    setIsSummaryLoading(true);
    const data = await getGlobalSummary(OIL_DATA);
    setSummaryData(data);
    setIsSummaryLoading(false);
    setShowSummaryModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation de Luxe */}
      <nav className="bg-white/80 backdrop-blur-2xl sticky top-0 z-40 border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-black text-emerald-950 tracking-tighter flex items-center gap-2">
            <span className="bg-emerald-800 text-white px-2 py-0.5 rounded italic">O</span>
            RANK <span className="text-amber-500 text-xs tracking-widest ml-1 hidden sm:inline">GASTRONOMIE</span>
          </h1>
          <div className="hidden lg:flex items-center space-x-10">
            <a href="#" className="text-slate-400 hover:text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] transition">Terroirs</a>
            <a href="#" className="text-slate-400 hover:text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] transition">Cuisine</a>
            <a href="#" className="text-slate-400 hover:text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] transition">Sommellerie</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={triggerGlobalSummary}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all border ${
              isSummaryLoading ? 'bg-slate-50 border-slate-100 text-slate-300' : 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100 shadow-sm'
            }`}
          >
            Analyse Globale AI
          </button>
          <button className="bg-emerald-950 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10">
            Soumettre
          </button>
        </div>
      </nav>

      {/* Hero Gastronomique */}
      <header className="relative bg-[#0a1e16] text-white py-24 md:py-36 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0a1e16]/80"></div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <span className="inline-block px-4 py-1 border border-emerald-500/40 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-8">
            L'Or Liquide Méditerranéen — Édition 2026
          </span>
          <h2 className="text-5xl md:text-8xl font-black mb-8 serif italic leading-tight tracking-tight">
            L'Âme Culinaire de <br/> la Méditerranée
          </h2>
          <p className="text-emerald-100/60 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed serif italic">
            "Le mariage sacré entre la terre de l'olivier et l'art de la table."
          </p>
        </div>
      </header>

      {/* Recherche & Filtre Pays */}
      <section className="max-w-7xl mx-auto -mt-12 relative z-20 px-4 md:px-0">
        <div className="bg-white/70 backdrop-blur-3xl shadow-2xl rounded-3xl p-6 md:p-8 border border-white/40 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Rechercher un terroir, une huile, un producteur..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-4 border border-slate-100 rounded-2xl focus:ring-1 focus:ring-emerald-500 outline-none transition bg-white/50 text-emerald-950 font-medium placeholder:text-slate-300"
              />
            </div>
            <div className="w-full md:w-64">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-4 px-6 border border-slate-100 rounded-2xl focus:ring-1 focus:ring-emerald-500 outline-none transition bg-white/50 text-emerald-950 font-bold text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres Rapides (Boutons Pays) */}
          <div className="flex flex-wrap gap-2 pt-2">
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedCountry === country 
                  ? 'bg-emerald-950 text-white shadow-lg' 
                  : 'bg-white text-slate-400 hover:text-emerald-800 border border-slate-100'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Table du Palmarès */}
      <main className="max-w-7xl mx-auto px-6 py-20 mb-32">
        <div className="flex justify-between items-end mb-12">
           <div>
             <h3 className="text-3xl font-black text-emerald-950 serif italic">Classement Officiel</h3>
             <p className="text-slate-400 text-xs font-medium mt-1">Filtré par : <span className="text-emerald-800 font-bold">{selectedCountry}</span></p>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indexé par le Conseil Oléicole International</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredOils.length > 0 ? filteredOils.map((oil) => (
            <div 
              key={oil.id} 
              className={`group bg-white rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 cursor-pointer border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-500 ${loadingId === oil.id ? 'bg-emerald-50 ring-2 ring-emerald-500/20' : ''}`}
              onClick={() => handleRowClick(oil)}
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <span className={`text-4xl font-black italic serif ${oil.rank <= 3 ? 'text-emerald-800' : 'text-slate-200'}`}>
                  0{oil.rank}
                </span>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                  <img src={oil.image} alt={oil.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">{oil.origin}</div>
                <h4 className="text-xl font-black text-slate-900 serif italic group-hover:text-emerald-800 transition">{oil.name}</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter mt-1">{oil.producer}</p>
              </div>

              <div className="flex items-center gap-12 w-full md:w-auto justify-center">
                <div className="text-center">
                   <div className="text-2xl font-black text-emerald-900">{oil.score.toFixed(1)}</div>
                   <div className="text-[9px] font-black text-slate-300 uppercase">Score</div>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div className="text-center min-w-[120px]">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${oil.rank <= 3 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                      {oil.medal}
                   </span>
                </div>
              </div>

              <div className="md:w-32 flex justify-end">
                {loadingId === oil.id ? (
                  <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition translate-x-4 group-hover:translate-x-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-medium serif italic text-xl">Aucune huile trouvée pour cette sélection.</p>
               <button onClick={() => { setSearchTerm(''); setSelectedCountry('Tous les pays'); }} className="mt-4 text-emerald-700 font-bold text-xs uppercase tracking-widest border-b border-emerald-700 pb-1">Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </main>

      {/* Mind Map AI Modal */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-2xl">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-white/20">
            <div className="p-10 md:p-16 text-center bg-emerald-900 text-white relative">
              <button onClick={() => setShowSummaryModal(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg></button>
              <h3 className="text-4xl font-black serif italic mb-4">La Carte Mentale Culinaire 2026</h3>
              <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Artificielle & Terroirs</p>
            </div>
            <div className="p-12 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-16 bg-slate-50">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.657M16.5 7.657L18 6m-5.657 8.343L11 16m-1.5-6H11"></path></svg></div>
                  <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest">Tendances</h4>
                  <p className="text-slate-500 text-sm leading-relaxed serif italic">{summaryData.trends}</p>
               </div>
               <div className="text-center space-y-4 border-x border-slate-200 px-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-1.5-.454M3 8V4a2 2 0 012-2h14a2 2 0 012 2v4M5 8a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2H5z"></path></svg></div>
                  <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest">Saveurs</h4>
                  <p className="text-slate-500 text-sm leading-relaxed serif italic">{summaryData.flavorMap}</p>
               </div>
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                  <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest">Futur</h4>
                  <p className="text-slate-500 text-sm leading-relaxed serif italic">{summaryData.industryOutlook}</p>
               </div>
            </div>
            <div className="p-10 bg-white border-t border-slate-100 text-center">
               <button onClick={() => setShowSummaryModal(false)} className="px-16 py-4 bg-emerald-950 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-800 transition shadow-xl shadow-emerald-900/10">Fermer l'Analyse</button>
            </div>
          </div>
        </div>
      )}

      <AIChatAssistant />
      <OilModal oil={selectedOil} onClose={() => { setSelectedOil(null); setLoadingId(null); }} />

      <footer className="bg-[#0a1e16] text-emerald-100 py-20 px-6 border-t border-emerald-900/50">
        <div className="max-w-7xl mx-auto text-center">
           <h1 className="text-2xl font-black text-white tracking-tighter mb-8">OILRANK <span className="text-amber-500">GASTRONOMIE</span></h1>
           <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] mb-12 opacity-40">
              <a href="#" className="hover:text-amber-500 transition">Confidentialité</a>
              <a href="#" className="hover:text-amber-500 transition">Méthodologie de Notation</a>
              <a href="#" className="hover:text-amber-500 transition">Mentions Légales</a>
           </div>
           <p className="text-xs font-serif italic text-emerald-600">L'excellence au service de la Méditerranée.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
