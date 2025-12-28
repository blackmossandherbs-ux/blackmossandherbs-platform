"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@blackmoss/ui";
import { UserRole } from "@prisma/client";
import { SearchBar } from "@/components/premium/search-bar";
import { ShoppingCart } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gradient">
          BlackMoss & Herbs
        </Link>
        
        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/shop" className="text-sm hover:underline">
            Shop
          </Link>
          <Link href="/blog" className="text-sm hover:underline">
            Blog
          </Link>
          <Link href="/videos" className="text-sm hover:underline">
            Videos
          </Link>
          <Link href="/consultations" className="text-sm hover:underline">
            Consultations
          </Link>
          {session && (
            <Link href="/library" className="text-sm hover:underline">
              Library
            </Link>
          )}
          {session ? (
            <>
              {session.user.role === UserRole.ADMIN || session.user.role === UserRole.STAFF ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              ) : null}
              <Link href="/membership">
                <Button variant="ghost" size="sm">
                  Membership
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  Account
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
