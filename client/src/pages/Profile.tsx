import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Sparkles, ArrowLeft } from "lucide-react";
import { uploadFile } from "@/lib/firebase";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { User as UserType } from "@shared/schema";

export default function Profile() {
  const { firebaseUser, user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: firebaseUser?.displayName || "",
    age: "",
    height: "",
    weight: "",
  });

  const { data: profileData, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
    enabled: !!firebaseUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzePhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      return await apiRequest("POST", "/api/ai/analyze-photo", { photoUrl });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "AI Analysis Complete!",
        description: `Detected: ${data.bodyShape} body shape, ${data.skinTone} skin tone`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile || !firebaseUser) return;

    try {
      const photoUrl = await uploadFile(selectedFile, `users/${firebaseUser.uid}/profile.jpg`);
      
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        photoUrl,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
      });

      analyzePhotoMutation.mutate(photoUrl);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAnalyzing = analyzePhotoMutation.isPending;
  const isUploading = updateProfileMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Upload your photo for AI-powered body shape and skin tone analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a clear, front-facing photo for accurate AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-40 w-40">
                  <AvatarImage src={previewUrl || profileData?.photoUrl || undefined} />
                  <AvatarFallback className="text-4xl">
                    {firebaseUser?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover-elevate transition-all">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {selectedFile ? selectedFile.name : "Click to upload photo"}
                        </p>
                      </div>
                    </div>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="input-photo-upload"
                  />
                </div>

                {selectedFile && (
                  <Button
                    onClick={handleUploadAndAnalyze}
                    disabled={isUploading || isAnalyzing}
                    className="w-full"
                    data-testid="button-analyze-photo"
                  >
                    {isUploading || isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Uploading..." : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                )}
              </div>

              {profileData?.bodyShape && profileData?.skinTone && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">AI Analysis Results</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      Body: {profileData.bodyShape}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      Skin: {profileData.skinTone}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Help us provide better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age (optional)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  data-testid="input-age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height in cm (optional)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="e.g., 170"
                  data-testid="input-height"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight in kg (optional)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 65"
                  data-testid="input-weight"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={!formData.name || isUploading}
                className="w-full"
                data-testid="button-save-profile"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
