import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Iltimos, prompt kiriting!' },
        { status: 400 }
      );
    }

    console.log('🎨 Rasm yaratilmoqda...', prompt);

    // Pollinations API - BEPUL, API key KERAK EMAS!
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;
    
    // Rasm mavjudligini tekshirish
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Rasm yaratilmadi');
    }
    
    console.log('✅ Rasm yaratildi!');
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
    });

  } catch (error: any) {
    console.error('❌ Xatolik:', error);
    return NextResponse.json(
      { error: error.message || 'Serverda xatolik' },
      { status: 500 }
    );
  }
}