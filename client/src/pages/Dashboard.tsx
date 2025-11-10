import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shirt, Palette, Sparkles, ShoppingCart, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/firebase";
import { useLocation } from "wouter";
import type { User as UserType } from "@shared/schema";

export default function Dashboard() {
  const { firebaseUser, user, setUser } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profileData } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
    enabled: !!firebaseUser,
  });

  const { data: stats } = useQuery<{ trials: number; cartItems: number }>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setLocation("/");
  };

  const hasProfile = profileData && profileData.bodyShape && profileData.skinTone;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <a className="font-serif text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Fashion Fit
              </a>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                  <ShoppingCart className="h-5 w-5" />
                  {stats && stats.cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {stats.cartItems}
                    </span>
                  )}
                </Button>
              </Link>

              <Avatar>
                <AvatarImage src={firebaseUser?.photoURL || undefined} />
                <AvatarFallback>{firebaseUser?.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">
            Welcome back, {firebaseUser?.displayName?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            {hasProfile ? "Discover your perfect outfits" : "Complete your profile to get started"}
          </p>
        </div>

        {!hasProfile && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                Upload your photo to get AI-powered body shape and skin tone analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button data-testid="button-complete-profile">
                  <User className="mr-2 h-4 w-4" />
                  Set Up Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {hasProfile && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your AI Profile</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">
                    <User className="mr-1 h-3 w-3" />
                    {profileData.bodyShape}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    <Palette className="mr-1 h-3 w-3" />
                    {profileData.skinTone}
                  </Badge>
                </div>
              </div>
              <div className="ml-auto">
                <Link href="/profile">
                  <Button variant="outline" size="sm" data-testid="button-edit-profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-elevate transition-all cursor-pointer" onClick={() => setLocation("/models")}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shirt className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Browse Models</CardTitle>
              <CardDescription>
                Explore clothing designs matched to your body shape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/models">
                <Button className="w-full" data-testid="link-browse-models">
                  View Collection
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all cursor-pointer" onClick={() => setLocation("/fabrics")}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Fabric Catalog</CardTitle>
              <CardDescription>
                Discover fabrics that complement your skin tone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/fabrics">
                <Button className="w-full" data-testid="link-browse-fabrics">
                  Explore Fabrics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all cursor-pointer" onClick={() => setLocation("/try-on")}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Virtual Try-On</CardTitle>
              <CardDescription>
                Generate AI images of you in different outfits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/try-on">
                <Button className="w-full" disabled={!hasProfile} data-testid="link-virtual-tryon">
                  {hasProfile ? "Create Try-Ons" : "Complete Profile First"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {stats && stats.trials > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold mb-6">Your Try-On History</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You have generated {stats.trials} virtual try-on{stats.trials !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
