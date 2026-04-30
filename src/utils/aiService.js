import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Converts an image URL to a Base64 data URL.
 * Required for Gemini AI to process images that have already been uploaded to storage.
 * 
 * @param {string} url - The URL of the image to convert.
 * @returns {Promise<{base64: string, mimeType: string}>}
 */
export const imageUrlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        const mimeType = blob.type || 'image/jpeg';
        // Extract the raw base64 data (without the data:image/xxx;base64, prefix)
        const base64Raw = base64data.split(',')[1];
        resolve({ base64: base64Raw, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    if (error.message.includes('CORS')) {
      throw new Error('IMAGE_FETCH_CORS_ERROR');
    }
    throw new Error(`IMAGE_FETCH_ERROR: ${error.message}`);
  }
};

/**
 * Generates a professional product description based on an image and optional metadata.
 * 
 * @param {string} imageSource - The Base64 data URL OR a public URL of the product image.
 * @param {string} apiKey - The Google Gemini API Key.
 * @param {string} language - The language to generate the description in (e.g., 'en', 'fr').
 * @param {object} metadata - Optional context like product name or category.
 * @param {string} modelName - The Gemini model to use (default: 'gemini-1.5-flash').
 * @returns {Promise<string>} - The generated description.
 */
export const generateAIProductDescription = async (imageSource, apiKey, language = 'en', metadata = {}, modelName = 'gemini-1.5-flash') => {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  if (!imageSource) {
    throw new Error('MISSING_IMAGE');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });

    let base64Data;
    let mimeType;

    // Check if imageSource is already a Base64 data URL
    if (imageSource.startsWith('data:')) {
      const mimeMatch = imageSource.match(/^data:([^;]+);base64,/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      base64Data = imageSource.split(',')[1];
    } else {
      // It's likely a URL, fetch and convert it
      const result = await imageUrlToBase64(imageSource);
      base64Data = result.base64;
      mimeType = result.mimeType;
    }
    
    const prompt = `
      You are a professional e-commerce copywriting expert for a premium electronics store called 'Sweeto-Tech'.
      Analyze the provided image and generate a compelling, high-end product description.
      
      Requirements:
      - Language: Generate the response completely in ${language === 'fr' ? 'French' : 'Spanish' ? language === 'es' ? 'Spanish' : 'English' : 'English'}.
      - Content: Focus on features, benefits for the user, and tech specs if visible.
      - Style: Professional, persuasive, and sleek.
      - Formatting: Use concise paragraphs. Avoid bullet points if possible, but keep it readable.
      - Product Context: ${metadata.name ? `The product name is "${metadata.name}".` : 'Identify the product from the image.'}
      
      Write ONLY the description itself. Do not include any intros or outros.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    
    if (error.message === 'IMAGE_FETCH_CORS_ERROR') {
      throw new Error('AI_GEN_ERROR: The image could not be loaded due to security (CORS) restrictions. Please ensure your storage bucket allows requests from this domain.');
    }

    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('api key not valid') || errorMessage.includes('invalid api key')) {
      throw new Error('INVALID_API_KEY');
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      throw new Error('AI_QUOTA_EXCEEDED');
    }

    if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
      throw new Error('AI_SAFETY_BLOCK');
    }

    if (errorMessage.includes('overload') || errorMessage.includes('503') || errorMessage.includes('unavailable')) {
      throw new Error('AI_MODEL_OVERLOADED');
    }

    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      // Try to list models to help the user see what's available
      try {
        const test = await testGeminiConnection(apiKey);
        if (test.success) {
          console.log("--- AI DIAGNOSTICS: Available Models for your Key ---");
          console.table(test.models);
          console.log("Please select one of these in Store Settings.");
        }
      } catch (e) {
        // Ignore failure in diagnostic
      }
      throw new Error('AI_MODEL_NOT_FOUND');
    }

    // Pass through the actual error message to help the user debug
    throw new Error(`AI_GEN_ERROR: ${error.message || 'Unknown failure'}`);
  }
};

/**
 * Tests the Gemini API connection by attempting to list models.
 * @param {string} apiKey - The API key to test.
 * @returns {Promise<{success: boolean, message: string, models?: any[]}>}
 */
export const testGeminiConnection = async (apiKey) => {
  if (!apiKey) return { success: false, message: 'MISSING_KEY' };
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (response.ok) {
      if (data.models && data.models.length > 0) {
        return { 
          success: true, 
          message: 'READY', 
          models: data.models.map(m => m.name.replace('models/', '')) 
        };
      }
      return { success: false, message: 'NO_MODELS_FOUND' };
    } else {
      if (response.status === 400) return { success: false, message: 'INVALID_KEY' };
      if (response.status === 403) return { success: false, message: 'API_NOT_ENABLED' };
      return { success: false, message: data.error?.message || 'UNKNOWN_ERROR' };
    }
  } catch (err) {
    return { success: false, message: 'NETWORK_ERROR' };
  }
};
