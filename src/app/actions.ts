'use server';

import { GenerateRealisticCommentsOutput, generateRealisticComments } from '@/ai/flows/generate-comments';

export async function getAIGeneratedComments(
  postContent: string
): Promise<{ comments?: GenerateRealisticCommentsOutput['comments']; error?: string }> {
  if (!postContent) {
    return { error: 'O conteúdo do post não pode estar vazio.' };
  }

  try {
    const result = await generateRealisticComments({
      postContent,
      numberOfComments: 5,
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
