'use server';

/**
 * @fileOverview Generates all the text content for a random social media post.
 *
 * - generateRandomPost - A function to generate random post details.
 * - GenerateRandomPostOutput - The output type for the generateRandomPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const topics = [
    'uma nova receita de bolo de chocolate',
    'dicas para uma viagem para a Itália',
    'o lançamento de um novo smartphone',
    'um dia produtivo de home office',
    'um livro de ficção científica que acabei de ler',
    'a importância de cuidar da saúde mental',
    'um projeto de "faça você mesmo" para o final de semana',
    'minha opinião sobre o último filme de super-herói',
    'um treino rápido para fazer em casa',
    'a beleza do pôr do sol na praia'
];

const GenerateRandomPostOutputSchema = z.object({
    profileName: z.string().describe("The full name for a fictional social media user."),
    username: z.string().describe("The username (starting with @) for the fictional user."),
    profilePicPrompt: z.string().describe("A 1-2 word hint for generating a profile picture, e.g., 'homem sorrindo', 'mulher de óculos'."),
    postContent: z.string().describe("The generated social media post content based on the random topic, including relevant hashtags."),
    postMediaPrompt: z.string().describe("A prompt for an AI image/video generator that is relevant to the post content."),
});
export type GenerateRandomPostOutput = z.infer<typeof GenerateRandomPostOutputSchema>;

export async function generateRandomPost(): Promise<GenerateRandomPostOutput> {
  return generateRandomPostFlow();
}

const generateRandomPostPrompt = ai.definePrompt({
  name: 'generateRandomPostPrompt',
  output: {schema: GenerateRandomPostOutputSchema},
  prompt: `Você é um especialista em marketing de redes sociais e criação de personas.

    Sua tarefa é gerar os detalhes textuais para um post de rede social completamente novo e aleatório com base em um tópico sorteado.

    O tópico para hoje é: "${topics[Math.floor(Math.random() * topics.length)]}"

    Por favor, gere o seguinte, em português:
    1.  Um nome completo realista para um usuário fictício.
    2.  Um nome de usuário para esse usuário, começando com @.
    3.  Uma dica de 1-2 palavras para a foto de perfil (ex: 'homem sorrindo', 'mulher de óculos').
    4.  Um conteúdo de post curto e envolvente sobre o tópico, incluindo hashtags relevantes.
    5.  Um prompt para um gerador de imagem/vídeo de IA que seja visualmente atraente e relevante para o conteúdo do post.
  `,
});

const generateRandomPostFlow = ai.defineFlow(
  {
    name: 'generateRandomPostFlow',
    outputSchema: GenerateRandomPostOutputSchema,
  },
  async () => {
    const {output} = await generateRandomPostPrompt();
    return output!;
  }
);
