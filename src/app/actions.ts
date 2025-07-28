'use server';

import { GenerateRealisticCommentsOutput, generateRealisticComments } from '@/ai/flows/generate-comments';
import { generatePostAudio } from '@/ai/flows/generate-post-audio';
import { generatePostContent } from '@/ai/flows/generate-post-content';
import { generatePostImage } from '@/ai/flows/generate-image';
import { generateProfilePic } from '@/ai/flows/generate-profile-pic';
import { generatePostVideo } from '@/ai/flows/generate-video';
import { generateRandomPost } from '@/ai/flows/generate-random-post';

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

export async function getAIGeneratedPostImage(
  prompt: string
): Promise<{ imageUrl?: string; error?: string }> {
    if (!prompt) {
        return { error: 'A descrição da imagem não pode estar vazia.' };
    }

    try {
        const result = await generatePostImage({ prompt });
        return { imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error generating post image:', error);
        return { error: 'Ocorreu um erro inesperado ao gerar a imagem. Por favor, tente novamente mais tarde.' };
    }
}

export async function getAIGeneratedPostVideo(
  prompt: string
): Promise<{ videoUrl?: string; error?: string }> {
    if (!prompt) {
        return { error: 'A descrição do vídeo não pode estar vazia.' };
    }

    try {
        const result = await generatePostVideo({ prompt });
        return { videoUrl: result.videoUrl };
    } catch (error) {
        console.error('Error generating post video:', error);
        return { error: 'Ocorreu um erro inesperado ao gerar o vídeo. Por favor, tente novamente mais tarde.' };
    }
}


export async function getAIGeneratedPostAudio(
  text: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text) {
    return { error: 'O texto para gerar o áudio não pode estar vazio.' };
  }

  try {
    const result = await generatePostAudio({ text });
    return { audioDataUri: result.audioDataUri };
  } catch (error) {
    console.error('Error generating post audio:', error);
    return { error: 'Ocorreu um erro inesperado ao gerar o áudio. Por favor, tente novamente mais tarde.' };
  }
}


export async function getAIGeneratedRandomPost(isTikTok: boolean): Promise<{
    post?: {
        profileName: string;
        username: string;
        profilePicPrompt: string;
        postContent: string;
        postMediaPrompt: string;
        profilePicUrl?: string;
        postImageUrl?: string;
        postVideoUrl?: string;
    },
    comments?: GenerateRealisticCommentsOutput['comments'];
    error?: string;
}> {
    try {
        // 1. Generate all text content
        const textResult = await generateRandomPost();
        
        // 2. Start generating images/video in parallel
        const profilePicPromise = getAIGeneratedProfilePic(textResult.profilePicPrompt);
        const postMediaPromise = isTikTok 
            ? getAIGeneratedPostVideo(textResult.postMediaPrompt)
            : getAIGeneratedPostImage(textResult.postMediaPrompt);

        // 3. Start generating comments
        const commentsPromise = getAIGeneratedComments(textResult.postContent, 5);
        
        // 4. Await all promises
        const [profilePicResult, postMediaResult, commentsResult] = await Promise.all([
            profilePicPromise,
            postMediaPromise,
            commentsPromise
        ]);

        if (profilePicResult.error || postMediaResult.error || commentsResult.error) {
             const error = profilePicResult.error || postMediaResult.error || commentsResult.error;
             console.error('Error in random generation sub-task:', error);
             return { error: `Ocorreu um erro durante a geração aleatória: ${error}` };
        }

        return {
            post: {
                ...textResult,
                profilePicUrl: profilePicResult.imageUrl,
                postImageUrl: (postMediaResult as any).imageUrl,
                postVideoUrl: (postMediaResult as any).videoUrl,
            },
            comments: commentsResult.comments,
        };

    } catch (error) {
        console.error('Error generating random post:', error);
        return { error: 'Ocorreu um erro inesperado ao gerar o post aleatório. Por favor, tente novamente.' };
    }
}
