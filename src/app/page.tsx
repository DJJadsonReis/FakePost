'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  Loader2,
  Image as ImageIcon,
  User,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIGeneratedComments } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const fakeCommenters = [
  { name: 'Jane Smith', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Alex Johnson', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Maria Garcia', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Chen Wei', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'David Miller', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
];

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Post State
  const [profileName, setProfileName] = useState('Jane Doe');
  const [profilePic, setProfilePic] = useState('https://placehold.co/48x48.png');
  const [postContent, setPostContent] = useState(
    "Just enjoying a beautiful day at the park! It's amazing how a little bit of sunshine can change your whole mood. ☀️ #blessed #naturelover #goodvibes"
  );
  const [postImage, setPostImage] = useState('https://placehold.co/600x400.png');
  const [timestamp, setTimestamp] = useState('2 hours ago');
  const [comments, setComments] = useState<string[]>([]);
  
  // Engagement State
  const [likes, setLikes] = useState(128);
  const [isLiked, setIsLiked] = useState(false);
  const [shares] = useState(23);

  const handleGenerateComments = () => {
    startTransition(async () => {
      const result = await getAIGeneratedComments(postContent);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result.comments) {
        setComments(result.comments);
        toast({
          title: 'Success!',
          description: 'New comments have been generated.',
        });
      }
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="w-full min-h-full bg-background transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
                <MessageSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Fakebook
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">
            Create and customize your perfect fake social media post.
          </p>
        </header>

        <main className="grid md:grid-cols-5 gap-8">
          {/* Editor Column */}
          <div className="md:col-span-2">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle>Post Editor</CardTitle>
                <CardDescription>
                  Modify the details of your post below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Profile Name</Label>
                  <Input id="profile-name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-pic" className="flex items-center gap-2"><User className="w-4 h-4" /> Profile Picture URL</Label>
                  <Input id="profile-pic" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-content" className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Post Content</Label>
                  <Textarea id="post-content" value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-image" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Post Image URL</Label>
                  <Input id="post-image" value={postImage} onChange={(e) => setPostImage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timestamp" className="flex items-center gap-2"><Clock className="w-4 h-4" /> Timestamp</Label>
                  <Input id="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleGenerateComments} disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : 'Generate AI Comments'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Preview Column */}
          <div className="md:col-span-3">
            <div className="flex flex-col items-center">
              <Card className="w-full max-w-xl shadow-md transition-all duration-300 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/50">
                    <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                    <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <p className="font-bold text-base">{profileName}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{timestamp}</span>
                      <span>·</span>
                      <Globe className="h-3 w-3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <p className="whitespace-pre-wrap">{postContent}</p>
                </CardContent>
                {postImage && (
                  <CardContent className="p-0">
                     <Image
                        src={postImage}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                        data-ai-hint="social media post"
                      />
                  </CardContent>
                )}
                <CardFooter className="flex flex-col items-start p-2">
                  <div className="flex justify-between w-full text-sm text-muted-foreground py-1 px-2">
                    <span>{likes.toLocaleString()} Likes</span>
                    <div className="flex gap-4">
                      <span>{comments.length} Comments</span>
                      <span>{shares} Shares</span>
                    </div>
                  </div>
                  <Separator className="my-1" />
                  <div className="grid grid-cols-3 w-full gap-1">
                    <Button variant="ghost" className="text-muted-foreground font-semibold" onClick={handleLike}>
                      <ThumbsUp className={cn("mr-2 h-5 w-5", isLiked && "text-primary fill-primary/20")} /> Like
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground font-semibold">
                      <MessageCircle className="mr-2 h-5 w-5" /> Comment
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground font-semibold">
                      <Share2 className="mr-2 h-5 w-5" /> Share
                    </Button>
                  </div>
                  {comments.length > 0 && <Separator className="my-1" />}
                  <div className="w-full p-2 space-y-4">
                    {comments.map((comment, index) => {
                      const commenter = fakeCommenters[index % fakeCommenters.length];
                      return (
                        <div key={index} className="flex items-start gap-2.5">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={commenter.pic} alt={commenter.name} data-ai-hint={commenter.hint} />
                            <AvatarFallback>{commenter.name.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-secondary rounded-xl px-3 py-2">
                              <p className="font-bold text-sm">{commenter.name}</p>
                              <p className="text-sm">{comment}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
