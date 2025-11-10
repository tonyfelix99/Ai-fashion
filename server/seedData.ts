import { storage } from "./storage";

export async function seedInitialData() {
  const modelCount = await storage.getAllModels();
  if (modelCount.length > 0) {
    console.log("Data already seeded, skipping...");
    return;
  }

  console.log("Seeding initial data...");

  const models = [
    {
      name: "Classic Summer Dress",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
      category: "casual",
      bodyShapes: ["hourglass", "pear", "rectangle"],
      description: "Light and breezy summer dress perfect for warm days",
    },
    {
      name: "Elegant Evening Gown",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop",
      category: "formal",
      bodyShapes: ["hourglass", "inverted-triangle"],
      description: "Sophisticated gown for special occasions",
    },
    {
      name: "Casual Denim Jacket",
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
      category: "casual",
      bodyShapes: ["rectangle", "inverted-triangle", "apple"],
      description: "Versatile denim jacket for everyday wear",
    },
    {
      name: "Traditional Saree",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop",
      category: "ethnic",
      bodyShapes: ["hourglass", "pear", "rectangle"],
      description: "Beautiful traditional saree with modern draping",
    },
    {
      name: "Party Cocktail Dress",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop",
      category: "party",
      bodyShapes: ["hourglass", "apple", "pear"],
      description: "Stunning cocktail dress for evening parties",
    },
    {
      name: "Athletic Sportswear Set",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop",
      category: "sportswear",
      bodyShapes: ["rectangle", "inverted-triangle", "hourglass"],
      description: "Comfortable sportswear for active lifestyle",
    },
    {
      name: "Business Formal Blazer",
      imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=600&fit=crop",
      category: "formal",
      bodyShapes: ["rectangle", "inverted-triangle", "apple"],
      description: "Professional blazer for business meetings",
    },
    {
      name: "Bohemian Maxi Dress",
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop",
      category: "casual",
      bodyShapes: ["pear", "rectangle", "apple"],
      description: "Flowing maxi dress with bohemian prints",
    },
  ];

  const fabrics = [
    {
      name: "Soft Cotton Blue",
      imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=400&fit=crop",
      texture: "cotton",
      skinTones: ["fair", "light", "medium"],
      price: 45,
      description: "Breathable cotton fabric in calming blue",
    },
    {
      name: "Luxe Silk Ivory",
      imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea56c9fd?w=400&h=400&fit=crop",
      texture: "silk",
      skinTones: ["fair", "light", "olive"],
      price: 89,
      description: "Premium silk with elegant drape",
    },
    {
      name: "Warm Wool Burgundy",
      imageUrl: "https://images.unsplash.com/photo-1507682119456-c34f4913c06b?w=400&h=400&fit=crop",
      texture: "wool",
      skinTones: ["medium", "olive", "tan"],
      price: 75,
      description: "Cozy wool blend in rich burgundy",
    },
    {
      name: "Classic Denim Indigo",
      imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop",
      texture: "denim",
      skinTones: ["light", "medium", "tan"],
      price: 55,
      description: "Durable denim in classic indigo",
    },
    {
      name: "Airy Linen Beige",
      imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=400&fit=crop",
      texture: "linen",
      skinTones: ["olive", "tan", "deep"],
      price: 52,
      description: "Light linen perfect for summer",
    },
    {
      name: "Sleek Polyester Black",
      imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea56c9fd?w=400&h=400&fit=crop",
      texture: "polyester",
      skinTones: ["fair", "light", "medium", "olive", "tan", "deep"],
      price: 38,
      description: "Versatile polyester in timeless black",
    },
    {
      name: "Delicate Chiffon Pink",
      imageUrl: "https://images.unsplash.com/photo-1507682119456-c34f4913c06b?w=400&h=400&fit=crop",
      texture: "chiffon",
      skinTones: ["fair", "light", "medium"],
      price: 65,
      description: "Flowing chiffon in soft pink",
    },
    {
      name: "Rich Velvet Emerald",
      imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop",
      texture: "velvet",
      skinTones: ["olive", "tan", "deep"],
      price: 95,
      description: "Luxurious velvet in deep emerald",
    },
  ];

  for (const model of models) {
    await storage.createModel(model);
  }

  for (const fabric of fabrics) {
    await storage.createFabric(fabric);
  }

  console.log(`Seeded ${models.length} models and ${fabrics.length} fabrics`);
}
