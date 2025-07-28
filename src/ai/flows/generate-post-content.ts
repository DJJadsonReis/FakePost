'use server';

/**
 * @fileOverview Generates social media post content using generative AI.
 *
 * - generatePostContent - A function to generate post content from a topic.
 * - GeneratePostContentInput - The input type for the generatePostContent function.
 * - GeneratePostContentOutput - The output type for the generatePostContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostContentInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
});
export type GeneratePostContentInput = z.infer<typeof GeneratePostContentInputSchema>;

const GeneratePostContentOutputSchema = z.object({
  postContent: z.string().describe('The generated social media post content.'),
});
export type GeneratePostContentOutput = z.infer<typeof GeneratePostContentOutputSchema>;

export async function generatePostContent(input: GeneratePostContentInput): Promise<GeneratePostContentOutput> {
  return generatePostContentFlow(input);
}

const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: {schema: GeneratePostContentInputSchema},
  output: {schema: GeneratePostContentOutputSchema},
  prompt: `Você é um especialista em marketing de redes sociais.

  Crie um post de rede social curto e envolvente sobre o seguinte tópico. O post deve estar em português e ser adequado para plataformas como Instagram, Facebook ou Twitter. Inclua hashtags relevantes.

  Tópico: {{{topic}}}
  `,
});

const generatePostContentFlow = ai.defineFlow(
  {
    name: 'generatePostContentFlow',
    inputSchema: GeneratePostContentInputSchema,
    outputSchema: GeneratePostContentOutputSchema,
  },
  async input => {
    const {output} = await generatePostPrompt(input);
    return output!;
  }
);
