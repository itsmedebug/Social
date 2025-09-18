import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHazardReportSchema, insertSocialPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all hazard reports
  app.get("/api/hazard-reports", async (_req, res) => {
    try {
      const reports = await storage.getAllHazardReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hazard reports" });
    }
  });

  // Get a single hazard report
  app.get("/api/hazard-reports/:id", async (req, res) => {
    try {
      const report = await storage.getHazardReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Hazard report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hazard report" });
    }
  });

  // Create a new hazard report
  app.post("/api/hazard-reports", async (req, res) => {
    try {
      const validatedData = insertHazardReportSchema.parse(req.body);
      const report = await storage.createHazardReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create hazard report" });
    }
  });

  // Get all social posts
  app.get("/api/social-posts", async (_req, res) => {
    try {
      const posts = await storage.getAllSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social posts" });
    }
  });

  // Get a single social post
  app.get("/api/social-posts/:id", async (req, res) => {
    try {
      const post = await storage.getSocialPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Social post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social post" });
    }
  });

  // Create a new social post
  app.post("/api/social-posts", async (req, res) => {
    try {
      const validatedData = insertSocialPostSchema.parse(req.body);
      const post = await storage.createSocialPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create social post" });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't return password in API response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "Pragyan Chakra API"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
