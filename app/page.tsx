'use client';
import ImageGenerator from './components/ImageGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ImageGenerator />
    </main>
  );
}