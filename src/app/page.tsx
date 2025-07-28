'use client';

import { useState, useTransition, useEffect } from 'react';
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
  BadgeCheck,
  Heart,
  Repeat,
  Send,
  MoreHorizontal,
  Dot,
  Sun,
  Moon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIGeneratedComments } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fakeCommenters = [
  { name: 'Joana Silva', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Alex Johnson', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Maria Garcia', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'Chen Wei', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
  { name: 'David Miller', pic: 'https://placehold.co/40x40.png' , hint: 'profile avatar'},
];

type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'threads' | 'bluesky';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Editor State
  const [profileName, setProfileName] = useState('Maria Silva');
  const [username, setUsername] = useState('@mariasilva');
  const [profilePic, setProfilePic] = useState('https://placehold.co/48x48.png');
  const [postContent, setPostContent] = useState(
    "Aproveitando um lindo dia no parque! É incrível como um pouco de sol pode mudar todo o seu humor. ☀️ #abençoada #amantedanatureza #boasvibrações"
  );
  const [postImage, setPostImage] = useState('https://placehold.co/600x400.png');
  const [timestamp, setTimestamp] = useState('2h');
  const [comments, setComments] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>('facebook');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Engagement State
  const [likes, setLikes] = useState(128);
  const [reposts, setReposts] = useState(42);
  const [shares, setShares] = useState(23);
  const [isLiked, setIsLiked] = useState(false);

  const handleGenerateComments = () => {
    startTransition(async () => {
      const result = await getAIGeneratedComments(postContent);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.error,
        });
      } else if (result.comments) {
        setComments(result.comments);
        toast({
          title: 'Sucesso!',
          description: 'Novos comentários foram gerados.',
        });
      }
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(l => isLiked ? l -1 : l + 1);
  };
  
  const commonEditorFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="profile-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Nome do Perfil</Label>
        <Input id="profile-name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
      </div>
      {['twitter', 'threads', 'bluesky'].includes(platform) && (
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">@ Nome de usuário</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch id="verified-switch" checked={isVerified} onCheckedChange={setIsVerified} />
        <Label htmlFor="verified-switch" className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Verificado</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-pic" className="flex items-center gap-2"><User className="w-4 h-4" /> URL da Foto de Perfil</Label>
        <Input id="profile-pic" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="post-content" className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Conteúdo do Post</Label>
        <Textarea id="post-content" value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} />
      </div>
       <div className="space-y-2">
          <Label htmlFor="post-image" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL da Imagem do Post</Label>
          <Input id="post-image" value={postImage} onChange={(e) => setPostImage(e.target.value)} />
        </div>
      <div className="space-y-2">
        <Label htmlFor="timestamp" className="flex items-center gap-2"><Clock className="w-4 h-4" /> Data e Hora</Label>
        <Input id="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="likes" className="flex items-center gap-2"><Heart className="w-4 h-4" /> Curtidas</Label>
          <Input id="likes" type="number" value={likes} onChange={(e) => setLikes(Number(e.target.value))} />
        </div>
        {platform === 'facebook' && (
          <div className="space-y-2">
            <Label htmlFor="shares" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Compartilhamentos</Label>
            <Input id="shares" type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} />
          </div>
        )}
        {(platform === 'twitter' || platform === 'bluesky') && (
            <div className="space-y-2">
              <Label htmlFor="reposts" className="flex items-center gap-2"><Repeat className="w-4 h-4" /> Reposts</Label>
              <Input id="reposts" type="number" value={reposts} onChange={(e) => setReposts(Number(e.target.value))} />
            </div>
        )}
      </div>
    </>
  );

  const renderFacebookPreview = () => (
    <Card className="w-full max-w-xl shadow-md transition-all duration-300 hover:shadow-xl font-sans">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
          <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm">{profileName}</p>
            {isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-current" />}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{timestamp}</span>
            <Dot/>
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2 text-sm">
        <p className="whitespace-pre-wrap">{postContent}</p>
      </CardContent>
      {postImage && (
        <CardContent className="p-0">
           <Image src={postImage} alt="Post image" width={558} height={558} className="w-full h-auto" data-ai-hint="social media post"/>
        </CardContent>
      )}
      <CardFooter className="flex flex-col items-start p-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground py-1 px-2">
          <span>{likes.toLocaleString()} Curtidas</span>
          <div className="flex gap-4">
            <span>{comments.length} Comentários</span>
            <span>{shares} Compartilhamentos</span>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="grid grid-cols-3 w-full gap-1">
          <Button variant="ghost" className="text-muted-foreground font-semibold" onClick={handleLike}>
            <ThumbsUp className={cn("mr-2 h-5 w-5", isLiked && "text-blue-600 fill-current")} /> Curtir
          </Button>
          <Button variant="ghost" className="text-muted-foreground font-semibold">
            <MessageCircle className="mr-2 h-5 w-5" /> Comentar
          </Button>
          <Button variant="ghost" className="text-muted-foreground font-semibold">
            <Share2 className="mr-2 h-5 w-5" /> Compartilhar
          </Button>
        </div>
        {comments.length > 0 && <Separator className="my-1" />}
        <div className="w-full p-2 space-y-3">
          {comments.map((comment, index) => {
            const commenter = fakeCommenters[index % fakeCommenters.length];
            return (
              <div key={index} className="flex items-start gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={commenter.pic} alt={commenter.name} data-ai-hint={commenter.hint} />
                  <AvatarFallback>{commenter.name.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-xl px-3 py-2">
                    <p className="font-bold text-xs text-card-foreground">{commenter.name}</p>
                    <p className="text-sm text-card-foreground">{comment}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardFooter>
    </Card>
  );
  
  const renderInstagramPreview = () => (
     <Card className="w-full max-w-md shadow-lg rounded-none sm:rounded-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                    <AvatarFallback>{profileName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm">{profileName}</p>
                   {isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-current" />}
                </div>
            </div>
            <MoreHorizontal className="h-5 w-5" />
        </CardHeader>

        {postImage && (
            <CardContent className="p-0">
                <Image
                    src={postImage}
                    alt="Post image"
                    width={480}
                    height={480}
                    className="w-full h-auto object-cover"
                    data-ai-hint="social media post"
                />
            </CardContent>
        )}
        
        <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-4">
                    <button onClick={handleLike} className="focus:outline-none">
                        <Heart className={cn("h-7 w-7", isLiked ? 'text-red-500 fill-current' : 'text-card-foreground')} />
                    </button>
                    <MessageCircle className="h-7 w-7" />
                    <Send className="h-7 w-7" />
                </div>
            </div>
            <p className="font-bold text-sm mb-2">{likes.toLocaleString()} curtidas</p>
            <p className="whitespace-pre-wrap text-sm">
                <span className="font-bold">{profileName}</span>
                {' '}
                {postContent}
            </p>
            {comments.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                    Ver todos os {comments.length} comentários
                </div>
            )}
            <p className="text-muted-foreground text-xs mt-2 uppercase">{timestamp}</p>
        </CardContent>
    </Card>
  );

  const renderTwitterPreview = () => (
    <Card className="w-full max-w-xl shadow-md transition-all duration-300 hover:shadow-xl font-sans bg-card text-card-foreground">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
            <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="font-bold">{profileName}</p>
                {isVerified && <BadgeCheck className="h-5 w-5 text-blue-500 fill-current" />}
                <p className="text-muted-foreground">{username}</p>
                <span className="text-muted-foreground">·</span>
                <p className="text-muted-foreground">{timestamp}</p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="whitespace-pre-wrap mt-1">{postContent}</p>
            {postImage && (
              <div className="mt-3 rounded-2xl border border-border overflow-hidden">
                <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post" />
              </div>
            )}
            <div className="flex justify-around mt-3 text-muted-foreground">
              <Button variant="ghost" className="flex items-center gap-2 hover:text-blue-500">
                <MessageCircle className="h-5 w-5" /> {comments.length}
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 hover:text-green-500">
                <Repeat className="h-5 w-5" /> {reposts}
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 hover:text-red-500" onClick={handleLike}>
                <Heart className={cn("h-5 w-5", isLiked && 'fill-red-500 text-red-500')} /> {likes}
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderThreadsPreview = () => (
    <Card className="w-full max-w-xl shadow-md transition-all duration-300 hover:shadow-xl font-sans bg-card text-card-foreground">
        <CardContent className="p-4">
            <div className="flex flex-col">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                            <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1">
                            <p className="font-bold">{profileName}</p>
                            {isVerified && <BadgeCheck className="h-5 w-5 text-blue-500 fill-current" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{timestamp}</span>
                        <MoreHorizontal className="h-5 w-5" />
                    </div>
                </div>

                <div className="ml-[60px] -mt-5">
                    <p className="whitespace-pre-wrap mt-1">{postContent}</p>
                    {postImage && (
                        <div className="mt-3 rounded-2xl border border-border overflow-hidden">
                           <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post"/>
                        </div>
                    )}
                    <div className="flex gap-4 mt-3 text-muted-foreground">
                        <button onClick={handleLike} className="focus:outline-none"><Heart className={cn("h-6 w-6", isLiked ? 'text-red-500 fill-current' : 'text-card-foreground')} /></button>
                        <MessageCircle className="h-6 w-6" />
                        <Repeat className="h-6 w-6" />
                        <Send className="h-6 w-6" />
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <span>{comments.length} respostas</span>
                        <Dot />
                        <span>{likes.toLocaleString()} curtidas</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );

  const renderBlueSkyPreview = () => (
    <Card className="w-full max-w-xl shadow-md transition-all duration-300 hover:shadow-xl font-sans bg-card text-card-foreground">
      <CardContent className="p-4 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
            <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  <p className="font-bold">{profileName}</p>
                   {isVerified && <BadgeCheck className="h-5 w-5 text-blue-500 fill-current" />}
                  <p className="text-muted-foreground">{username}</p>
                  <span className="text-muted-foreground">·</span>
                  <p className="text-muted-foreground">{timestamp}</p>
                </div>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="whitespace-pre-wrap mt-1">{postContent}</p>
            {postImage && (
              <div className="mt-3 rounded-lg border border-border overflow-hidden">
                 <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post"/>
              </div>
            )}
            <div className="flex justify-between mt-3 text-muted-foreground max-w-xs">
              <Button variant="ghost" className="flex items-center gap-1 hover:text-blue-500 px-2">
                <MessageCircle className="h-4 w-4" /> {comments.length}
              </Button>
              <Button variant="ghost" className="flex items-center gap-1 hover:text-green-500 px-2">
                <Repeat className="h-4 w-4" /> {reposts}
              </Button>
              <Button variant="ghost" className="flex items-center gap-1 hover:text-red-500 px-2" onClick={handleLike}>
                <Heart className={cn("h-4 w-4", isLiked && 'fill-red-500 text-red-500')} /> {likes}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreview = () => {
    switch (platform) {
      case 'facebook': return renderFacebookPreview();
      case 'instagram': return renderInstagramPreview();
      case 'twitter': return renderTwitterPreview();
      case 'threads': return renderThreadsPreview();
      case 'bluesky': return renderBlueSkyPreview();
      default: return null;
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8 relative">
            <div className='text-center'>
              <div className="inline-flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                  FakePost
                </h1>
              </div>
              <p className="text-muted-foreground mt-2 text-lg">
                Crie e personalize seu post de rede social falso perfeito.
              </p>
            </div>
             <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="absolute top-0 right-0 rounded-full"
                aria-label="Toggle theme"
              >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
        </header>

        <main className="grid md:grid-cols-5 gap-8">
          {/* Editor Column */}
          <div className="md:col-span-2">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle>Editor de Post</CardTitle>
                <CardDescription>
                  Selecione a plataforma e modifique os detalhes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={platform} onValueChange={(value) => setPlatform(value as SocialPlatform)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto">
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="threads">Threads</TabsTrigger>
                    <TabsTrigger value="bluesky">Blue Sky</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="facebook" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="instagram" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="twitter" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="threads" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="bluesky" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleGenerateComments} disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : 'Gerar Comentários com IA'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Preview Column */}
          <div className="md:col-span-3">
            <div className="flex flex-col items-center">
              {renderPreview()}
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-12 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Desenvolvido por{' '}
            <a
              href="https://www.instagram.com/djjadsonreis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              Jadson Reis
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
