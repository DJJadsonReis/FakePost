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
  Repeat,
  Send,
  Globe,
  MoreHorizontal,
  Dot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewProps } from './preview-props';
import { VerifiedBadge } from './verified-badge';
import { PostAudioPlayer } from './post-audio-player';

export function LinkedInPreview({
  profileName,
  profilePic,
  postContent,
  postImage,
  postAudio,
  timestamp,
  isVerified,
  verifiedColor,
  likes,
  recommendations,
  comments,
  isLiked,
  handleLike,
}: PreviewProps) {
  return (
    <Card className="w-full max-w-xl font-sans bg-card text-card-foreground border-0 sm:border">
        <CardHeader className="flex flex-row items-start gap-3 p-4">
            <Avatar className="h-14 w-14">
                <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <p className="font-bold">{profileName}</p>
                    <VerifiedBadge isVerified={isVerified} verifiedColor={verifiedColor} className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground">Engenheiro de Software | IA & Desenvolvimento Web</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{timestamp}</span>
                    <Dot/>
                    <Globe className="h-3 w-3" />
                </div>
            </div>
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-2 text-sm">
            <p className="whitespace-pre-wrap">{postContent}</p>
            <PostAudioPlayer postAudio={postAudio} />
        </CardContent>
        {postImage && (
            <CardContent className="p-0">
                <Image src={postImage} alt="Post image" width={558} height={350} className="w-full h-auto object-cover" data-ai-hint="social media post"/>
            </CardContent>
        )}
        <CardFooter className="flex flex-col items-start p-2">
            <div className="flex justify-between w-full text-xs text-muted-foreground py-1 px-3">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 border-2 border-card"><ThumbsUp className="h-2.5 w-2.5 text-white" /></span>
                    <span>{likes.toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                    <span>{comments.length} comentários</span>
                    <span>{recommendations.toLocaleString()} recomendações</span>
                </div>
            </div>
            <Separator className="my-1 bg-border/50" />
            <div className="grid grid-cols-4 w-full gap-1">
                <Button variant="ghost" className="text-muted-foreground font-semibold text-sm" onClick={handleLike}>
                    <ThumbsUp className={cn("mr-2 h-5 w-5", isLiked && "text-blue-600 fill-blue-600")} /> Gostei
                </Button>
                <Button variant="ghost" className="text-muted-foreground font-semibold text-sm">
                    <MessageCircle className="mr-2 h-5 w-5" /> Comentar
                </Button>
                <Button variant="ghost" className="text-muted-foreground font-semibold text-sm">
                    <Repeat className="mr-2 h-5 w-5" /> Recomendar
                </Button>
                <Button variant="ghost" className="text-muted-foreground font-semibold text-sm">
                    <Send className="mr-2 h-5 w-5" /> Enviar
                </Button>
            </div>
        </CardFooter>
    </Card>
  );
}
