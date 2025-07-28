'use server';

/**
 * @fileOverview Generates a post video using generative AI (Veo).
 * 
 * - generatePostVideo - A function to generate a post video from a text prompt.
 * - GeneratePostVideoInput - The input type for the generatePostVideo function.
 * - GeneratePostVideoOutput - The output type for the generatePostVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GeneratePostVideoInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired post video.'),
});
export type GeneratePostVideoInput = z.infer<typeof GeneratePostVideoInputSchema>;

const GeneratePostVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GeneratePostVideoOutput = z.infer<typeof GeneratePostVideoOutputSchema>;

export async function generatePostVideo(input: GeneratePostVideoInput): Promise<GeneratePostVideoOutput> {
  return generatePostVideoFlow(input);
}

const generatePostVideoFlow = ai.defineFlow(
  {
    name: 'generatePostVideoFlow',
    inputSchema: GeneratePostVideoInputSchema,
    outputSchema: GeneratePostVideoOutputSchema,
  },
  async ({ prompt }) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: `A dynamic, engaging, vertical video for a social media post about: ${prompt}`,
        config: {
          durationSeconds: 5,
          aspectRatio: '9:16',
        },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait for the operation to complete
    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
    }
    
    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType?.startsWith('video/'));

    if (!videoPart || !videoPart.media) {
        throw new Error('Failed to find the generated video in the operation result.');
    }
    
    // The video URL from Veo is temporary and needs to be fetched and converted to a data URI
    // For simplicity in this context, we assume the user's environment can handle this.
    // In a real app, you would fetch the URL and convert to Base64.
    // Let's assume for now we can get a direct data URI, or handle the URL on the client.
    // The `media.url` from Veo is a signed URL, not a data URI.
    // We'll proceed as if it's usable, but a real implementation would need a fetch and Base64 conversion step.
    // This is a placeholder for the fetch logic.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok) {
        throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }
    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const videoUrl = `data:${videoPart.media.contentType};base64,${videoBase64}`;

    return { videoUrl };
  }
);
