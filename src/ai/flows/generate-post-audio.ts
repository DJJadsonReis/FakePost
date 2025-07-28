'use server';

/**
 * @fileOverview Generates post audio from text using generative AI (Text-to-Speech).
 *
 * - generatePostAudio - A function to generate post audio.
 * - GeneratePostAudioInput - The input type for the generatePostAudio function.
 * - GeneratePostAudioOutput - The output type for the generatePostAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GeneratePostAudioInputSchema = z.object({
  text: z.string().describe('The text content to convert to speech.'),
});
export type GeneratePostAudioInput = z.infer<typeof GeneratePostAudioInputSchema>;

const GeneratePostAudioOutputSchema = z.object({
  audioDataUri: z.string().describe("The data URI of the generated audio file in WAV format. Format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GeneratePostAudioOutput = z.infer<typeof GeneratePostAudioOutputSchema>;

export async function generatePostAudio(input: GeneratePostAudioInput): Promise<GeneratePostAudioOutput> {
  return generatePostAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const generatePostAudioFlow = ai.defineFlow(
  {
    name: 'generatePostAudioFlow',
    inputSchema: GeneratePostAudioInputSchema,
    outputSchema: GeneratePostAudioOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('Audio generation failed: no media returned.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);
    const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

    return { audioDataUri };
  }
);
