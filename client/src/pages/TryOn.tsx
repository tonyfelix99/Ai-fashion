import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles, Loader2, ShoppingCart, Check } from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Model, Fabric, Trial } from "@shared/schema";

export default function TryOn() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [generatedTrials, setGeneratedTrials] = useState<Trial[]>([]);

  const { data: models } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const { data: fabrics } = useQuery<Fabric[]>({
    queryKey: ["/api/fabrics"],
  });

  const generateTrialsMutation = useMutation({
    mutationFn: async (data: { modelIds: string[]; fabricIds: string[] }) => {
      return await apiRequest("POST", "/api/trials/generate", data);
    },
    onSuccess: (data: Trial[]) => {
      setGeneratedTrials(data);
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Success!",
        description: `Generated ${data.length} virtual try-ons`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate try-ons. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (trialId: string) => {
      const trial = generatedTrials.find(t => t.id === trialId);
      if (!trial) throw new Error("Trial not found");
      return await apiRequest("POST", "/api/cart", {
        trialId: trial.id,
        modelId: trial.modelId,
        fabricId: trial.fabricId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Added to Cart",
        description: "Item added to your cart successfully.",
      });
    },
  });

  const handleModelToggle = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      }
      if (prev.length >= 4) {
        toast({
          title: "Maximum Reached",
          description: "You can select up to 4 models.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, modelId];
    });
  };

  const handleFabricToggle = (fabricId: string) => {
    setSelectedFabrics((prev) => {
      if (prev.includes(fabricId)) {
        return prev.filter((id) => id !== fabricId);
      }
      if (prev.length >= 4) {
        toast({
          title: "Maximum Reached",
          description: "You can select up to 4 fabrics.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, fabricId];
    });
  };

  const handleGenerate = () => {
    if (selectedModels.length === 0 || selectedFabrics.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one model and one fabric.",
        variant: "destructive",
      });
      return;
    }
    generateTrialsMutation.mutate({
      modelIds: selectedModels,
      fabricIds: selectedFabrics,
    });
  };

  const canGenerate = selectedModels.length > 0 && selectedFabrics.length > 0;
  const totalCombinations = selectedModels.length * selectedFabrics.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Virtual Try-On</h1>
          <p className="text-muted-foreground">
            Select up to 4 models and 4 fabrics to generate AI-powered try-on combinations
          </p>
        </div>

        {generatedTrials.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Models ({selectedModels.length}/4)</CardTitle>
                <CardDescription>Choose clothing designs for your try-on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {models?.slice(0, 12).map((model) => (
                    <div
                      key={model.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden hover-elevate transition-all ${
                        selectedModels.includes(model.id) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleModelToggle(model.id)}
                      data-testid={`selector-model-${model.id}`}
                    >
                      <div className="aspect-[3/4] relative">
                        <img
                          src={model.imageUrl}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedModels.includes(model.id) && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-card">
                        <p className="text-sm font-medium truncate">{model.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Fabrics ({selectedFabrics.length}/4)</CardTitle>
                <CardDescription>Choose fabric textures and colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {fabrics?.slice(0, 12).map((fabric) => (
                    <div
                      key={fabric.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden hover-elevate transition-all ${
                        selectedFabrics.includes(fabric.id) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleFabricToggle(fabric.id)}
                      data-testid={`selector-fabric-${fabric.id}`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={fabric.imageUrl}
                          alt={fabric.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedFabrics.includes(fabric.id) && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-card">
                        <p className="text-sm font-medium truncate">{fabric.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-1">Your Virtual Try-Ons</h2>
                <p className="text-muted-foreground">
                  {generatedTrials.length} combinations generated
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedTrials([]);
                  setSelectedModels([]);
                  setSelectedFabrics([]);
                }}
                data-testid="button-create-new"
              >
                Create New
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {generatedTrials.map((trial) => (
                <Card key={trial.id} className="overflow-hidden" data-testid={`trial-${trial.id}`}>
                  <div className="aspect-[3/4] relative bg-muted">
                    {trial.status === "completed" ? (
                      <img
                        src={trial.imageUrl}
                        alt="Virtual try-on"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={trial.status !== "completed" || addToCartMutation.isPending}
                      onClick={() => addToCartMutation.mutate(trial.id)}
                      data-testid={`button-add-cart-${trial.id}`}
                    >
                      {addToCartMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-3 w-3" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {generatedTrials.length === 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-8">
              <div className="text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">
                  {canGenerate
                    ? `Generate ${totalCombinations} Virtual Try-On${totalCombinations !== 1 ? "s" : ""}`
                    : "Select Models and Fabrics"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {canGenerate
                    ? "Click below to create AI-generated images of you in these outfits"
                    : "Choose at least one model and one fabric to get started"}
                </p>
                <Button
                  size="lg"
                  disabled={!canGenerate || generateTrialsMutation.isPending}
                  onClick={handleGenerate}
                  data-testid="button-generate-tryons"
                >
                  {generateTrialsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating AI Images...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Try-Ons
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
