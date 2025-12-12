import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY!);

// Safety settings for medical content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

export async function generateHealthTimelines(
  symptom: string,
  choices: string[] = ["do nothing", "seek professional help", "self-medicate"]
) {
  try {
    if (!API_KEY || API_KEY === "your-api-key-here") {
      console.error("API key not configured properly");
      return {
        error:
          "API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.",
        details: "Configuration Error",
      };
    }
    // Try multiple models as fallback (newest to oldest, most efficient first)
    const models = [
      "gemini-2.5-flash",      // Best price-performance, stable
      "gemini-2.5-flash-lite", // Ultra fast, cost-efficient
      "gemini-2.5-pro",        // Advanced thinking model, stable
      "gemini-2.0-flash",      // Previous generation fallback
    ];
    let lastError: any = null;
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          safetySettings,
        });
        
        return await generateWithRetry(model, symptom);
      } catch (error: any) {
        console.warn(`Model ${modelName} failed:`, error?.message);
        lastError = error;
        // If it's a quota error, try the next model
        if (error?.message?.includes("quota") || error?.message?.includes("429")) {
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError;
  } catch (error) {
    console.error("Error generating health timelines:", error);
    return {
      error: "Failed to generate timelines. Please try again later.",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function generateWithRetry(model: any, symptom: string, maxRetries = 2) {
  let lastError: any = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const prompt = `
    You are a medical simulation AI that generates possible future outcomes based on a person's symptoms and potential decisions.

    ---

    **SYMPTOM DESCRIPTION:**  
    "${symptom}"

    ---

    Your task:

    1. Based on the complexity and ambiguity of the symptom described, generate **between 5 to 6 unique decision paths** a patient might realistically consider. Do not always assume 3. Simple symptoms might yield 2–3 paths, complex ones up to 7.
    2. Each decision path must describe a clearly distinct action the patient could take (e.g., doing nothing, visiting a clinic, self-medicating, consulting a friend, trying alternative therapy, etc.).
    3. For each path, simulate a 7-day progression (Days 1 through 7). Include:
       - Daily symptom progression
       - Complications or improvements
       - Impact on daily life or mental health
    4. Assign two metrics per path:
       - **Risk percentage** (0–100): how dangerous this path is
       - **Recovery percentage** (0–100): likelihood of improvement or full recovery by Day 7

    After generating all paths, identify **which path (if any)** leads to the best health outcome.

    ---

    CRITICAL: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
    
    Rules for valid JSON:
    - Use double quotes for all strings
    - NO trailing commas
    - NO comments in JSON
    - Escape any quotes within strings with backslash
    - riskPercentage and recoveryPercentage must be numbers (0-100)
    - pathIndex must be a number or null

    {
      "timelines": [
        {
          "path": "Short title",
          "action": "Full sentence describing the decision",
          "days": [
            {"day": 1, "description": "Day 1 progression"},
            {"day": 2, "description": "Day 2 progression"},
            {"day": 3, "description": "Day 3 progression"},
            {"day": 4, "description": "Day 4 progression"},
            {"day": 5, "description": "Day 5 progression"},
            {"day": 6, "description": "Day 6 progression"},
            {"day": 7, "description": "Day 7 progression"}
          ],
          "riskPercentage": 50,
          "recoveryPercentage": 70
        }
      ],
      "bestPath": {
        "pathIndex": 0,
        "explanation": "Brief explanation"
      },
      "disclaimer": "This is a fictional simulation generated by an AI for educational and awareness purposes only. It is not medical advice. Always consult a licensed medical professional for real-life concerns."
    }
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    const jsonData = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

      try {
        return JSON.parse(jsonData);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        console.log("Raw response:", text);
        return {
          error: "Failed to parse timeline data",
          rawResponse: text,
        };
      }
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error?.message);
      
      // If it's not a rate limit error, don't retry
      if (!error?.message?.includes("429") && !error?.message?.includes("quota")) {
        throw error;
      }
    }
  }
  
  // All retries exhausted
  throw lastError;
}

// Test function to verify API integration
export async function testGeminiAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      "Hello, can you confirm this API test is working?"
    );
    const response = await result.response;
    return {
      success: true,
      message: response.text(),
    };
  } catch (error) {
    console.error("Gemini API test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Streaming version for real-time responses
export async function* generateHealthTimelinesStream(
  symptom: string,
  conversationHistory: Array<{content: string, isUser: boolean}> = [],
  choices: string[] = ["do nothing", "seek professional help", "self-medicate"]
) {
  if (!API_KEY || API_KEY === "your-api-key-here") {
    yield JSON.stringify({
      error: "API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.",
      details: "Configuration Error",
    });
    return;
  }

  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
  ];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings,
      });

      // Build conversation context
      let conversationContext = "";
      if (conversationHistory.length > 0) {
        conversationContext = "\n\n**PREVIOUS CONVERSATION:**\n";
        conversationHistory.forEach((msg, idx) => {
          if (idx > 0) { // Skip the initial greeting
            conversationContext += `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}\n`;
          }
        });
        conversationContext += "\n---\n";
      }

      const prompt = `
    You are AstroDoc, a medical simulation AI assistant that generates possible future outcomes based on a person's symptoms and potential decisions.
    
    ${conversationContext}
    
    **CURRENT USER MESSAGE:**  
    "${symptom}"
    
    ---
    
    INSTRUCTIONS:
    
    If this is a follow-up question or clarification about a previous analysis:
    - Reference the previous conversation context
    - Provide specific answers to their follow-up
    - Update or clarify previous recommendations if needed
    - Keep the response conversational and helpful
    - DO NOT generate a full timeline analysis again unless explicitly requested
    
    If this is a NEW symptom or health concern that requires timeline analysis:
    1. Based on the complexity and ambiguity of the symptom described, generate **between 5 to 6 unique decision paths** a patient might realistically consider. Do not always assume 3. Simple symptoms might yield 2–3 paths, complex ones up to 7.
    2. Each decision path must describe a clearly distinct action the patient could take (e.g., doing nothing, visiting a clinic, self-medicating, consulting a friend, trying alternative therapy, etc.).
    3. For each path, simulate a 7-day progression (Days 1 through 7). Include:
       - Daily symptom progression
       - Complications or improvements
       - Impact on daily life or mental health
    4. Assign two metrics per path:
       - **Risk percentage** (0–100): how dangerous this path is
       - **Recovery percentage** (0–100): likelihood of improvement or full recovery by Day 7

    After generating all paths, identify **which path (if any)** leads to the best health outcome.

    ---

    RESPONSE FORMAT:
    
    For follow-up questions: Respond naturally in plain text (no JSON needed).
    
    For NEW symptom timeline analysis: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
    
    Rules for valid JSON:
    - Use double quotes for all strings
    - NO trailing commas
    - NO comments in JSON
    - Escape any quotes within strings with backslash
    - riskPercentage and recoveryPercentage must be numbers (0-100)
    - pathIndex must be a number or null

    {
      "timelines": [
        {
          "path": "Short title",
          "action": "Full sentence describing the decision",
          "days": [
            {"day": 1, "description": "Day 1 progression"},
            {"day": 2, "description": "Day 2 progression"},
            {"day": 3, "description": "Day 3 progression"},
            {"day": 4, "description": "Day 4 progression"},
            {"day": 5, "description": "Day 5 progression"},
            {"day": 6, "description": "Day 6 progression"},
            {"day": 7, "description": "Day 7 progression"}
          ],
          "riskPercentage": 50,
          "recoveryPercentage": 70
        }
      ],
      "bestPath": {
        "pathIndex": 0,
        "explanation": "Brief explanation"
      },
      "disclaimer": "This is a fictional simulation generated by an AI for educational and awareness purposes only. It is not medical advice. Always consult a licensed medical professional for real-life concerns."
    }
        `;

      const result = await model.generateContentStream(prompt);
      
      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        yield chunkText;
      }

      // Stream complete - no need to parse here, client will handle
      return;
      
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error?.message);
      if (!error?.message?.includes("quota") && !error?.message?.includes("429")) {
        yield JSON.stringify({
          error: "Failed to generate timelines. Please try again later.",
          details: error.message,
        });
        return;
      }
    }
  }

  yield JSON.stringify({
    error: "All models exceeded quota. Please try again later.",
    details: "Rate limit exceeded",
  });
}

// Add this function at the end of the file
export async function debugGeminiAPI() {
  try {
    // Check if API key is set
    if (!API_KEY || API_KEY === "your-api-key-here") {
      return {
        success: false,
        error: "API key not configured properly",
        details:
          "Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables",
      };
    }

    // Try to create model instance (will fail if API key is invalid)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Simple test prompt
    const result = await model.generateContent(
      "Reply with only the word 'SUCCESS' if you can see this message."
    );

    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
      apiKeyConfigured: API_KEY !== "your-api-key-here",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: JSON.stringify(error, null, 2),
    };
  }
}
