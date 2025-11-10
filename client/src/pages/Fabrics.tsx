import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter, DollarSign } from "lucide-react";
import { Link } from "wouter";
import type { Fabric, User as UserType } from "@shared/schema";
import { FABRIC_TEXTURES } from "@shared/schema";

export default function Fabrics() {
  const { user } = useAuth();
  const [selectedTexture, setSelectedTexture] = useState<string>("all");

  const { data: profileData } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
  });

  const { data: fabrics, isLoading } = useQuery<Fabric[]>({
    queryKey: ["/api/fabrics"],
  });

  const filteredFabrics = fabrics?.filter((fabric) => {
    const textureMatch = selectedTexture === "all" || fabric.texture === selectedTexture;
    const skinToneMatch = !profileData?.skinTone || fabric.skinTones.includes(profileData.skinTone);
    return textureMatch && skinToneMatch;
  });

  const sortedFabrics = filteredFabrics?.sort((a, b) => {
    if (!profileData?.skinTone) return 0;
    const aMatch = a.skinTones.includes(profileData.skinTone);
    const bMatch = b.skinTones.includes(profileData.skinTone);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedTexture} onValueChange={setSelectedTexture}>
                <SelectTrigger className="w-[180px]" data-testid="select-texture">
                  <SelectValue placeholder="Texture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Textures</SelectItem>
                  {FABRIC_TEXTURES.map((texture) => (
                    <SelectItem key={texture} value={texture} className="capitalize">
                      {texture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Fabric Catalog</h1>
          <p className="text-muted-foreground">
            {profileData?.skinTone
              ? `Fabrics sorted by match to your ${profileData.skinTone} skin tone`
              : "Discover our collection of premium fabrics"}
          </p>
        </div>

        {profileData?.skinTone && (
          <div className="mb-6">
            <Badge variant="secondary" className="capitalize">
              Best matches for {profileData.skinTone} skin tone
            </Badge>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedFabrics && sortedFabrics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedFabrics.map((fabric) => {
              const isMatch = profileData?.skinTone && fabric.skinTones.includes(profileData.skinTone);
              return (
                <Card
                  key={fabric.id}
                  className={`overflow-hidden hover-elevate transition-all cursor-pointer group ${
                    isMatch ? "ring-2 ring-primary/50" : ""
                  }`}
                  data-testid={`card-fabric-${fabric.id}`}
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={fabric.imageUrl}
                      alt={fabric.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isMatch && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">Perfect Match</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{fabric.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {fabric.texture}
                      </Badge>
                      <span className="text-sm font-medium flex items-center">
                        <DollarSign className="h-3 w-3" />
                        {fabric.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {fabric.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No fabrics found for the selected filters.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
