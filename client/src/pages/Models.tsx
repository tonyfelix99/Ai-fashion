import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter } from "lucide-react";
import { Link } from "wouter";
import type { Model, User as UserType } from "@shared/schema";
import { MODEL_CATEGORIES } from "@shared/schema";

export default function Models() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: profileData } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
  });

  const { data: models, isLoading } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const filteredModels = models?.filter((model) => {
    const categoryMatch = selectedCategory === "all" || model.category === selectedCategory;
    const bodyShapeMatch = !profileData?.bodyShape || model.bodyShapes.includes(profileData.bodyShape);
    return categoryMatch && bodyShapeMatch;
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]" data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {MODEL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
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
          <h1 className="font-serif text-4xl font-bold mb-2">Clothing Models</h1>
          <p className="text-muted-foreground">
            {profileData?.bodyShape
              ? `Designs matched to your ${profileData.bodyShape} body shape`
              : "Explore our collection of clothing designs"}
          </p>
        </div>

        {profileData?.bodyShape && (
          <div className="mb-6">
            <Badge variant="secondary" className="capitalize">
              Showing styles for {profileData.bodyShape} body shape
            </Badge>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredModels && filteredModels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className="overflow-hidden hover-elevate transition-all cursor-pointer group"
                data-testid={`card-model-${model.id}`}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="capitalize">{model.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{model.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {model.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {model.bodyShapes.slice(0, 2).map((shape) => (
                      <Badge key={shape} variant="outline" className="text-xs capitalize">
                        {shape}
                      </Badge>
                    ))}
                    {model.bodyShapes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.bodyShapes.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No models found for the selected filters.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
