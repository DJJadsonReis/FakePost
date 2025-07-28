'use client';

import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
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
  WandSparkles,
  Share2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import { EditorSection } from '@/components/editor-section';
import type { SocialPlatform, GenerationType } from '@/app/page';

interface PostEditorProps {
    platform: SocialPlatform;
    setPlatform: (platform: SocialPlatform) => void;
    isGenerating: GenerationType[];
    isPending: boolean;
    handleGenerate: (type: GenerationType) => void;
    editorState: any;
    updateEditorState: (updates: any) => void;
}

export function PostEditor({
    platform,
    setPlatform,
    isGenerating,
    isPending,
    handleGenerate,
    editorState,
    updateEditorState
}: PostEditorProps) {

    const handleInputChange = (field: string, value: any) => {
        updateEditorState({ [field]: value });
    };

    const handleNumberInputChange = (field: string, value: string) => {
        const num = Number(value);
        if (!isNaN(num)) {
            updateEditorState({ [field]: num });
        }
    };


    const editorContent = (
    <Accordion type="multiple" defaultValue={['profile', 'content']} className="w-full">
      <EditorSection
        id="profile"
        title="Perfil"
        description="Informações do usuário e aparência."
        icon={<Smile className="w-4 h-4 text-muted-foreground" />}
      >
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Nome do Perfil</Label>
            <Input id="profile-name" value={editorState.profileName} onChange={(e) => handleInputChange('profileName', e.target.value)} />
          </div>
          {['twitter', 'threads', 'bluesky', 'tiktok', 'instagram'].includes(platform) && (
            <div className="space-y-2">
              <Label htmlFor="username">@ Nome de usuário</Label>
              <Input id="username" value={editorState.username} onChange={(e) => handleInputChange('username', e.target.value)} />
            </div>
          )}
           <div className="flex items-center space-x-2 pt-2">
                <Switch id="verified-switch" checked={editorState.isVerified} onCheckedChange={(checked) => handleInputChange('isVerified', checked)} />
                <Label htmlFor="verified-switch">Verificado</Label>
            </div>
            {editorState.isVerified && (
                <div className="space-y-2">
                <Label htmlFor="verified-color">Cor do Selo</Label>
                <Input id="verified-color" type="color" value={editorState.verifiedColor} onChange={(e) => handleInputChange('verifiedColor', e.target.value)} className="p-1 h-10 w-full" />
                </div>
            )}
           <div className="space-y-2">
            <Label htmlFor="profile-pic">URL da Foto de Perfil</Label>
            <Input id="profile-pic" value={editorState.profilePic} onChange={(e) => handleInputChange('profilePic', e.target.value)} placeholder="Cole uma URL ou gere com IA"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-pic-prompt">Gerar Foto com IA</Label>
            <div className="flex items-center gap-2">
              <Input id="profile-pic-prompt" value={editorState.profilePicPrompt} onChange={(e) => handleInputChange('profilePicPrompt', e.target.value)} placeholder="Ex: homem sorrindo"/>
              <Button variant="outline" size="icon" onClick={() => handleGenerate('profilePic')} disabled={isGenerating.includes('profilePic') || isPending} aria-label="Gerar foto com IA">
                {isGenerating.includes('profilePic') ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
              </Button>
            </div>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        id="content"
        title="Conteúdo do Post"
        description="Texto, mídia e áudio da publicação."
        icon={<FileText className="w-4 h-4 text-muted-foreground" />}
      >
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="post-topic">Tópico para o Post (IA)</Label>
            <Input id="post-topic" value={editorState.postTopic} onChange={(e) => handleInputChange('postTopic', e.target.value)} placeholder="Sobre o que deve ser o post?"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-content">Conteúdo do Post</Label>
            <div className="flex items-start gap-2">
                <Textarea id="post-content" value={editorState.postContent} onChange={(e) => handleInputChange('postContent', e.target.value)} rows={5} className="flex-1"/>
                <Button variant="outline" size="icon" onClick={() => handleGenerate('postContent')} disabled={isGenerating.includes('postContent') || isPending} aria-label="Gerar conteúdo do post" className="h-auto aspect-square">
                    {isGenerating.includes('postContent') ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
                </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Áudio do Post (TTS)</Label>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleGenerate('postAudio')} disabled={isGenerating.includes('postAudio') || isPending} className="w-full" variant="outline">
                {isGenerating.includes('postAudio') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AudioLines className="mr-2 h-4 w-4" />}
                Gerar Áudio com IA
              </Button>
              {editorState.postAudio && (
                <Button variant="ghost" size="icon" onClick={() => handleInputChange('postAudio', '')} aria-label="Remover áudio">
                    <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          { platform !== 'tiktok' && (
            <div className="space-y-2">
                <Label htmlFor="post-image">URL da Imagem do Post</Label>
                <div className="flex items-center gap-2">
                <Input id="post-image" value={editorState.postImage} onChange={(e) => handleInputChange('postImage', e.target.value)} placeholder="Cole uma URL de imagem aqui"/>
                <Button variant="ghost" size="icon" onClick={() => updateEditorState({ postImage: '', postVideo: '' })} aria-label="Remover imagem" className="h-9 w-9">
                    <X className="h-4 w-4" />
                </Button>
                </div>
            </div>
          )}
          <div className="space-y-2">
             <Label htmlFor="post-media-prompt">
              Gerar {platform === 'tiktok' ? 'Vídeo' : 'Imagem'} com IA
            </Label>
            <div className="flex items-center gap-2">
              <Input id="post-media-prompt" value={editorState.postMediaPrompt} onChange={(e) => handleInputChange('postMediaPrompt', e.target.value)} placeholder={platform === 'tiktok' ? "Ex: um drone voando sobre uma cidade" : "Ex: um gato em um telhado"}/>
              <Button variant="outline" size="icon" onClick={() => handleGenerate('postMedia')} disabled={isGenerating.includes('postMedia') || isPending} aria-label={`Gerar ${platform === 'tiktok' ? 'vídeo' : 'imagem'} com IA`}>
                {isGenerating.includes('postMedia') ? <Loader2 className="h-4 w-4 animate-spin" /> : (platform === 'tiktok' ? <Video className="h-4 w-4 text-accent" /> : <ImageIcon className="h-4 w-4 text-accent" />) }
              </Button>
            </div>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        id="engagement"
        title="Engajamento e Detalhes"
        description="Métricas, data e outras informações."
        icon={<BarChart className="w-4 h-4 text-muted-foreground" />}
      >
        <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="timestamp">Data e Hora</Label>
              <Input id="timestamp" value={editorState.timestamp} onChange={(e) => handleInputChange('timestamp', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="likes">Curtidas</Label>
                <Input id="likes" type="number" value={editorState.likes} onChange={(e) => handleNumberInputChange('likes', e.target.value)} />
              </div>
              {(platform === 'facebook' || platform === 'tiktok') && (
                <div className="space-y-2">
                  <Label htmlFor="shares">Compartilhamentos</Label>
                  <Input id="shares" type="number" value={editorState.shares} onChange={(e) => handleNumberInputChange('shares', e.target.value)} />
                </div>
              )}
              {(platform === 'twitter' || platform === 'threads' || platform === 'bluesky') && (
                  <div className="space-y-2">
                    <Label htmlFor="reposts">Reposts</Label>
                    <Input id="reposts" type="number" value={editorState.reposts} onChange={(e) => handleNumberInputChange('reposts', e.target.value)} />
                  </div>
              )}
              {platform === 'linkedin' && (
                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recomendações</Label>
                  <Input id="recommendations" type="number" value={editorState.recommendations} onChange={(e) => handleNumberInputChange('recommendations', e.target.value)} />
                </div>
              )}
            </div>
        </div>
      </EditorSection>
    </Accordion>
    );

    return (
        <div className="space-y-6">
            <Tabs value={platform} onValueChange={(value) => setPlatform(value as SocialPlatform)} className="w-full">
                <TabsList className="h-auto flex-wrap">
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
                <Label htmlFor="numberOfComments" className="flex items-center gap-2"><Users className="mr-2 h-4 w-4" /> Número de Comentários</Label>
                <Input id="numberOfComments" type="number" value={editorState.numberOfComments} onChange={(e) => handleNumberInputChange('numberOfComments', e.target.value)} min={1}/>
            </div>
             <CardFooter className="p-0">
                 <Button onClick={() => handleGenerate('comments')} disabled={isGenerating.includes('comments') || isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isGenerating.includes('comments') ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Gerar Comentários com IA
                    </>
                  )}
                </Button>
              </CardFooter>
        </div>
    );
}
