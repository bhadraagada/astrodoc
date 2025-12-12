/**
 * Utility functions for interacting with the Gemini API
 */

export type TimelineChoice = 'do nothing' | 'seek medical attention' | 'self-medicate with over-the-counter remedies';

export type PathDay = {
  day: number;
  event: string;
};

export type SimulationPath = {
  id: string;
  title: string;
  description: string;
  days: PathDay[];
  riskScore: number;
  recoveryChance: number;
};

export type SimulationResult = {
  paths: SimulationPath[];
  recommendation: string;
  disclaimer: string;
};

/**
 * Generates medical simulation with streaming support
 * 
 * @param symptom The user's symptom description
 * @param onChunk Callback for each streamed chunk
 * @param signal AbortSignal to cancel the request
 * @param conversationHistory Previous messages for context
 * @param choices Array of choices to simulate different timelines
 * @returns The complete simulated timeline results
 */
export async function generateMedicalSimulationStream(
  symptom: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
  conversationHistory: Array<{content: string, isUser: boolean}> = [],
  choices: TimelineChoice[] = ['do nothing', 'seek medical attention', 'self-medicate with over-the-counter remedies']
): Promise<SimulationResult> {
  try {
    const response = await fetch('/api/test-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom,
        choices,
        stream: true,
        conversationHistory
      }),
      signal,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(chunk);
    }

    // Parse the complete response with better error handling
    try {
      // Remove markdown code blocks if present
      let cleanedText = fullText.trim();
      
      // Check if this looks like JSON (starts with { or [)
      const looksLikeJson = cleanedText.startsWith('{') || cleanedText.startsWith('[');
      
      if (looksLikeJson) {
        // Try to extract JSON from markdown code blocks
        const jsonBlockMatch = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
          cleanedText = jsonBlockMatch[1].trim();
        } else {
          // Try to find JSON object
          const jsonMatch = cleanedText.match(/{[\s\S]*}/);
          if (jsonMatch) {
            cleanedText = jsonMatch[0];
          }
        }
        
        // Remove any trailing commas before closing braces/brackets (common JSON error)
        cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
        
        // Try to parse as JSON
        const parsed = JSON.parse(cleanedText);
        return parsed;
      } else {
        // This is a plain text response (follow-up question)
        // Return it as-is, wrapped in a simple object
        return {
          type: 'text',
          content: fullText
        };
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw text received:', fullText);
      
      // If JSON parsing failed, treat it as plain text response
      return {
        type: 'text',
        content: fullText
      };
    }
  } catch (error) {
    console.error('Error in generateMedicalSimulationStream:', error);
    throw error;
  }
}

/**
 * Generates medical simulation based on the provided symptom description with abort capability
 * 
 * @param symptom The user's symptom description
 * @param signal AbortSignal to cancel the request
 * @param choices Array of choices to simulate different timelines
 * @returns The simulated timeline results from the API
 */
export async function generateMedicalSimulationWithAbort(
  symptom: string,
  signal?: AbortSignal,
  choices: TimelineChoice[] = ['do nothing', 'seek medical attention', 'self-medicate with over-the-counter remedies']
): Promise<SimulationResult> {
  try {
    const response = await fetch('/api/test-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom,
        choices,
        stream: false
      }),
      signal, // Pass the abort signal to fetch
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to generate simulations');
    }
  } catch (error) {
    console.error('Error in generateMedicalSimulation:', error);
    throw error;
  }
}

/**
 * Tests the Gemini API connection
 * @returns Test results from the API
 */
export async function testGeminiConnection() {
  try {
    const response = await fetch('/api/test-gemini');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to test API connection');
    }
  } catch (error) {
    console.error('Error in testGeminiConnection:', error);
    throw error;
  }
}