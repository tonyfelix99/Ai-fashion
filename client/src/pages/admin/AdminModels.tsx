import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { uploadFile } from "@/lib/firebase";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Model } from "@shared/schema";
import { MODEL_CATEGORIES, BODY_SHAPES } from "@shared/schema";

export default function AdminModels() {
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    bodyShapes: [] as string[],
  });

  const { data: models, isLoading } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const createModelMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/models", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsDialogOpen(false);
      setSelectedFile(null);
      setFormData({ name: "", category: "", description: "", bodyShapes: [] });
      toast({
        title: "Model Created",
        description: "Clothing model added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!selectedFile || !firebaseUser) return;

    try {
      const imageUrl = await uploadFile(
        selectedFile,
        `models/${Date.now()}_${selectedFile.name}`
      );

      await createModelMutation.mutateAsync({
        ...formData,
        imageUrl,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBodyShapeToggle = (shape: string) => {
    setFormData((prev) => ({
      ...prev,
      bodyShapes: prev.bodyShapes.includes(shape)
        ? prev.bodyShapes.filter((s) => s !== shape)
        : [...prev.bodyShapes, shape],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Manage Models</h1>
            <p className="text-muted-foreground">Add and manage clothing designs</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-model">
                <Plus className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Model</DialogTitle>
                <DialogDescription>
                  Upload a clothing model image and provide details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">Name</Label>
                  <Input
                    id="model-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Dress"
                    data-testid="input-model-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger data-testid="select-model-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODEL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-description">Description</Label>
                  <Textarea
                    id="model-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the clothing model..."
                    data-testid="input-model-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Suitable Body Shapes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BODY_SHAPES.map((shape) => (
                      <div key={shape} className="flex items-center space-x-2">
                        <Checkbox
                          id={`shape-${shape}`}
                          checked={formData.bodyShapes.includes(shape)}
                          onCheckedChange={() => handleBodyShapeToggle(shape)}
                          data-testid={`checkbox-shape-${shape}`}
                        />
                        <label
                          htmlFor={`shape-${shape}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {shape}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-image">Image</Label>
                  <Input
                    id="model-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    data-testid="input-model-image"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formData.name ||
                    !formData.category ||
                    formData.bodyShapes.length === 0 ||
                    !selectedFile ||
                    createModelMutation.isPending
                  }
                  className="w-full"
                  data-testid="button-submit-model"
                >
                  {createModelMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Model"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
        ) : models && models.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden" data-testid={`model-card-${model.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{model.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{model.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No models yet. Add your first model to get started.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
