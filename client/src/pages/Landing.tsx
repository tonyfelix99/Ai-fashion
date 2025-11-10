import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Camera, Palette, ShoppingBag } from "lucide-react";
import { loginWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Landing() {
  const { firebaseUser, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && firebaseUser) {
      setLocation("/dashboard");
    }
  }, [firebaseUser, loading, setLocation]);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI-Powered Fashion,
            <br />
            <span className="text-primary">Made for You</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience personalized outfit recommendations with virtual try-on technology. 
            Our AI analyzes your body shape and skin tone to find your perfect style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group"
              onClick={handleGoogleSignIn}
              data-testid="button-google-signin"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Get Started with Google
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>10,000+ Virtual Try-Ons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Personalized Recommendations</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Four simple steps to discover your perfect style
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: "Upload Photo",
                description: "Share your photo for personalized AI analysis",
                step: "1"
              },
              {
                icon: Sparkles,
                title: "AI Analysis",
                description: "Our AI detects your body shape and skin tone",
                step: "2"
              },
              {
                icon: Palette,
                title: "Browse Outfits",
                description: "Explore models and fabrics matched to you",
                step: "3"
              },
              {
                icon: ShoppingBag,
                title: "Virtual Try-On",
                description: "See yourself in AI-generated outfit previews",
                step: "4"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-6 hover-elevate transition-all h-full">
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-16">
            Why Choose AI Fashion Fit?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Recommendations",
                description: "AI-powered suggestions based on your unique body shape and skin tone for outfits that truly suit you."
              },
              {
                title: "Virtual Try-On Technology",
                description: "See how you look in different outfits before making a purchase with our advanced AI image generation."
              },
              {
                title: "Smart Fabric Matching",
                description: "Discover fabrics and colors that complement your skin tone perfectly using AI color analysis."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 hover-elevate transition-all">
                <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea56c9fd?w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6">
            Start Your AI Fashion Journey
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users discovering their perfect style with AI-powered recommendations
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={handleGoogleSignIn}
            data-testid="button-cta-signin"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Sign In with Google
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AI Fashion Fit. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
