'use server';

/**
 * @fileOverview Generates a post image using generative AI.
 * 
 * - generatePostImage - A function to generate a post image from a text prompt.
 * - GeneratePostImageInput - The input type for the generatePostImage function.
 * - GeneratePostImageOutput - The output type for the generatePostImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostImageInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired post image.'),
});
export type GeneratePostImageInput = z.infer<typeof GeneratePostImageInputSchema>;

const GeneratePostImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GeneratePostImageOutput = z.infer<typeof GeneratePostImageOutputSchema>;

export async function generatePostImage(input: GeneratePostImageInput): Promise<GeneratePostImageOutput> {
  return generatePostImageFlow(input);
}

const generatePostImageFlow = ai.defineFlow(
  {
    name: 'generatePostImageFlow',
    inputSchema: GeneratePostImageInputSchema,
    outputSchema: GeneratePostImageOutputSchema,
  },
  async ({ prompt }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A high-quality, realistic image for a social media post about: ${prompt}, 600x400`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl };
  }
);
