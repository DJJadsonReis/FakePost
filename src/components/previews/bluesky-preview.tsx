import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Repeat, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from './post-audio-player';

export function BlueSkyPreview({
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
    <Card className="w-full max-w-xl bg-card text-card-foreground font-sans p-4 border-0 sm:border">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
          <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
           <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-base hover:underline cursor-pointer">{profileName}</p>
                  <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-4 w-4" />
                  <span className="text-muted-foreground text-base ml-1">{username}</span>
                   <span className="text-muted-foreground text-base">· {timestamp}</span>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="whitespace-pre-wrap mt-1">{postContent}</div>
          <PostAudioPlayer postAudio={postAudio} />
          {postImage && (
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
               <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post"/>
            </div>
          )}
          <div className="flex justify-start gap-8 mt-3 text-muted-foreground">
             <Button variant="ghost" size="sm" className="flex items-center gap-2 -ml-3 hover:text-blue-500">
              <MessageCircle className="h-5 w-5" /> {comments.length}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 -ml-3 hover:text-green-500">
              <Repeat className="h-5 w-5" /> {reposts}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-2 -ml-3 hover:text-red-500">
              <Heart className={cn("h-5 w-5", isLiked && 'fill-red-500 text-red-500')} /> {likes}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
