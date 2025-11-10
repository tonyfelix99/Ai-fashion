import {
  type User,
  type InsertUser,
  type Model,
  type InsertModel,
  type Fabric,
  type InsertFabric,
  type Trial,
  type InsertTrial,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  
  getAllModels(): Promise<Model[]>;
  getModel(id: string): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  
  getAllFabrics(): Promise<Fabric[]>;
  getFabric(id: string): Promise<Fabric | undefined>;
  createFabric(fabric: InsertFabric): Promise<Fabric>;
  
  createTrial(trial: InsertTrial): Promise<Trial>;
  getTrial(id: string): Promise<Trial | undefined>;
  getUserTrials(userId: string): Promise<Trial[]>;
  updateTrialStatus(id: string, status: string, imageUrl?: string): Promise<Trial>;
  
  getCartItems(userId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  removeCartItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  
  getStats(): Promise<{
    totalUsers: number;
    totalModels: number;
    totalFabrics: number;
    totalOrders: number;
    totalTrials: number;
  }>;
  getUserStats(userId: string): Promise<{ trials: number; cartItems: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private models: Map<string, Model>;
  private fabrics: Map<string, Fabric>;
  private trials: Map<string, Trial>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.models = new Map();
    this.fabrics = new Map();
    this.trials = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      photoUrl: insertUser.photoUrl || null,
      age: insertUser.age || null,
      height: insertUser.height || null,
      weight: insertUser.weight || null,
      bodyShape: null,
      skinTone: null,
      colorPalette: null,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getAllModels(): Promise<Model[]> {
    return Array.from(this.models.values());
  }

  async getModel(id: string): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const id = randomUUID();
    const model: Model = { 
      ...insertModel, 
      id,
      description: insertModel.description || null,
      createdAt: new Date(),
    };
    this.models.set(id, model);
    return model;
  }

  async getAllFabrics(): Promise<Fabric[]> {
    return Array.from(this.fabrics.values());
  }

  async getFabric(id: string): Promise<Fabric | undefined> {
    return this.fabrics.get(id);
  }

  async createFabric(insertFabric: InsertFabric): Promise<Fabric> {
    const id = randomUUID();
    const fabric: Fabric = { 
      ...insertFabric, 
      id,
      retailerId: insertFabric.retailerId || null,
      description: insertFabric.description || null,
      createdAt: new Date(),
    };
    this.fabrics.set(id, fabric);
    return fabric;
  }

  async createTrial(insertTrial: InsertTrial): Promise<Trial> {
    const id = randomUUID();
    const trial: Trial = { 
      ...insertTrial, 
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.trials.set(id, trial);
    return trial;
  }

  async getTrial(id: string): Promise<Trial | undefined> {
    return this.trials.get(id);
  }

  async getUserTrials(userId: string): Promise<Trial[]> {
    return Array.from(this.trials.values()).filter((t) => t.userId === userId);
  }

  async updateTrialStatus(id: string, status: string, imageUrl?: string): Promise<Trial> {
    const trial = this.trials.get(id);
    if (!trial) throw new Error("Trial not found");
    const updated = { ...trial, status, imageUrl: imageUrl || trial.imageUrl };
    this.trials.set(id, updated);
    return updated;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter((item) => item.userId === userId);
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { 
      ...insertItem, 
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, item);
    return item;
  }

  async removeCartItem(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userItems = Array.from(this.cartItems.entries()).filter(
      ([, item]) => item.userId === userId
    );
    userItems.forEach(([id]) => this.cartItems.delete(id));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalModels: number;
    totalFabrics: number;
    totalOrders: number;
    totalTrials: number;
  }> {
    return {
      totalUsers: this.users.size,
      totalModels: this.models.size,
      totalFabrics: this.fabrics.size,
      totalOrders: this.orders.size,
      totalTrials: this.trials.size,
    };
  }

  async getUserStats(userId: string): Promise<{ trials: number; cartItems: number }> {
    const trials = Array.from(this.trials.values()).filter((t) => t.userId === userId).length;
    const cartItems = Array.from(this.cartItems.values()).filter((i) => i.userId === userId).length;
    return { trials, cartItems };
  }
}

export const storage = new MemStorage();
