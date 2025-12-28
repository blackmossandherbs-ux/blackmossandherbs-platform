"use client";

import { Button } from "@blackmoss/ui";
import { Share2, Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@blackmoss/ui";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export function SocialShare({ url, title, description, image }: SocialShareProps) {
  const fullUrl = typeof window !== "undefined" ? window.location.href : url;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    // Show toast notification
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {navigator.share && (
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Native Share
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.email}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
