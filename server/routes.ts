import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePhoto, generateTryOnImage } from "./services/aiService";
import { authMiddleware, adminMiddleware } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { firebaseUid, email, name, photoUrl } = req.body;
      
      if (!firebaseUid || !email || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        user = await storage.createUser({
          firebaseUid,
          email,
          name,
          photoUrl: photoUrl || null,
          role: "user",
        });
      }
      
      res.json(user);
    } catch (error: any) {
      console.error("Auth sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user/profile", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/user/profile", authMiddleware, async (req, res) => {
    try {
      const updated = await storage.updateUser(req.userId!, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user/stats", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.userId!);
      res.json(stats);
    } catch (error: any) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/analyze-photo", authMiddleware, async (req, res) => {
    try {
      const { photoUrl } = req.body;
      
      if (!photoUrl) {
        return res.status(400).json({ error: "Photo URL required" });
      }

      if (!photoUrl.startsWith("https://firebasestorage.googleapis.com")) {
        return res.status(400).json({ error: "Only Firebase Storage URLs are allowed" });
      }
      
      const analysis = await analyzePhoto(photoUrl);
      
      await storage.updateUser(req.userId!, {
        bodyShape: analysis.bodyShape,
        skinTone: analysis.skinTone,
        colorPalette: analysis.colorPalette,
      });
      
      res.json(analysis);
    } catch (error: any) {
      console.error("Analyze photo error:", error);
      res.status(500).json({ error: "Failed to analyze photo. Please try again." });
    }
  });

  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error: any) {
      console.error("Get models error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/fabrics", async (req, res) => {
    try {
      const fabrics = await storage.getAllFabrics();
      res.json(fabrics);
    } catch (error: any) {
      console.error("Get fabrics error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/trials/generate", authMiddleware, async (req, res) => {
    try {
      const { modelIds, fabricIds } = req.body;
      
      if (!modelIds || !fabricIds || !Array.isArray(modelIds) || !Array.isArray(fabricIds)) {
        return res.status(400).json({ error: "Invalid request" });
      }
      
      if (modelIds.length === 0 || fabricIds.length === 0) {
        return res.status(400).json({ error: "At least one model and one fabric required" });
      }

      if (modelIds.length > 4 || fabricIds.length > 4) {
        return res.status(400).json({ error: "Maximum 4 models and 4 fabrics allowed" });
      }

      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const trials = [];
      
      for (const modelId of modelIds) {
        for (const fabricId of fabricIds) {
          const trial = await storage.createTrial({
            userId: req.userId!,
            modelId,
            fabricId,
            imageUrl: "",
          });
          trials.push(trial);
          
          const model = await storage.getModel(modelId);
          const fabric = await storage.getFabric(fabricId);
          
          if (model && fabric && user.photoUrl && user.photoUrl.startsWith("https://firebasestorage.googleapis.com")) {
            setTimeout(async () => {
              try {
                const imageUrl = await generateTryOnImage(
                  user.photoUrl!,
                  model.imageUrl,
                  `${fabric.texture} ${fabric.name}`
                );
                await storage.updateTrialStatus(trial.id, "completed", imageUrl);
              } catch (error) {
                console.error("Error generating trial image:", error);
                await storage.updateTrialStatus(trial.id, "failed");
              }
            }, 0);
          }
        }
      }
      
      res.json(trials);
    } catch (error: any) {
      console.error("Generate trials error:", error);
      res.status(500).json({ error: "Failed to generate try-ons. Please try again." });
    }
  });

  app.get("/api/cart", authMiddleware, async (req, res) => {
    try {
      const items = await storage.getCartItems(req.userId!);
      
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const model = await storage.getModel(item.modelId);
          const fabric = await storage.getFabric(item.fabricId);
          return { ...item, model, fabric };
        })
      );
      
      res.json(itemsWithDetails);
    } catch (error: any) {
      console.error("Get cart error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cart", authMiddleware, async (req, res) => {
    try {
      const { trialId, modelId, fabricId } = req.body;
      
      if (!trialId || !modelId || !fabricId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const item = await storage.addCartItem({
        userId: req.userId!,
        trialId,
        modelId,
        fabricId,
        quantity: 1,
      });
      
      res.json(item);
    } catch (error: any) {
      console.error("Add to cart error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/cart/:id", authMiddleware, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders/checkout", authMiddleware, async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.userId!);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      
      const items = cartItems.map((item) => ({
        trialId: item.trialId,
        modelId: item.modelId,
        fabricId: item.fabricId,
        quantity: item.quantity,
      }));
      
      const totalAmount = await Promise.all(
        cartItems.map(async (item) => {
          const fabric = await storage.getFabric(item.fabricId);
          return (fabric?.price || 0) * item.quantity;
        })
      ).then((prices) => prices.reduce((sum, price) => sum + price, 0));
      
      const order = await storage.createOrder({
        userId: req.userId!,
        items,
        totalAmount,
        status: "completed",
      });
      
      await storage.clearCart(req.userId!);
      
      res.json(order);
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/models", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { name, imageUrl, category, bodyShapes, description } = req.body;
      
      if (!name || !imageUrl || !category || !bodyShapes || !Array.isArray(bodyShapes)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!imageUrl.startsWith("https://firebasestorage.googleapis.com")) {
        return res.status(400).json({ error: "Only Firebase Storage URLs are allowed" });
      }
      
      const model = await storage.createModel(req.body);
      res.json(model);
    } catch (error: any) {
      console.error("Create model error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/fabrics", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { name, imageUrl, texture, skinTones, price, description } = req.body;
      
      if (!name || !imageUrl || !texture || !skinTones || !Array.isArray(skinTones) || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!imageUrl.startsWith("https://firebasestorage.googleapis.com")) {
        return res.status(400).json({ error: "Only Firebase Storage URLs are allowed" });
      }
      
      const fabric = await storage.createFabric(req.body);
      res.json(fabric);
    } catch (error: any) {
      console.error("Create fabric error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
