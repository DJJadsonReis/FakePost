'use server';

/**
 * @fileOverview Generates realistic comments for a fake social media post using generative AI.
 *
 * - generateRealisticComments - A function to generate realistic comments for a fake post.
 * - GenerateRealisticCommentsInput - The input type for the generateRealisticComments function.
 * - GenerateRealisticCommentsOutput - The output type for the generateRealisticComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRealisticCommentsInputSchema = z.object({
  postContent: z.string().describe('The content of the fake social media post.'),
  numberOfComments: z.number().describe('The number of comments to generate.'),
  commenterProfiles: z.array(z.string()).optional().describe('Optional profiles of commenters to guide comment generation.'),
});
export type GenerateRealisticCommentsInput = z.infer<typeof GenerateRealisticCommentsInputSchema>;

const GenerateRealisticCommentsOutputSchema = z.object({
  comments: z.array(z.string()).describe('An array of generated comments.'),
});
export type GenerateRealisticCommentsOutput = z.infer<typeof GenerateRealisticCommentsOutputSchema>;

export async function generateRealisticComments(input: GenerateRealisticCommentsInput): Promise<GenerateRealisticCommentsOutput> {
  return generateRealisticCommentsFlow(input);
}

const generateCommentsPrompt = ai.definePrompt({
  name: 'generateCommentsPrompt',
  input: {schema: GenerateRealisticCommentsInputSchema},
  output: {schema: GenerateRealisticCommentsOutputSchema},
  prompt: `Você é um especialista em simulação de engajamento em redes sociais.

  Gere comentários realistas e variados para o seguinte post de rede social. Os comentários devem estar em português:

  Conteúdo do Post: {{{postContent}}}

  Número de Comentários a Gerar: {{{numberOfComments}}}

  {{#if commenterProfiles}}
  Considere estes perfis de comentaristas ao gerar os comentários:
  {{#each commenterProfiles}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Comentários:
  `,
});

const generateRealisticCommentsFlow = ai.defineFlow(
  {
    name: 'generateRealisticCommentsFlow',
    inputSchema: GenerateRealisticCommentsInputSchema,
    outputSchema: GenerateRealisticCommentsOutputSchema,
  },
  async input => {
    const {output} = await generateCommentsPrompt(input);
    return output!;
  }
);
