import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  MessageCircle,
  Repeat,
  Heart,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from '../post-audio-player';

export function TwitterPreview({
  profileName,
  username,
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
          <Avatar className="h-12 w-12">
            <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
            <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold">{profileName}</p>
                  <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-5 w-5" />
                </div>
                <p className="text-muted-foreground">{username}</p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="whitespace-pre-wrap mt-2">{postContent}</div>
            <PostAudioPlayer postAudio={postAudio} />
            {postImage && (
              <div className="mt-3 rounded-2xl border border-border overflow-hidden">
                <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post" />
              </div>
            )}
             <p className="text-muted-foreground text-sm mt-3">{timestamp}</p>
            <Separator className="my-3" />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-card-foreground">{reposts}</span> Reposts
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-card-foreground">{likes}</span> Curtidas
                </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-around text-muted-foreground">
              <Button variant="ghost" className="flex-1 flex items-center gap-2 hover:text-blue-500">
                <MessageCircle className="h-5 w-5" /> {comments.length > 0 && <span>{comments.length}</span>}
              </Button>
              <Button variant="ghost" className="flex-1 flex items-center gap-2 hover:text-green-500">
                <Repeat className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="flex-1 flex items-center gap-2 hover:text-red-500" onClick={handleLike}>
                <Heart className={cn("h-5 w-5", isLiked && 'fill-red-500 text-red-500')} />
              </Button>
              <Button variant="ghost" className="flex-1 flex items-center gap-2 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
