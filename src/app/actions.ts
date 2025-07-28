'use server';

import { GenerateRealisticCommentsOutput, generateRealisticComments } from '@/ai/flows/generate-comments';
import { generatePostContent } from '@/ai/flows/generate-post-content';
import { generateProfilePic } from '@/ai/flows/generate-profile-pic';

export async function getAIGeneratedComments(
  postContent: string,
  numberOfComments: number
): Promise<{ comments?: GenerateRealisticCommentsOutput['comments']; error?: string }> {
  if (!postContent) {
    return { error: 'O conteúdo do post não pode estar vazio.' };
  }
  if (numberOfComments <= 0) {
    return { error: 'O número de comentários deve ser maior que zero.'}
  }

  try {
    const result = await generateRealisticComments({
      postContent,
      numberOfComments,
      commenterProfiles: [
        'Um amigo apoiador',
        'Um estranho curioso',
        'Alguém que se identifica com o post',
        'Uma pessoa engraçada tentando fazer uma piada',
        'Um especialista no assunto',
      ],
    });
    return { comments: result.comments };
  } catch (error) {
    console.error('Error generating comments:', error);
    return { error: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' };
  }
}

export async function getAIGeneratedProfilePic(
  prompt: string
): Promise<{ imageUrl?: string; error?: string }> {
    if (!prompt) {
        return { error: 'A descrição da imagem não pode estar vazia.' };
    }

    try {
        const result = await generateProfilePic({ prompt });
        return { imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error generating profile picture:', error);
        return { error: 'Ocorreu um erro inesperado ao gerar a imagem. Por favor, tente novamente mais tarde.' };
    }
}

export async function getAIGeneratedPostContent(
  topic: string
): Promise<{ postContent?: string; error?: string }> {
  if (!topic) {
    return { error: 'O tópico não pode estar vazio.' };
  }

  try {
    const result = await generatePostContent({ topic });
    return { postContent: result.postContent };
  } catch (error) {
    console.error('Error generating post content:', error);
    return { error: 'Ocorreu um erro inesperado ao gerar o conteúdo. Por favor, tente novamente mais tarde.' };
  }
}
