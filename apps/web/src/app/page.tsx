import Link from "next/link";
import { Button } from "@blackmoss/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to BlackMoss & Herbs
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Premium Herbal Wellness Platform
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
