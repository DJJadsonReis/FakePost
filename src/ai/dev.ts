'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-comments.ts';
import '@/ai/flows/generate-profile-pic.ts';
import '@/ai/flows/generate-post-content.ts';
import '@/ai/flows/generate-post-image.ts';
import '@/ai/flows/generate-post-audio.ts';
import '@/ai/flows/generate-post-video.ts';
import '@/ai/flows/generate-random-post.ts';
