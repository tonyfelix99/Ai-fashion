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
import type { Fabric } from "@shared/schema";
import { FABRIC_TEXTURES, SKIN_TONES } from "@shared/schema";

export default function AdminFabrics() {
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    texture: "",
    price: "",
    description: "",
    skinTones: [] as string[],
  });

  const { data: fabrics, isLoading } = useQuery<Fabric[]>({
    queryKey: ["/api/fabrics"],
  });

  const createFabricMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/fabrics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fabrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsDialogOpen(false);
      setSelectedFile(null);
      setFormData({ name: "", texture: "", price: "", description: "", skinTones: [] });
      toast({
        title: "Fabric Created",
        description: "Fabric added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create fabric. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!selectedFile || !firebaseUser) return;

    try {
      const imageUrl = await uploadFile(
        selectedFile,
        `fabrics/${Date.now()}_${selectedFile.name}`
      );

      await createFabricMutation.mutateAsync({
        ...formData,
        price: parseInt(formData.price),
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

  const handleSkinToneToggle = (tone: string) => {
    setFormData((prev) => ({
      ...prev,
      skinTones: prev.skinTones.includes(tone)
        ? prev.skinTones.filter((t) => t !== tone)
        : [...prev.skinTones, tone],
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
            <h1 className="font-serif text-4xl font-bold mb-2">Manage Fabrics</h1>
            <p className="text-muted-foreground">Add and manage fabric options</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-fabric">
                <Plus className="mr-2 h-4 w-4" />
                Add Fabric
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Fabric</DialogTitle>
                <DialogDescription>
                  Upload a fabric image and provide details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fabric-name">Name</Label>
                  <Input
                    id="fabric-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Silk Floral Print"
                    data-testid="input-fabric-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabric-texture">Texture</Label>
                  <Select
                    value={formData.texture}
                    onValueChange={(value) => setFormData({ ...formData, texture: value })}
                  >
                    <SelectTrigger data-testid="select-fabric-texture">
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                    <SelectContent>
                      {FABRIC_TEXTURES.map((texture) => (
                        <SelectItem key={texture} value={texture} className="capitalize">
                          {texture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabric-price">Price ($)</Label>
                  <Input
                    id="fabric-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 49"
                    data-testid="input-fabric-price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabric-description">Description</Label>
                  <Textarea
                    id="fabric-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the fabric..."
                    data-testid="input-fabric-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Suitable Skin Tones</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SKIN_TONES.map((tone) => (
                      <div key={tone} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tone-${tone}`}
                          checked={formData.skinTones.includes(tone)}
                          onCheckedChange={() => handleSkinToneToggle(tone)}
                          data-testid={`checkbox-tone-${tone}`}
                        />
                        <label
                          htmlFor={`tone-${tone}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {tone}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabric-image">Image</Label>
                  <Input
                    id="fabric-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    data-testid="input-fabric-image"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formData.name ||
                    !formData.texture ||
                    !formData.price ||
                    formData.skinTones.length === 0 ||
                    !selectedFile ||
                    createFabricMutation.isPending
                  }
                  className="w-full"
                  data-testid="button-submit-fabric"
                >
                  {createFabricMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Fabric"
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
                <div className="aspect-square bg-muted animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : fabrics && fabrics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fabrics.map((fabric) => (
              <Card key={fabric.id} className="overflow-hidden" data-testid={`fabric-card-${fabric.id}`}>
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={fabric.imageUrl}
                    alt={fabric.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{fabric.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{fabric.texture} • ${fabric.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No fabrics yet. Add your first fabric to get started.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
