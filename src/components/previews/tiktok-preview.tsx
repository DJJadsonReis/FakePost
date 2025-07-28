import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Share2,
  Music,
  Dot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';

export function TikTokPreview({
  profileName,
  username,
  postContent,
  postImage,
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
        {postImage && (
            <Image src={postImage} alt="TikTok video background" layout="fill" objectFit="cover" className="opacity-70" data-ai-hint="tiktok video"/>
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
            <div className="flex items-center gap-2">
                 <p className="font-bold">{username}</p>
                 {isVerified && <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-4 w-4" />}
                 <Dot />
                 <p className="font-semibold text-sm">{timestamp}</p>
            </div>
            <p className="whitespace-pre-wrap mt-2 text-sm">{postContent}</p>
             <div className="flex items-center gap-2 mt-2">
                { postAudio ? (
                    <audio src={postAudio} controls className="w-full h-8 opacity-80" />
                ) : (
                    <>
                        <Music className="h-4 w-4" />
                        <p className="text-sm font-medium truncate">som original - {profileName}</p>
                    </>
                )}
            </div>
        </div>
    </div>
  );
}
