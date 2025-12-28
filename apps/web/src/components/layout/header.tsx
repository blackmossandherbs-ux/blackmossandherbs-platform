"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@blackmoss/ui";
import { UserRole } from "@prisma/client";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          BlackMoss & Herbs
        </Link>
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
          {session ? (
            <>
              {session.user.role === UserRole.ADMIN || session.user.role === UserRole.STAFF ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              ) : null}
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
