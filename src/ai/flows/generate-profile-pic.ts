'use server';

/**
 * @fileOverview Generates a profile picture using generative AI.
 * 
 * - generateProfilePic - A function to generate a profile picture from a text prompt.
 * - GenerateProfilePicInput - The input type for the generateProfilePic function.
 * - GenerateProfilePicOutput - The output type for the generateProfilePic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfilePicInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired profile picture. e.g., "smiling man", "woman with glasses".'),
});
export type GenerateProfilePicInput = z.infer<typeof GenerateProfilePicInputSchema>;

const GenerateProfilePicOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateProfilePicOutput = z.infer<typeof GenerateProfilePicOutputSchema>;

export async function generateProfilePic(input: GenerateProfilePicInput): Promise<GenerateProfilePicOutput> {
  return generateProfilePicFlow(input);
}

const generateProfilePicFlow = ai.defineFlow(
  {
    name: 'generateProfilePicFlow',
    inputSchema: GenerateProfilePicInputSchema,
    outputSchema: GenerateProfilePicOutputSchema,
  },
  async ({ prompt }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `photorealistic profile picture of a ${prompt}, 400x400`,
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
