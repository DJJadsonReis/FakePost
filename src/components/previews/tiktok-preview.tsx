import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from '../post-audio-player';

export function TikTokPreview({
  profileName,
  username,
  postContent,
  postVideo,
  postAudio,
  timestamp,
  isVerified,
  verifiedColor,
  likes,
  shares,
  comments,
  isLiked,
  handleLike,
}: PreviewProps) {
  return (
    <div className="w-[300px] h-[550px] bg-black rounded-3xl shadow-lg relative overflow-hidden font-sans">
        {postVideo ? (
          <video
            src={postVideo}
            autoPlay
            loop
            muted // Muted by default for autoplay
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          postImage && <Image src={postImage} alt="Post background" layout="fill" objectFit="cover" className="opacity-50" />
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-center text-white">
            <p className="font-semibold mr-4">Seguindo</p>
            <p className="font-bold border-b-2 border-white pb-1">Para Você</p>
        </div>
        
        <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-4 text-white">
            <button onClick={handleLike} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className={cn("h-7 w-7", isLiked ? 'text-red-500 fill-red-500' : 'text-white')} />
                </div>
                <span className="text-sm font-semibold mt-1">{likes.toLocaleString()}</span>
            </button>
            <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold mt-1">{comments.length.toLocaleString()}</span>
            </button>
            <button className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Share2 className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold mt-1">{shares.toLocaleString()}</span>
            </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="font-bold">{username}</p>
            <p className="whitespace-pre-wrap mt-2 text-sm">{postContent}</p>
             <PostAudioPlayer postAudio={postAudio} />
        </div>
    </div>
  );
}
