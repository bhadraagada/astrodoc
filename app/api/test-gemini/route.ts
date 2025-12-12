import { NextResponse } from 'next/server';
import { testGeminiAPI, generateHealthTimelines, generateHealthTimelinesStream, debugGeminiAPI } from '@/lib/gemini';

export async function GET() {
  try {
    const testResult = await testGeminiAPI();
    
    return NextResponse.json({
      status: 'success',
      data: testResult
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptom, choices, stream = true, conversationHistory = [] } = body;
    
    if (!symptom) {
      return NextResponse.json({
        status: 'error',
        message: 'Symptom description is required'
      }, { status: 400 });
    }
    
    // Use streaming by default
    if (stream) {
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of generateHealthTimelinesStream(symptom, conversationHistory, choices)) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }
    
    // Fallback to non-streaming
    const timelines = await generateHealthTimelines(symptom, choices);
    
    return NextResponse.json({
      status: 'success',
      data: timelines
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}