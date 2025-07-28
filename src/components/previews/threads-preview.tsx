import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Repeat, Heart, Send, MoreHorizontal, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from '../post-audio-player';

export function ThreadsPreview({
  profileName,
  profilePic,
  postContent,
  postImage,
  postAudio,
  timestamp,
  isVerified,
  verifiedColor,
  likes,
  reposts,
  comments,
  isLiked,
  handleLike,
}: PreviewProps) {
  return (
    <Card className="w-full max-w-xl font-sans bg-card text-card-foreground rounded-none sm:rounded-lg border-0 sm:border">
        <CardContent className="p-4">
            <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={profilePic} alt={profileName} />
                        <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {comments.length > 0 && <div className="w-0.5 grow bg-border my-2"></div>}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1">
                            <p className="font-bold">{profileName}</p>
                            <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{timestamp}</span>
                            <MoreHorizontal className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="whitespace-pre-wrap mt-1">{postContent}</div>
                    <PostAudioPlayer postAudio={postAudio} />
                    {postImage && (
                        <div className="mt-3 rounded-2xl border border-border overflow-hidden">
                           <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" />
                        </div>
                    )}
                    <div className="flex gap-4 mt-3 text-muted-foreground">
                        <button onClick={handleLike} className="focus:outline-none"><Heart className={cn("h-6 w-6", isLiked ? 'text-red-500 fill-red-500' : 'text-card-foreground')} /></button>
                        <MessageCircle className="h-6 w-6" />
                        <Repeat className="h-6 w-6" />
                        <Send className="h-6 w-6" />
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <span>{reposts} respostas</span>
                        <Dot />
                        <span>{likes.toLocaleString()} curtidas</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
