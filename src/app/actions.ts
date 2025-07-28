'use server';

import { generateRealisticComments } from '@/ai/flows/generate-comments';

export async function getAIGeneratedComments(
  postContent: string
): Promise<{ comments?: string[]; error?: string }> {
  if (!postContent) {
    return { error: 'Post content cannot be empty.' };
  }

  try {
    const result = await generateRealisticComments({
      postContent,
      numberOfComments: 5,
      commenterProfiles: [
        'A supportive friend',
        'A curious stranger',
        'Someone who relates to the post',
        'A funny person trying to make a joke',
        'An expert on the topic',
      ],
    });
    return { comments: result.comments };
  } catch (error) {
    console.error('Error generating comments:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
