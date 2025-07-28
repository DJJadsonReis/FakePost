import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  MoreHorizontal,
  Dot,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { CommentComponent } from './comment-component';
import { PostAudioPlayer } from '../post-audio-player';

export function FakebookPreview({
  profileName,
  profilePic,
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
    <Card className="w-full max-w-xl font-sans transition-all duration-300 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePic} alt={profileName} />
          <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm">{profileName}</p>
            <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{timestamp}</span>
            <Dot/>
            <Globe className="h-3 w-3" />
          </div>
        </div>
        <MoreHorizontal className="ml-auto h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-2 text-sm">
        <p className="whitespace-pre-wrap">{postContent}</p>
        <PostAudioPlayer postAudio={postAudio} />
      </CardContent>
      {postImage && (
        <CardContent className="p-0">
           <Image src={postImage} alt="Post image" width={558} height={558} className="w-full h-auto" />
        </CardContent>
      )}
      <CardFooter className="flex flex-col items-start p-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground py-1 px-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-1">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 border-2 border-card"><ThumbsUp className="h-2.5 w-2.5 text-white" /></span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 border-2 border-card"><Heart className="h-2.5 w-2.5 text-white fill-white" /></span>
            </div>
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex gap-4">
            <span>{comments.length} Opiniões</span>
            <span>{shares.toLocaleString()} Propagações</span>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="grid grid-cols-3 w-full gap-1">
          <Button variant="ghost" className="text-muted-foreground font-semibold" onClick={handleLike}>
            <ThumbsUp className={cn("mr-2 h-5 w-5", isLiked && "text-blue-600 fill-blue-600")} /> Fingir
          </Button>
          <Button variant="ghost" className="text-muted-foreground font-semibold">
            <MessageCircle className="mr-2 h-5 w-5" /> Palpitar
          </Button>
          <Button variant="ghost" className="text-muted-foreground font-semibold">
            <Share2 className="mr-2 h-5 w-5" /> Propagar
          </Button>
        </div>
        {comments.length > 0 && <Separator className="my-1" />}
        <div className="w-full p-2 space-y-3">
          {comments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
