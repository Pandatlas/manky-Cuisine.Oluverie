
import React, { useState, useRef, useEffect } from 'react';
import { createSommelierChat, connectToLiveSommelier } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Audio States
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    if (!chatRef.current) chatRef.current = createSommelierChat();

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const startLiveConversation = async () => {
    if (isLiveActive) {
      setIsLiveActive(false);
      sessionRef.current?.close();
      return;
    }

    setIsLiveActive(true);
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;
    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();

    const sessionPromise = connectToLiveSommelier({
      onopen: () => console.log("Live Connected"),
      onmessage: async (message: LiveServerMessage) => {
        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData) {
          nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
          const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
          const source = outputCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(outputCtx.destination);
          source.start(nextStartTime);
          nextStartTime += buffer.duration;
          sources.add(source);
        }
      },
      onclose: () => setIsLiveActive(false)
    });

    sessionRef.current = await sessionPromise;

    // Mic streaming
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const source = inputCtx.createMediaStreamSource(micStream);
    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
      sessionRef.current.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
    };
    source.connect(processor);
    processor.connect(inputCtx.destination);
  };

  // Audio helpers
  function decode(b64: string) { return new Uint8Array(atob(b64).split("").map(c => c.charCodeAt(0))); }
  function encode(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)); }
  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, rate: number, channels: number) {
    const data16 = new Int16Array(data.buffer);
    const len = data16.length / channels;
    const buf = ctx.createBuffer(channels, len, rate);
    for (let c = 0; c < channels; c++) {
      const chData = buf.getChannelData(c);
      for (let i = 0; i < len; i++) chData[i] = data16[i * channels + c] / 32768.0;
    }
    return buf;
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-emerald-950 p-6 text-white flex justify-between items-center">
            <div>
              <h4 className="font-bold serif italic">Maître Sommelier</h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Assistant Expert AI</p>
            </div>
            <button 
              onClick={startLiveConversation}
              className={`p-2 rounded-full transition ${isLiveActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-800 hover:bg-emerald-700'}`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 text-xs italic">Posez une question sur nos huiles d'exception...</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm flex gap-1 items-center">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <button onClick={handleSend} className="bg-emerald-900 text-white p-2 rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-900 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-emerald-800 transition transform hover:scale-110 active:scale-95 border-4 border-white"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      </button>
    </div>
  );
};

export default AIChatAssistant;
