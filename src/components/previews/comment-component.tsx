import type { Comment, ReplyWithPic } from '@/app/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CommentComponent({ comment }: { comment: Comment | ReplyWithPic }) {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.profilePicUrl || 'https://placehold.co/40x40.png'} alt={comment.name} />
        <AvatarFallback>{comment.name.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-xl px-3 py-2">
          <p className="font-bold text-xs text-card-foreground">{comment.name}</p>
          <p className="text-sm text-card-foreground">{comment.comment}</p>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground px-2 pt-1">
          <button className="font-semibold hover:underline">Curtir</button>
          <button className="font-semibold hover:underline">Responder</button>
        </div>

        {'replies' in comment && comment.replies && comment.replies.length > 0 && (
          <div className="pt-2 space-y-3">
            {comment.replies.map((reply, index) => (
              <CommentComponent key={index} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
