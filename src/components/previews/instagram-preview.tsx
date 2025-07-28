import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from '../post-audio-player';

export function InstagramPreview({
  username,
  profilePic,
  postContent,
  postImage,
  postAudio,
  timestamp,
  isVerified,
  verifiedColor,
  likes,
  comments,
  isLiked,
  handleLike,
}: PreviewProps) {
  return (
     <Card className="w-full max-w-md rounded-none sm:rounded-lg bg-card text-card-foreground border-0 sm:border">
        <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={profilePic} alt={username} />
                    <AvatarFallback>{username.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm">{username}</p>
                   <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-4 w-4" />
                </div>
            </div>
            <MoreHorizontal className="h-5 w-5" />
        </CardHeader>

        {postImage && (
            <CardContent className="p-0">
                <Image
                    src={postImage || 'https://placehold.co/480x480.png'}
                    alt="Post image"
                    width={480}
                    height={480}
                    className="w-full h-auto object-cover"
                />
            </CardContent>
        )}
        
        <CardFooter className="p-3 flex-col items-start">
            <div className="flex justify-between items-center mb-2 w-full">
                <div className="flex gap-4">
                    <button onClick={handleLike} className="focus:outline-none">
                        <Heart className={cn("h-7 w-7", isLiked ? 'text-red-500 fill-red-500' : 'text-card-foreground')} />
                    </button>
                    <MessageCircle className="h-7 w-7" />
                    <Send className="h-7 w-7" />
                </div>
            </div>
            <p className="font-bold text-sm mb-2">{likes.toLocaleString()} curtidas</p>
            <div className="space-y-1 w-full">
              <div className="whitespace-pre-wrap text-sm">
                  <span className="font-bold">{username}</span>
                  {' '}
                  {postContent}
              </div>
              <PostAudioPlayer postAudio={postAudio} />
              {comments.length > 0 && (
                  <button className="text-sm text-muted-foreground mt-2">
                      Ver todos os {comments.length} comentários
                  </button>
              )}
            </div>
            <button className="text-muted-foreground text-xs mt-2 uppercase">{timestamp}</button>
        </CardFooter>
    </Card>
  );
}
