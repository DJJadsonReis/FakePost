'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
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
  MessageCircle,
  Share2,
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
  Users,
  AudioLines,
  Smile,
  FileImage,
  BarChart,
  Video,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIGeneratedComments, getAIGeneratedPostContent, getAIGeneratedProfilePic, getAIGeneratedPostImage, getAIGeneratedPostAudio, getAIGeneratedPostVideo } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GenerateRealisticCommentsOutput } from '@/ai/flows/generate-comments';

import { FacebookPreview } from '@/components/previews/facebook-preview';
import { InstagramPreview } from '@/components/previews/instagram-preview';
import { TwitterPreview } from '@/components/previews/twitter-preview';
import { ThreadsPreview } from '@/components/previews/threads-preview';
import { BlueSkyPreview } from '@/components/previews/bluesky-preview';
import { LinkedInPreview } from '@/components/previews/linkedin-preview';
import { TikTokPreview } from '@/components/previews/tiktok-preview';
import { cn } from '@/lib/utils';
import { Accordion } from '@/components/ui/accordion';
import { EditorSection } from '@/components/editor-section';

export type Comment = GenerateRealisticCommentsOutput['comments'][0] & { profilePicUrl?: string; replies?: Reply[] };
export type Reply = NonNullable<GenerateRealisticCommentsOutput['comments'][0]['replies']>[0] & { profilePicUrl?: string };
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'threads' | 'bluesky' | 'linkedin' | 'tiktok';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState({
    postContent: false,
    postMedia: false, // Unified state for image/video
    postAudio: false,
    profilePic: false,
    comments: false,
  });
  const [isPending, startTransition] = useTransition();


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
  const [postVideo, setPostVideo] = useState('');
  const [postMediaPrompt, setPostMediaPrompt] = useState('um lindo dia no parque com sol');
  const [postAudio, setPostAudio] = useState('');
  const [timestamp, setTimestamp] = useState('2h');
  const [comments, setComments] = useState<Comment[]>([]);
  const [numberOfComments, setNumberOfComments] = useState(5);
  const [isVerified, setIsVerified] = useState(true);
  const [verifiedColor, setVerifiedColor] = useState('#1DA1F2');
  const [platform, setPlatform] = useState<SocialPlatform>('tiktok');
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
        startTransition(async () => {
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
             startTransition(async () => {
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
    setIsGenerating(prev => ({ ...prev, comments: true }));
    startTransition(async () => {
      try {
        const result = await getAIGeneratedComments(postContent, numberOfComments);
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
      } finally {
        setIsGenerating(prev => ({ ...prev, comments: false }));
      }
    });
  };
  
  const handleGenerateProfilePic = () => {
     setIsGenerating(prev => ({ ...prev, profilePic: true }));
    startTransition(async () => {
      try {
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
      } finally {
        setIsGenerating(prev => ({ ...prev, profilePic: false }));
      }
    });
  };

  const handleGeneratePostContent = () => {
    setIsGenerating(prev => ({ ...prev, postContent: true }));
    startTransition(async () => {
      try {
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
      } finally {
        setIsGenerating(prev => ({ ...prev, postContent: false }));
      }
    });
  };

  const handleGeneratePostMedia = () => {
    setIsGenerating(prev => ({ ...prev, postMedia: true }));
    startTransition(async () => {
      try {
        if (platform === 'tiktok') {
            const result = await getAIGeneratedPostVideo(postMediaPrompt);
            if (result.error) {
                toast({ variant: 'destructive', title: 'Erro na Geração de Vídeo', description: result.error });
            } else if (result.videoUrl) {
                setPostVideo(result.videoUrl);
                setPostImage(''); // Clear image when video is generated
                toast({ title: 'Sucesso!', description: 'Novo vídeo de post foi gerado.' });
            }
        } else {
            const result = await getAIGeneratedPostImage(postMediaPrompt);
            if (result.error) {
                toast({ variant: 'destructive', title: 'Erro na Geração de Imagem', description: result.error });
            } else if (result.imageUrl) {
                setPostImage(result.imageUrl);
                setPostVideo(''); // Clear video when image is generated
                toast({ title: 'Sucesso!', description: 'Nova imagem de post foi gerada.' });
            }
        }
      } finally {
        setIsGenerating(prev => ({ ...prev, postMedia: false }));
      }
    });
  };

  const handleGeneratePostAudio = () => {
    setIsGenerating(prev => ({ ...prev, postAudio: true }));
    startTransition(async () => {
      try {
        const result = await getAIGeneratedPostAudio(postContent);
        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: result.error,
          });
        } else if (result.audioDataUri) {
          setPostAudio(result.audioDataUri);
          toast({
            title: 'Sucesso!',
            description: 'O áudio do post foi gerado.',
          });
        }
      } finally {
        setIsGenerating(prev => ({ ...prev, postAudio: false }));
      }
    });
  }


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
      postVideo,
      postMediaPrompt,
      postAudio,
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
      setPostVideo(template.postVideo || '');
      setPostMediaPrompt(template.postMediaPrompt || 'um lindo dia no parque com sol');
      setPostAudio(template.postAudio || '');
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


  const editorContent = (
    <Accordion type="multiple" defaultValue={['profile', 'content']} className="w-full">
      <EditorSection
        title="Perfil"
        description="Informações do usuário e aparência."
        icon={<Smile className="w-4 h-4" />}
        id="profile"
      >
        <div className="space-y-4">
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
           <div className="flex items-center space-x-2 pt-2">
                <Switch id="verified-switch" checked={isVerified} onCheckedChange={setIsVerified} />
                <Label htmlFor="verified-switch" className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Verificado</Label>
            </div>
            {isVerified && (
                <div className="space-y-2">
                <Label htmlFor="verified-color" className="flex items-center gap-2">Cor do Selo</Label>
                <Input id="verified-color" type="color" value={verifiedColor} onChange={(e) => setVerifiedColor(e.target.value)} className="p-1 h-10 w-full" />
                </div>
            )}
           <div className="space-y-2">
            <Label htmlFor="profile-pic" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL da Foto de Perfil</Label>
            <Input id="profile-pic" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} placeholder="Cole uma URL ou gere com IA"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-pic-prompt" className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gerar Foto com IA</Label>
            <div className="flex items-center gap-2">
              <Input id="profile-pic-prompt" value={profilePicPrompt} onChange={(e) => setProfilePicPrompt(e.target.value)} placeholder="Ex: homem sorrindo"/>
              <Button variant="outline" size="icon" onClick={handleGenerateProfilePic} disabled={isGenerating.profilePic} aria-label="Gerar foto com IA">
                {isGenerating.profilePic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        title="Conteúdo do Post"
        description="Texto, mídia e áudio da publicação."
        icon={<FileText className="w-4 h-4" />}
        id="content"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-topic" className="flex items-center gap-2">Tópico para o Post (IA)</Label>
            <Input id="post-topic" value={postTopic} onChange={(e) => setPostTopic(e.target.value)} placeholder="Sobre o que deve ser o post?"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-content" className="flex items-center gap-2">Conteúdo do Post</Label>
            <div className="flex items-start gap-2">
                <Textarea id="post-content" value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} className="flex-1"/>
                <Button variant="outline" size="icon" onClick={handleGeneratePostContent} disabled={isGenerating.postContent} aria-label="Gerar conteúdo do post" className="h-auto">
                    {isGenerating.postContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><AudioLines className="w-4 h-4" /> Áudio do Post (TTS)</Label>
            <div className="flex items-center gap-2">
              <Button onClick={handleGeneratePostAudio} disabled={isGenerating.postAudio} className="w-full" variant="outline">
                {isGenerating.postAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Gerar Áudio com IA
              </Button>
              {postAudio && (
                <Button variant="ghost" size="icon" onClick={() => setPostAudio('')} aria-label="Remover áudio">
                    <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          { platform !== 'tiktok' && (
            <div className="space-y-2">
                <Label htmlFor="post-image" className="flex items-center gap-2"><FileImage className="w-4 h-4" /> URL da Imagem do Post</Label>
                <div className="flex items-center gap-2">
                <Input id="post-image" value={postImage} onChange={(e) => setPostImage(e.target.value)} placeholder="Cole uma URL de imagem aqui"/>
                <Button variant="ghost" size="icon" onClick={() => {setPostImage(''); setPostVideo('');}} aria-label="Remover imagem" className="h-9 w-9">
                    <X className="h-4 w-4" />
                </Button>
                </div>
            </div>
          )}
          <div className="space-y-2">
             <Label htmlFor="post-media-prompt" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Gerar {platform === 'tiktok' ? 'Vídeo' : 'Imagem'} com IA
            </Label>
            <div className="flex items-center gap-2">
              <Input id="post-media-prompt" value={postMediaPrompt} onChange={(e) => setPostMediaPrompt(e.target.value)} placeholder={platform === 'tiktok' ? "Ex: um drone voando sobre uma cidade" : "Ex: um gato em um telhado"}/>
              <Button variant="outline" size="icon" onClick={handleGeneratePostMedia} disabled={isGenerating.postMedia} aria-label={`Gerar ${platform === 'tiktok' ? 'vídeo' : 'imagem'} com IA`}>
                {isGenerating.postMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : (platform === 'tiktok' ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />) }
              </Button>
            </div>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        title="Engajamento e Detalhes"
        description="Métricas, data e outras informações."
        icon={<BarChart className="w-4 h-4" />}
        id="engagement"
      >
        <div className="space-y-4">
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
        </div>
      </EditorSection>
    </Accordion>
  );

  const previewProps = {
    profileName,
    username,
    profilePic,
    postContent,
    postImage: postVideo ? '' : postImage, // Pass image only if there's no video
    postVideo,
    postAudio,
    timestamp,
    isVerified,
    verifiedColor,
    likes,
    reposts,
    shares,
    recommendations,
    comments,
    isLiked,
    handleLike,
  };
  
  const renderPreview = () => {
    switch (platform) {
      case 'facebook': return <FacebookPreview {...previewProps} />;
      case 'instagram': return <InstagramPreview {...previewProps} />;
      case 'twitter': return <TwitterPreview {...previewProps} />;
      case 'threads': return <ThreadsPreview {...previewProps} />;
      case 'bluesky': return <BlueSkyPreview {...previewProps} />;
      case 'linkedin': return <LinkedInPreview {...previewProps} />;
      case 'tiktok': return <TikTokPreview {...previewProps} />;
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
                  
                  <TabsContent value="facebook" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="instagram" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="twitter" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="threads" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="bluesky" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="linkedin" className="mt-6">{editorContent}</TabsContent>
                  <TabsContent value="tiktok" className="mt-6">{editorContent}</TabsContent>
                </Tabs>
                <Separator/>
                <div className="space-y-2">
                  <Label htmlFor="numberOfComments" className="flex items-center gap-2"><Users className="w-4 h-4" /> Número de Comentários</Label>
                  <Input id="numberOfComments" type="number" value={numberOfComments} onChange={(e) => setNumberOfComments(Number(e.target.value))} min={1}/>
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleGenerateComments} disabled={isGenerating.comments} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isGenerating.comments ? (
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
            Feito com <Heart className="w-4 h-4 text-primary fill-current" /> por
            <a
              href="https://www.instagram.com/djjadsonreis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Jadson Reis
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Este é um projeto de código aberto para fins educacionais e de portfólio.
          </p>
        </footer>
      </div>
    </div>
  );
}
