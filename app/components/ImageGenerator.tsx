'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Download, Sparkles, RefreshCw } from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; url: string }[]>([]);
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('hd');

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Iltimos, prompt kiriting!');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, quality }),
      });

      const data = await res.json();

      if (data.success) {
        setImageUrl(data.imageUrl);
        setHistory(prev => [{ prompt: data.prompt, url: data.imageUrl }, ...prev].slice(0, 10));
        toast.success('Rasm yaratildi! 🎨');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-image-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Rasm yuklandi! 📥');
    } catch (error) {
      toast.error('Yuklab olishda xatolik');
    }
  };

  const clearAll = () => {
    setPrompt('');
    setImageUrl('');
    setHistory([]);
    toast('Hamma tozalandi 🧹');
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-gray-500 mt-2">✨ Matn yozing, DALL-E 3 rasm yaratsin ✨</p>
          <p className="text-xs text-gray-400 mt-1">Bepul kredit: 125 ta rasm</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chap tomon - Input qismi */}
          <div className="space-y-5">
            {/* Prompt input */}
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎨 Rasm haqida tavsif yozing
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Masalan: A beautiful sunset over mountains, digital art, vibrant colors, 4k quality"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                rows={4}
              />
            </div>

            {/* Sozlamalar */}
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">📏 Oʻlcham</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none"
                  >
                    <option value="1024x1024">1:1 - Kvadrat</option>
                    <option value="1792x1024">16:9 - Keng</option>
                    <option value="1024x1792">9:16 - Portret</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">⭐ Sifat</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none"
                  >
                    <option value="hd">HD (Eng yaxshi)</option>
                    <option value="standard">Standard (Tez)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prompt misollari */}
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ✨ Tavsiya etilgan promptlar
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'A cyberpunk city at night, neon lights, rain, cinematic',
                  'A cute cat astronaut floating in space, cartoon style',
                  'Watercolor painting of a Japanese garden, cherry blossoms',
                  'Abstract geometric art, vibrant colors, modern design',
                  'A photorealistic portrait of a wizard, dramatic lighting, detailed'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="px-3 py-1.5 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition"
                  >
                    {suggestion.slice(0, 35)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex gap-3">
              <button
                onClick={generateImage}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Yaratilmoqda...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Rasm yaratish</>
                )}
              </button>
              {imageUrl && (
                <button
                  onClick={clearAll}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Tarix */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">📜 Oxirgi yaratilganlar</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(item.prompt);
                        setImageUrl(item.url);
                      }}
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border hover:border-purple-500 transition"
                    >
                      <img src={item.url} alt="History" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* O'ng tomon - Natija */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-gray-900">🖼️ Natija</h3>
              <p className="text-xs text-gray-400 mt-1">DALL-E 3 tomonidan yaratildi</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-500">Rasm yaratilmoqda...</p>
                  <p className="text-xs text-gray-400 mt-1">Bu 5-10 soniya vaqt olishi mumkin</p>
                </div>
              ) : imageUrl ? (
                <div className="relative group">
                  <img 
                    src={imageUrl} 
                    alt="Generated" 
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                  <button
                    onClick={downloadImage}
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <Download className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 text-gray-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" />
                      <circle cx="8.5" cy="8.5" r="2.5" />
                      <path d="M21 15L16 10L5 21" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Rasm hali yaratilmagan</p>
                  <p className="text-xs text-gray-400 mt-1">Prompt yozib, tugmani bosing</p>
                </div>
              )}
            </div>
            
            {imageUrl && (
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>✨ Yaratilgan rasmni yuklab olishingiz mumkin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}