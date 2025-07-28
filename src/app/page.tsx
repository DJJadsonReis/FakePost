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
  Save,
  FolderOpen,
} from 'lucide-react';
import { getAIGeneratedComments, getAIGeneratedPostContent, getAIGeneratedPostMedia, getAIGeneratedPostAudio, getAIGeneratedRandomPost, getAIGeneratedProfilePic } from './actions';
import { useToast } from '@/hooks/use-toast';

import type { Comment as CommentType, Reply } from '@/ai/flows/generate-comments';
import { FacebookPreview } from '@/components/previews/facebook-preview';
import { InstagramPreview } from '@/components/previews/instagram-preview';
import { TwitterPreview } from '@/components/previews/twitter-preview';
import { ThreadsPreview } from '@/components/previews/threads-preview';
import { BlueSkyPreview } from '@/components/previews/bluesky-preview';
import { LinkedInPreview } from '@/components/previews/linkedin-preview';
import { TikTokPreview } from '@/components/previews/tiktok-preview';
import { PostEditor } from '@/components/post-editor';
import { Separator } from '@/components/ui/separator';

export type Comment = CommentType & { profilePicUrl?: string; replies?: ReplyWithPic[] };
export type ReplyWithPic = Reply & { profilePicUrl?: string };
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'threads' | 'bluesky' | 'linkedin' | 'tiktok';
export type GenerationType = 'postContent' | 'postMedia' | 'postAudio' | 'profilePic' | 'comments' | 'random';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState<GenerationType[]>([]);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  // Consolidated Editor State
  const [editorState, setEditorState] = useState({
    profileName: 'Maria Silva',
    username: '@mariasilva',
    profilePic: 'https://placehold.co/48x48.png',
    profilePicPrompt: 'mulher sorrindo',
    postTopic: 'um lindo dia no parque',
    postContent:
      "Aproveitando um lindo dia no parque! É incrível como um pouco de sol pode mudar todo o seu humor. ☀️ #abençoada #amantedanatureza #boasvibrações",
    postImage: 'https://placehold.co/600x400.png',
    postVideo: '',
    postMediaPrompt: 'um lindo dia no parque com sol',
    postAudio: '',
    timestamp: '2h',
    numberOfComments: 5,
    isVerified: true,
    verifiedColor: '#1DA1F2',
    likes: 128,
    reposts: 42,
    shares: 23,
    recommendations: 78,
  });

  const updateEditorState = (updates: Partial<typeof editorState>) => {
    setEditorState(prevState => ({ ...prevState, ...updates }));
  };
  
  // Other UI State
  const [platform, setPlatform] = useState<SocialPlatform>('tiktok');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDownloading, setIsDownloading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    handleLoadTemplate(true); // silently load template on startup
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
            result = await getAIGeneratedPostContent(editorState.postTopic);
            if (result.postContent) updateEditorState({ postContent: result.postContent });
            break;
          case 'profilePic':
            result = await getAIGeneratedProfilePic(editorState.profilePicPrompt);
            if (result.imageUrl) updateEditorState({ profilePic: result.imageUrl });
            break;
          case 'postMedia':
            result = await getAIGeneratedPostMedia(editorState.postMediaPrompt, platform);
            if (result.imageUrl) {
                updateEditorState({ postImage: result.imageUrl, postVideo: '' });
            }
             if (result.videoUrl) {
                updateEditorState({ postVideo: result.videoUrl, postImage: '' });
            }
            break;
          case 'postAudio':
            result = await getAIGeneratedPostAudio(editorState.postContent);
            if (result.audioDataUri) updateEditorState({ postAudio: result.audioDataUri });
            break;
          case 'comments':
            result = await getAIGeneratedComments(editorState.postContent, editorState.numberOfComments);
            if (result.comments) {
              setComments(result.comments);
            }
            break;
          case 'random':
             result = await getAIGeneratedRandomPost(platform);
             if (result.post && result.comments) {
                updateEditorState({
                    profileName: result.post.profileName,
                    username: result.post.username,
                    profilePicPrompt: result.post.profilePicPrompt,
                    postContent: result.post.postContent,
                    postMediaPrompt: result.post.postMediaPrompt,
                    profilePic: result.post.profilePicUrl || '',
                    postImage: result.post.postImageUrl || '',
                    postVideo: result.post.postVideoUrl || '',
                    postAudio: '',
                    likes: Math.floor(Math.random() * 1000) + 50,
                    reposts: Math.floor(Math.random() * 200) + 10,
                    shares: Math.floor(Math.random() * 100) + 5,
                    recommendations: Math.floor(Math.random() * 50) + 5,
                });
                setComments(result.comments);
             }
            break;
        }

        if (result.error) {
          toast({ variant: 'destructive', title: 'Erro na Geração', description: result.error });
        } else {
           if (type !== 'random') {
              toast({ title: 'Sucesso!', description: `A geração de '${type}' foi concluída.` });
           }
        }

      } catch (error) {
        console.error(`Error generating ${type}:`, error);
        toast({ variant: 'destructive', title: 'Erro Inesperado', description: `Ocorreu um erro ao gerar ${type}.` });
      } finally {
        setIsGenerating(prev => prev.filter(item => item !== type));
      }
    });
  }, [editorState.postTopic, editorState.profilePicPrompt, editorState.postMediaPrompt, editorState.postContent, editorState.numberOfComments, platform, toast]);


  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    updateEditorState({ likes: editorState.likes + (newLikedState ? 1 : -1) });
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
    try {
        localStorage.setItem('fakePostTemplate', JSON.stringify(editorState));
        toast({
          title: 'Modelo Salvo!',
          description: 'Suas configurações atuais foram salvas no navegador.',
        });
    } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar o modelo. O armazenamento pode estar cheio.',
        });
    }
  };

  const handleLoadTemplate = (silent = false) => {
    const savedTemplate = localStorage.getItem('fakePostTemplate');
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        setEditorState(prevState => ({ ...prevState, ...template }));
        if (!silent) {
            toast({
              title: 'Modelo Carregado!',
              description: 'As configurações salvas foram aplicadas.',
            });
        }
      } catch (error) {
         if (!silent) {
            toast({
              variant: 'destructive',
              title: 'Erro ao Carregar',
              description: 'O modelo salvo parece estar corrompido.',
            });
         }
      }
    } else if (!silent) {
      toast({
        variant: 'destructive',
        title: 'Nenhum Modelo Encontrado',
        description: 'Não há nenhum modelo salvo no seu navegador.',
      });
    }
  };


  const previewProps = {
    ...editorState,
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
                    <div className="flex gap-2">
                        <Button onClick={handleSaveTemplate} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Modelo
                        </Button>
                        <Button onClick={() => handleLoadTemplate()} variant="outline" className="w-full">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Carregar Modelo
                        </Button>
                    </div>
                    <Separator className="my-6" />
                    <PostEditor 
                        platform={platform}
                        setPlatform={setPlatform}
                        isGenerating={isGenerating}
                        isPending={isPending}
                        handleGenerate={handleGenerate}
                        editorState={editorState}
                        setEditorState={updateEditorState}
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

    