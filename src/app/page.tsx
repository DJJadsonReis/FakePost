'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  MessageSquare,
  Loader2,
  Sun,
  Moon,
  Download,
  Heart,
  WandSparkles,
} from 'lucide-react';
import { getAIGeneratedComments, getAIGeneratedPostContent, getAIGeneratedProfilePic, getAIGeneratedPostMedia, getAIGeneratedPostAudio, getAIGeneratedRandomPost } from './actions';
import { useToast } from '@/hooks/use-toast';

import type { GenerateRealisticCommentsOutput } from '@/ai/flows/generate-comments';

import { FacebookPreview } from '@/components/previews/facebook-preview';
import { InstagramPreview } from '@/components/previews/instagram-preview';
import { TwitterPreview } from '@/components/previews/twitter-preview';
import { ThreadsPreview } from '@/components/previews/threads-preview';
import { BlueSkyPreview } from '@/components/previews/bluesky-preview';
import { LinkedInPreview } from '@/components/previews/linkedin-preview';
import { TikTokPreview } from '@/components/previews/tiktok-preview';
import { PostEditor } from '@/components/post-editor';

export type Comment = GenerateRealisticCommentsOutput['comments'][0] & { profilePicUrl?: string; replies?: Reply[] };
export type Reply = NonNullable<GenerateRealisticCommentsOutput['comments'][0]['replies']>[0] & { profilePicUrl?: string };
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'threads' | 'bluesky' | 'linkedin' | 'tiktok';
export type GenerationType = 'postContent' | 'postMedia' | 'postAudio' | 'profilePic' | 'comments' | 'random';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState<GenerationType[]>([]);
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

  // Engagement State
  const [likes, setLikes] = useState(128);
  const [reposts, setReposts] = useState(42);
  const [shares, setShares] = useState(23);
  const [recommendations, setRecommendations] = useState(78);
  const [isLiked, setIsLiked] = useState(false);

  const editorState = {
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
    numberOfComments,
    isVerified,
    verifiedColor,
    likes,
    reposts,
    shares,
    recommendations,
  };

  const setEditorState = {
    setProfileName,
    setUsername,
    setProfilePic,
    setProfilePicPrompt,
    setPostTopic,
    setPostContent,
    setPostImage,
    setPostVideo,
    setPostMediaPrompt,
    setPostAudio,
    setTimestamp,
    setNumberOfComments,
    setIsVerified,
    setVerifiedColor,
    setLikes,
    setReposts,
    setShares,
    setRecommendations,
  };

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

  const generateProfilePictures = useCallback((commentsToProcess: Comment[]) => {
      commentsToProcess.forEach((comment) => {
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
          comment.replies.forEach((reply) => {
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
  }, []);

  const handleGenerate = useCallback((type: GenerationType) => {
    setIsGenerating(prev => [...prev, type]);
     if (type === 'random') {
        toast({
            title: 'Surpreenda-me!',
            description: 'Gerando um post totalmente novo... Isso pode levar um minuto.',
        });
    }

    startTransition(async () => {
      let result: any;
      try {
        switch (type) {
          case 'postContent':
            result = await getAIGeneratedPostContent(postTopic);
            if (result.postContent) setPostContent(result.postContent);
            break;
          case 'profilePic':
            result = await getAIGeneratedProfilePic(profilePicPrompt);
            if (result.imageUrl) setProfilePic(result.imageUrl);
            break;
          case 'postMedia':
            result = await getAIGeneratedPostMedia(postMediaPrompt, platform);
            if (result.imageUrl) {
                setPostImage(result.imageUrl);
                setPostVideo('');
            }
             if (result.videoUrl) {
                setPostVideo(result.videoUrl);
                setPostImage('');
            }
            break;
          case 'postAudio':
            result = await getAIGeneratedPostAudio(postContent);
            if (result.audioDataUri) setPostAudio(result.audioDataUri);
            break;
          case 'comments':
            result = await getAIGeneratedComments(postContent, numberOfComments);
            if (result.comments) {
              const newComments = result.comments as Comment[];
              setComments(newComments);
              generateProfilePictures(newComments);
            }
            break;
          case 'random':
             result = await getAIGeneratedRandomPost(platform === 'tiktok');
             if (result.post && result.comments) {
                setProfileName(result.post.profileName);
                setUsername(result.post.username);
                setProfilePicPrompt(result.post.profilePicPrompt);
                setPostContent(result.post.postContent);
                setPostMediaPrompt(result.post.postMediaPrompt);
                setProfilePic(result.post.profilePicUrl || '');
                setPostImage(result.post.postImageUrl || '');
                setPostVideo(result.post.postVideoUrl || '');
                setPostAudio('');
                const newComments = result.comments as Comment[];
                setComments(newComments);
                generateProfilePictures(newComments);
                setLikes(Math.floor(Math.random() * 1000) + 50);
                setReposts(Math.floor(Math.random() * 200) + 10);
                setShares(Math.floor(Math.random() * 100) + 5);
                setRecommendations(Math.floor(Math.random() * 50) + 5);
             }
            break;
        }

        if (result.error) {
          toast({ variant: 'destructive', title: 'Erro na Geração', description: result.error });
        } else {
           toast({ title: 'Sucesso!', description: `A geração de '${type}' foi concluída.` });
        }

      } catch (error) {
        console.error(`Error generating ${type}:`, error);
        toast({ variant: 'destructive', title: 'Erro Inesperado', description: `Ocorreu um erro ao gerar ${type}.` });
      } finally {
        setIsGenerating(prev => prev.filter(item => item !== type));
      }
    });
  }, [postTopic, profilePicPrompt, postMediaPrompt, postContent, numberOfComments, platform, toast, generateProfilePictures]);


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
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Editor de Post</CardTitle>
                        <CardDescription>
                        Selecione a plataforma e modifique os detalhes.
                        </CardDescription>
                    </div>
                    <Button onClick={() => handleGenerate('random')} disabled={isGenerating.includes('random') || isPending} size="icon" variant="outline" aria-label="Surpreenda-me">
                        {isGenerating.includes('random') ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5 text-accent" />}
                    </Button>
                </CardHeader>
                <CardContent>
                    <PostEditor 
                        platform={platform}
                        setPlatform={setPlatform}
                        isGenerating={isGenerating}
                        isPending={isPending}
                        handleGenerate={handleGenerate}
                        handleSaveTemplate={handleSaveTemplate}
                        handleLoadTemplate={handleLoadTemplate}
                        editorState={editorState}
                        setEditorState={setEditorState}
                    />
                </CardContent>
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
