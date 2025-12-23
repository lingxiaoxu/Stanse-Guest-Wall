
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { handle, bio, lang, manualInput } = await req.json();

    if (!process.env.API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    // --- FIREBASE RECORDING LOGIC (PLACEHOLDER) ---
    // In a production environment, you would save the user data here.
    // Example:
    // const db = admin.firestore();
    // await db.collection('guests').doc(handle).set({
    //   bio,
    //   manualInput: manualInput || null,
    //   updatedAt: new Date(),
    //   isVerified: !!manualInput
    // }, { merge: true });
    // ----------------------------------------------

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map language code to full English name for the prompt
    const languageNames: Record<string, string> = {
        en: 'English',
        zh: 'Chinese',
        ja: 'Japanese',
        fr: 'French'
    };
    // Default to Chinese if not found or provided
    const targetLang = languageNames[lang] || 'Chinese';

    // Structured JSON response prompt
    // Logic: If manualInput exists, IT IS THE TRUTH.
    // Logic: If bio is empty/scant AND no manualInput, return "Unknown" translated to target lang.
    const prompt = `
      Analyze this Instagram profile:
      Handle: ${handle}
      Bio: ${bio || "(Empty/Private Profile)"}
      
      ${manualInput ? `CRITICAL: The user has manually provided the following correction/context. You MUST prioritize this information over the Bio above: "${manualInput}".` : ''}

      Provide a concise, witty, and Swiss-design style analysis in ${targetLang}. 
      Keep sentences short and punchy. No long paragraphs.
      
      Instructions for "Unknown" data:
      If the Bio is empty/private AND there is no manual input provided, you MUST set the values for personality, career, and lifestyle to a translated version of "Unknown" or "Private Account". 
      However, if Manual Input is provided, generate a full creative analysis based on that input.

      Return a JSON object with:
      1. title: A short 2-3 word witty label for this person (e.g. "Digital Nomad", "Coffee Snob"). If unknown, use "Unknown User".
      2. personality: One short sentence about their vibe.
      3. career: One short prediction of their job.
      4. lifestyle: One short observation about their habits.
      5. summary: A final one-sentence roasts/summary.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            personality: { type: Type.STRING },
            career: { type: Type.STRING },
            lifestyle: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ['title', 'personality', 'career', 'lifestyle', 'summary']
        }
      }
    });

    return NextResponse.json({ 
        success: true, 
        analysis: response.text 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ success: false, message: 'AI Analysis Failed' }, { status: 500 });
  }
}
