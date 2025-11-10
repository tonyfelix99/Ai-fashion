import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  age: integer("age"),
  height: integer("height"),
  weight: integer("weight"),
  bodyShape: text("body_shape"),
  skinTone: text("skin_tone"),
  colorPalette: json("color_palette").$type<string[]>(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const models = pgTable("models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  bodyShapes: json("body_shapes").$type<string[]>().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fabrics = pgTable("fabrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  texture: text("texture").notNull(),
  skinTones: json("skin_tones").$type<string[]>().notNull(),
  price: integer("price").notNull(),
  retailerId: varchar("retailer_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trials = pgTable("trials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  modelId: varchar("model_id").notNull(),
  fabricId: varchar("fabric_id").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  trialId: varchar("trial_id").notNull(),
  modelId: varchar("model_id").notNull(),
  fabricId: varchar("fabric_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  items: json("items").$type<Array<{trialId: string; modelId: string; fabricId: string; quantity: number}>>().notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(1).max(120).optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(500).optional(),
  photoUrl: z.string().url().optional(),
});

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
  createdAt: true,
});

export const insertFabricSchema = createInsertSchema(fabrics).omit({
  id: true,
  createdAt: true,
});

export const insertTrialSchema = createInsertSchema(trials).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;

export type Fabric = typeof fabrics.$inferSelect;
export type InsertFabric = z.infer<typeof insertFabricSchema>;

export type Trial = typeof trials.$inferSelect;
export type InsertTrial = z.infer<typeof insertTrialSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const BODY_SHAPES = ["hourglass", "pear", "apple", "rectangle", "inverted-triangle"] as const;
export const SKIN_TONES = ["fair", "light", "medium", "olive", "tan", "deep"] as const;
export const MODEL_CATEGORIES = ["casual", "formal", "ethnic", "party", "sportswear"] as const;
export const FABRIC_TEXTURES = ["cotton", "silk", "wool", "denim", "linen", "polyester", "chiffon", "velvet"] as const;
