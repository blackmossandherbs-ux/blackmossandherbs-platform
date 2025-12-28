import { Button } from "@blackmoss/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@blackmoss/ui";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="card-premium max-w-2xl w-full text-center">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
            <SearchX className="h-10 w-10" />
          </div>
          <CardTitle className="text-5xl mb-2">404</CardTitle>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-premium">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse Shop
              </Link>
            </Button>
          </div>
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">Popular Pages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/shop">Shop</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog">Blog</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/videos">Videos</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/consultations">Consultations</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
