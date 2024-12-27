import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant that provides alternatives to popular services. You will be given a subscription name and you will provide alternatives to that subscription.',
    messages,
  });

  return result.toDataStreamResponse();
}