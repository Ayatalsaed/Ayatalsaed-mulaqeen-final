import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkCodeWithGemini = async (code: string, taskDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Code:\n${code}\n\nTask:\n${taskDescription}`,
      config: {
        systemInstruction: `أنت "مُلَقِّن"، مدرب روبوتات ذكي وودود. 
        دورك هو مساعدة الطالب في فهم الكود الخاص به وتصحيحه بناءً على المهمة المطلوبة.
        تحدث باللغة العربية بأسلوب مشجع.
        إذا كان الكود صحيحًا، هنئ الطالب واشرح لماذا هو صحيح.
        إذا كان هناك خطأ، اشرح الخطأ ببساطة واقترح الحل (لا تعطِ الحل مباشرة بل لمح له).
        ركز على مفاهيم: الحلقات التكرارية (Loops)، الشروط (Conditions)، والحساسات (Sensors).`,
        temperature: 0.7,
      }
    });
    return response.text || "لم أتمكن من قراءة الرد.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي.";
  }
};

export const chatWithMulaqqin = async (message: string, context: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: ${context}\n\nUser Question: ${message}`,
            config: {
                systemInstruction: "أنت مساعد ذكي في منصة 'مُلَقِّن' لتعليم الروبوتات. أجب بإيجاز ووضوح باللغة العربية.",
            }
        });
        return response.text || "لا يوجد رد.";
    } catch (error) {
        return "حدث خطأ في الاتصال.";
    }
}