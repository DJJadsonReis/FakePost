import type { Comment } from '@/app/page';

export interface PreviewProps {
  profileName: string;
  username: string;
  profilePic: string;
  postContent: string;
  postImage: string;
  postAudio: string;
  timestamp: string;
  isVerified: boolean;
  verifiedColor: string;
  likes: number;
  reposts: number;
  shares: number;
  recommendations: number;
  comments: Comment[];
  isLiked: boolean;
  handleLike: () => void;
}
