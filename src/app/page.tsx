'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
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
  Download,
  X,
  Linkedin,
  Sparkles,
  Music,
  FileText,
  Save,
  FolderOpen,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIGeneratedComments, getAIGeneratedPostContent, getAIGeneratedProfilePic } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateRealisticCommentsOutput } from '@/ai/flows/generate-comments';

type Comment = GenerateRealisticCommentsOutput['comments'][0] & { profilePicUrl?: string; replies?: Reply[] };
type Reply = NonNullable<GenerateRealisticCommentsOutput['comments'][0]['replies']>[0] & { profilePicUrl?: string };


type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'threads' | 'bluesky' | 'linkedin' | 'tiktok';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [isGeneratingProfilePic, startProfilePicTransition] = useTransition();
  const [isGeneratingPost, startPostGenerationTransition] = useTransition();

  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  // Editor State
  const [profileName, setProfileName] = useState('Maria Silva');
  const [username, setUsername] = useState('@mariasilva');
  const [profilePic, setProfilePic] = useState('https://placehold.co/48x48.png');
  const [profilePicPrompt, setProfilePicPrompt] = useState('mulher sorrindo');
  const [postTopic, setPostTopic] = useState('um lindo dia no parque');
  const [postContent, setPostContent] = useState(
    "Aproveitando um lindo dia no parque! É incrível como um pouco de sol pode mudar todo o seu humor. ☀️ #abençoada #amantedanatureza #boasvibrações"
  );
  const [postImage, setPostImage] = useState('https://placehold.co/600x400.png');
  const [timestamp, setTimestamp] = useState('2h');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isVerified, setIsVerified] = useState(true);
  const [verifiedColor, setVerifiedColor] = useState('#1DA1F2');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDownloading, setIsDownloading] = useState(false);

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
  const [recommendations, setRecommendations] = useState(78);
  const [isLiked, setIsLiked] = useState(false);

  const generateProfilePictures = (commentsToProcess: Comment[]) => {
      commentsToProcess.forEach((comment, index) => {
        // Generate profile pic for the main comment
        startProfilePicTransition(async () => {
          const picResult = await getAIGeneratedProfilePic(comment.profilePicHint);
          if (picResult.imageUrl) {
            setComments(prevComments => {
              const newComments = [...prevComments];
              const targetComment = newComments.find(c => c.comment === comment.comment && c.name === comment.name);
              if (targetComment) {
                targetComment.profilePicUrl = picResult.imageUrl;
              }
              return newComments;
            });
          }
        });

        // Generate profile pics for replies
        if (comment.replies) {
          comment.replies.forEach((reply, replyIndex) => {
             startProfilePicTransition(async () => {
                const replyPicResult = await getAIGeneratedProfilePic(reply.profilePicHint);
                if (replyPicResult.imageUrl) {
                   setComments(prevComments => {
                        const newComments = [...prevComments];
                        const targetComment = newComments.find(c => c.comment === comment.comment && c.name === comment.name);
                        if (targetComment && targetComment.replies) {
                           const targetReply = targetComment.replies.find(r => r.comment === reply.comment && r.name === reply.name);
                           if (targetReply) {
                                targetReply.profilePicUrl = replyPicResult.imageUrl;
                           }
                        }
                        return newComments;
                   });
                }
             });
          });
        }
    });
  };

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
        const newComments = result.comments as Comment[];
        setComments(newComments);
        toast({
          title: 'Sucesso!',
          description: 'Novos comentários foram gerados. Gerando fotos de perfil...',
        });
        generateProfilePictures(newComments);
      }
    });
  };
  
  const handleGenerateProfilePic = () => {
    startProfilePicTransition(async () => {
      const result = await getAIGeneratedProfilePic(profilePicPrompt);
       if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.error,
        });
      } else if (result.imageUrl) {
        setProfilePic(result.imageUrl);
        toast({
          title: 'Sucesso!',
          description: 'Nova foto de perfil foi gerada.',
        });
      }
    });
  };

  const handleGeneratePostContent = () => {
    startPostGenerationTransition(async () => {
      const result = await getAIGeneratedPostContent(postTopic);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: result.error,
        });
      } else if (result.postContent) {
        setPostContent(result.postContent);
        toast({
          title: 'Sucesso!',
          description: 'Novo conteúdo de post foi gerado.',
        });
      }
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(l => isLiked ? l -1 : l + 1);
  };
  
  const handleDownloadImage = useCallback(() => {
    if (previewRef.current === null) {
      return;
    }
    setIsDownloading(true);

    htmlToImage.toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `fakepost-${platform}.png`;
        link.href = dataUrl;
        link.click();
        setIsDownloading(false);
         toast({
          title: 'Download Iniciado!',
          description: 'Seu post está sendo baixado como uma imagem.',
        });
      })
      .catch((err) => {
        console.error(err);
        setIsDownloading(false);
        toast({
          variant: 'destructive',
          title: 'Erro no Download',
          description: 'Não foi possível baixar a imagem. Tente novamente.',
        });
      });
  }, [platform, toast]);

  const handleSaveTemplate = () => {
    const template = {
      profileName,
      username,
      profilePic,
      profilePicPrompt,
      postTopic,
      postContent,
      postImage,
      timestamp,
      isVerified,
      verifiedColor,
      likes,
      reposts,
      shares,
      recommendations,
    };
    localStorage.setItem('fakePostTemplate', JSON.stringify(template));
    toast({
      title: 'Modelo Salvo!',
      description: 'Suas configurações atuais foram salvas no navegador.',
    });
  };

  const handleLoadTemplate = () => {
    const savedTemplate = localStorage.getItem('fakePostTemplate');
    if (savedTemplate) {
      const template = JSON.parse(savedTemplate);
      setProfileName(template.profileName || 'Maria Silva');
      setUsername(template.username || '@mariasilva');
      setProfilePic(template.profilePic || 'https://placehold.co/48x48.png');
      setProfilePicPrompt(template.profilePicPrompt || 'mulher sorrindo');
      setPostTopic(template.postTopic || 'um lindo dia no parque');
      setPostContent(template.postContent || "Aproveitando um lindo dia no parque! É incrível como um pouco de sol pode mudar todo o seu humor. ☀️ #abençoada #amantedanatureza #boasvibrações");
      setPostImage(template.postImage || 'https://placehold.co/600x400.png');
      setTimestamp(template.timestamp || '2h');
      setIsVerified(template.isVerified !== undefined ? template.isVerified : true);
      setVerifiedColor(template.verifiedColor || '#1DA1F2');
      setLikes(template.likes || 128);
      setReposts(template.reposts || 42);
      setShares(template.shares || 23);
      setRecommendations(template.recommendations || 78);
      toast({
        title: 'Modelo Carregado!',
        description: 'As configurações salvas foram aplicadas.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Nenhum Modelo Encontrado',
        description: 'Não há nenhum modelo salvo no seu navegador.',
      });
    }
  };


  const commonEditorFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="profile-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Nome do Perfil</Label>
        <Input id="profile-name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
      </div>
      {['twitter', 'threads', 'bluesky', 'tiktok', 'instagram'].includes(platform) && (
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
          <Label htmlFor="verified-color" className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Cor do Selo de Verificado</Label>
          <div className="relative">
            <Input id="verified-color" type="color" value={verifiedColor} onChange={(e) => setVerifiedColor(e.target.value)} className="p-1 h-10 w-full" />
          </div>
        </div>
      <div className="space-y-2">
        <Label htmlFor="profile-pic" className="flex items-center gap-2"><User className="w-4 h-4" /> URL da Foto de Perfil</Label>
        <Input id="profile-pic" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} placeholder="Cole uma URL ou gere com IA"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-pic-prompt" className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gerar Foto de Perfil com IA</Label>
        <div className="flex items-center gap-2">
          <Input id="profile-pic-prompt" value={profilePicPrompt} onChange={(e) => setProfilePicPrompt(e.target.value)} placeholder="Ex: homem sorrindo"/>
          <Button variant="outline" size="icon" onClick={handleGenerateProfilePic} disabled={isGeneratingProfilePic} aria-label="Gerar foto com IA">
            {isGeneratingProfilePic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="post-topic" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Tópico para o Post (IA)</Label>
        <Input id="post-topic" value={postTopic} onChange={(e) => setPostTopic(e.target.value)} placeholder="Sobre o que deve ser o post?"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="post-content" className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Conteúdo do Post</Label>
        <div className="flex items-start gap-2">
            <Textarea id="post-content" value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} className="flex-1"/>
             <Button variant="outline" size="icon" onClick={handleGeneratePostContent} disabled={isGeneratingPost} aria-label="Gerar conteúdo do post" className="h-auto">
                {isGeneratingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="post-image" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL da Imagem do Post</Label>
        <div className="flex items-center gap-2">
          <Input id="post-image" value={postImage} onChange={(e) => setPostImage(e.target.value)} placeholder="Cole uma URL de imagem aqui"/>
          <Button variant="ghost" size="icon" onClick={() => setPostImage('')} aria-label="Remover imagem" className="h-9 w-9">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Deixe em branco para não ter imagem.</p>
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
        {(platform === 'facebook' || platform === 'tiktok') && (
          <div className="space-y-2">
            <Label htmlFor="shares" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Compartilhamentos</Label>
            <Input id="shares" type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} />
          </div>
        )}
        {(platform === 'twitter' || platform === 'threads' || platform === 'bluesky') && (
            <div className="space-y-2">
              <Label htmlFor="reposts" className="flex items-center gap-2"><Repeat className="w-4 h-4" /> Reposts</Label>
              <Input id="reposts" type="number" value={reposts} onChange={(e) => setReposts(Number(e.target.value))} />
            </div>
        )}
        {platform === 'linkedin' && (
          <div className="space-y-2">
            <Label htmlFor="recommendations" className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> Recomendações</Label>
            <Input id="recommendations" type="number" value={recommendations} onChange={(e) => setRecommendations(Number(e.target.value))} />
          </div>
        )}
      </div>
    </>
  );
  
  const VerifiedBadge = ({className}: {className?: string}) => (
    isVerified && <BadgeCheck className={cn("text-white", className)} style={{ fill: verifiedColor, color: 'white' }}/>
  );
  
  const CommentComponent = ({ comment }: { comment: Comment | Reply }) => (
    <div className="flex items-start gap-2.5">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.profilePicUrl || 'https://placehold.co/40x40.png'} alt={comment.name} data-ai-hint={comment.profilePicHint} />
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

  const renderFacebookPreview = () => (
    <Card className="w-full max-w-xl font-sans transition-all duration-300 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
          <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm">{profileName}</p>
            <VerifiedBadge className="h-4 w-4" />
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
      </CardContent>
      {postImage && (
        <CardContent className="p-0">
           <Image src={postImage} alt="Post image" width={558} height={558} className="w-full h-auto" data-ai-hint="social media post"/>
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
            <span>{comments.length} Comentários</span>
            <span>{shares.toLocaleString()} Compartilhamentos</span>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="grid grid-cols-3 w-full gap-1">
          <Button variant="ghost" className="text-muted-foreground font-semibold" onClick={handleLike}>
            <ThumbsUp className={cn("mr-2 h-5 w-5", isLiked && "text-blue-600 fill-blue-600")} /> Curtir
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
          {comments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
  
  const renderInstagramPreview = () => (
     <Card className="w-full max-w-md rounded-none sm:rounded-lg bg-card text-card-foreground border-0 sm:border">
        <CardHeader className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={profilePic} alt={username} data-ai-hint="profile avatar" />
                    <AvatarFallback>{username.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm">{username}</p>
                   <VerifiedBadge className="h-4 w-4" />
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
                    data-ai-hint="social media post"
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
              <p className="whitespace-pre-wrap text-sm">
                  <span className="font-bold">{username}</span>
                  {' '}
                  {postContent}
              </p>
              {comments.length > 0 && (
                  <button className="text-sm text-muted-foreground">
                      Ver todos os {comments.length} comentários
                  </button>
              )}
            </div>
            <button className="text-muted-foreground text-xs mt-2 uppercase">{timestamp}</button>
        </CardFooter>
    </Card>
  );

  const renderTwitterPreview = () => (
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
                  <VerifiedBadge className="h-5 w-5" />
                </div>
                <p className="text-muted-foreground">{username}</p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="whitespace-pre-wrap mt-2">{postContent}</p>
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

  const renderThreadsPreview = () => (
    <Card className="w-full max-w-xl font-sans bg-card text-card-foreground rounded-none sm:rounded-lg border-0 sm:border">
        <CardContent className="p-4">
            <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                        <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {comments.length > 0 && <div className="w-0.5 grow bg-border my-2"></div>}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1">
                            <p className="font-bold">{profileName}</p>
                            <VerifiedBadge className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{timestamp}</span>
                            <MoreHorizontal className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="whitespace-pre-wrap mt-1">{postContent}</p>
                    {postImage && (
                        <div className="mt-3 rounded-2xl border border-border overflow-hidden">
                           <Image src={postImage} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post"/>
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

  const renderBlueSkyPreview = () => (
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
                  <VerifiedBadge className="h-4 w-4" />
                  <span className="text-muted-foreground text-base ml-1">{username}</span>
                   <span className="text-muted-foreground text-base">· {timestamp}</span>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="whitespace-pre-wrap mt-1">{postContent}</p>
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

  const renderLinkedInPreview = () => (
    <Card className="w-full max-w-xl font-sans bg-card text-card-foreground border-0 sm:border">
        <CardHeader className="flex flex-row items-start gap-3 p-4">
            <Avatar className="h-14 w-14">
                <AvatarImage src={profilePic} alt={profileName} data-ai-hint="profile avatar" />
                <AvatarFallback>{profileName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <p className="font-bold">{profileName}</p>
                    <VerifiedBadge className="h-4 w-4" />
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

const renderTikTokPreview = () => (
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
                 {isVerified && <BadgeCheck className="h-4 w-4" style={{ fill: verifiedColor, color: 'white' }} />}
                 <Dot />
                 <p className="font-semibold text-sm">{timestamp}</p>
            </div>
            <p className="whitespace-pre-wrap mt-2 text-sm">{postContent}</p>
             <div className="flex items-center gap-2 mt-2">
                <Music className="h-4 w-4" />
                <p className="text-sm font-medium truncate">som original - {profileName}</p>
            </div>
        </div>
    </div>
);


  const renderPreview = () => {
    switch (platform) {
      case 'facebook': return renderFacebookPreview();
      case 'instagram': return renderInstagramPreview();
      case 'twitter': return renderTwitterPreview();
      case 'threads': return renderThreadsPreview();
      case 'bluesky': return renderBlueSkyPreview();
      case 'linkedin': return renderLinkedInPreview();
      case 'tiktok': return renderTikTokPreview();
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
                 <div className="flex gap-2">
                  <Button onClick={handleSaveTemplate} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Modelo
                  </Button>
                  <Button onClick={handleLoadTemplate} variant="outline" className="w-full">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Carregar Modelo
                  </Button>
                </div>
                <Separator/>
                <Tabs value={platform} onValueChange={(value) => setPlatform(value as SocialPlatform)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 h-auto">
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="threads">Threads</TabsTrigger>
                    <TabsTrigger value="bluesky">Blue Sky</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="facebook" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="instagram" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="twitter" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="threads" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="bluesky" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="linkedin" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
                  <TabsContent value="tiktok" className="mt-6 space-y-6">{commonEditorFields}</TabsContent>
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
            <div className="flex flex-col items-center gap-4">
              <div ref={previewRef} className="w-full flex justify-center p-4 bg-muted/50 rounded-lg">
                {renderPreview()}
              </div>
              <Button onClick={handleDownloadImage} disabled={isDownloading} className="w-full max-w-xl">
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Baixando...
                    </>
                  ) : (
                    <>
                     <Download className="mr-2 h-4 w-4" />
                      Baixar Post
                    </>
                  )}
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-16 py-6 border-t border-border/50">
           <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            Feito com <Heart className={cn("w-4 h-4 fill-current", theme === 'light' ? 'text-red-500' : 'text-white')} /> por
            <a
              href="https://www.instagram.com/djjadsonreis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Jadson Reis
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Este site foi criado para fins educacionais e não possui fins lucrativos.
          </p>
        </footer>
      </div>
    </div>
  );
}
