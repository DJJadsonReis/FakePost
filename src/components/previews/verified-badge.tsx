import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  isVerified: boolean;
  verifiedColor: string;
  className?: string;
}

export function VerifiedBadge({ isVerified, verifiedColor, className }: VerifiedBadgeProps) {
  return isVerified ? (
    <BadgeCheck className={cn("text-white", className)} style={{ fill: verifiedColor, color: 'white' }} />
  ) : null;
}
