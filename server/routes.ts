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

  // Dashboard endpoints
  
  // User dashboard - get reports by user
  app.get("/api/dashboard/user/:userId", async (req, res) => {
    try {
      const reports = await storage.getAllHazardReports();
      const userReports = reports.filter(report => report.userId === req.params.userId);
      res.json(userReports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user dashboard data" });
    }
  });

  // Authorities dashboard - get unreviewed and high urgency reports
  app.get("/api/dashboard/authority", async (req, res) => {
    try {
      const { minUrgency = "7", jurisdiction } = req.query;
      const unreviewedReports = await storage.getUnreviewedReports();
      const highUrgencyReports = await storage.getHazardReportsByUrgency(Number(minUrgency));
      
      let filteredReports = unreviewedReports;
      if (jurisdiction) {
        filteredReports = unreviewedReports.filter(report => 
          report.location?.toLowerCase().includes(jurisdiction.toString().toLowerCase())
        );
      }
      
      res.json({
        unreviewedReports: filteredReports,
        highUrgencyReports,
        totalUnreviewed: filteredReports.length,
        totalHighUrgency: highUrgencyReports.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch authority dashboard data" });
    }
  });

  // Volunteers dashboard - get assigned reports and available tasks
  app.get("/api/dashboard/volunteer/:volunteerId", async (req, res) => {
    try {
      const volunteerId = req.params.volunteerId;
      const assignedReports = await storage.getReportsAssignedToVolunteer(volunteerId);
      const unreviewedReports = await storage.getUnreviewedReports();
      const availableTasks = unreviewedReports.filter(report => 
        !report.assignedVolunteers?.length || report.assignedVolunteers.length === 0
      );
      
      res.json({
        assignedReports,
        availableTasks: availableTasks.slice(0, 10), // Limit to 10 available tasks
        totalAssigned: assignedReports.length,
        totalAvailable: availableTasks.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch volunteer dashboard data" });
    }
  });

  // Filtering endpoints
  
  // Get reports by urgency score
  app.get("/api/hazard-reports/urgency/:minScore", async (req, res) => {
    try {
      const minScore = Number(req.params.minScore);
      if (isNaN(minScore) || minScore < 1 || minScore > 10) {
        return res.status(400).json({ message: "Invalid urgency score. Must be between 1-10" });
      }
      const reports = await storage.getHazardReportsByUrgency(minScore);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports by urgency" });
    }
  });

  // Get reports by trust score
  app.get("/api/hazard-reports/trust/:minScore", async (req, res) => {
    try {
      const minScore = Number(req.params.minScore);
      if (isNaN(minScore) || minScore < 1 || minScore > 10) {
        return res.status(400).json({ message: "Invalid trust score. Must be between 1-10" });
      }
      const reports = await storage.getHazardReportsByTrustScore(minScore);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports by trust score" });
    }
  });

  // Get geo-tagged social posts
  app.get("/api/social-posts/geo-tagged", async (_req, res) => {
    try {
      const posts = await storage.getGeoTaggedPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch geo-tagged posts" });
    }
  });

  // Get social posts by urgency
  app.get("/api/social-posts/urgency/:minScore", async (req, res) => {
    try {
      const minScore = Number(req.params.minScore);
      if (isNaN(minScore) || minScore < 1 || minScore > 10) {
        return res.status(400).json({ message: "Invalid urgency score. Must be between 1-10" });
      }
      const posts = await storage.getSocialPostsByUrgency(minScore);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by urgency" });
    }
  });

  // Get social posts by trust score
  app.get("/api/social-posts/trust/:minScore", async (req, res) => {
    try {
      const minScore = Number(req.params.minScore);
      if (isNaN(minScore) || minScore < 1 || minScore > 10) {
        return res.status(400).json({ message: "Invalid trust score. Must be between 1-10" });
      }
      const posts = await storage.getSocialPostsByTrustScore(minScore);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by trust score" });
    }
  });

  // Management endpoints
  
  // Assign volunteer to report
  app.post("/api/hazard-reports/:reportId/assign/:volunteerId", async (req, res) => {
    try {
      const { reportId, volunteerId } = req.params;
      const updatedReport = await storage.assignVolunteerToReport(reportId, volunteerId);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to assign volunteer" });
    }
  });

  // Update trust score
  app.patch("/api/hazard-reports/:reportId/trust-score", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { trustScore } = req.body;
      
      if (typeof trustScore !== 'number' || trustScore < 1 || trustScore > 10) {
        return res.status(400).json({ message: "Trust score must be a number between 1-10" });
      }
      
      const updatedReport = await storage.updateReportTrustScore(reportId, trustScore);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trust score" });
    }
  });

  // Update urgency score
  app.patch("/api/hazard-reports/:reportId/urgency-score", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { urgencyScore } = req.body;
      
      if (typeof urgencyScore !== 'number' || urgencyScore < 1 || urgencyScore > 10) {
        return res.status(400).json({ message: "Urgency score must be a number between 1-10" });
      }
      
      const updatedReport = await storage.updateReportUrgencyScore(reportId, urgencyScore);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to update urgency score" });
    }
  });

  // Mark report as reviewed by authority
  app.post("/api/hazard-reports/:reportId/mark-reviewed", async (req, res) => {
    try {
      const { reportId } = req.params;
      const updatedReport = await storage.markReportAsReviewed(reportId);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark report as reviewed" });
    }
  });

  // Get users by role
  app.get("/api/users/role/:role", async (req, res) => {
    try {
      const { role } = req.params;
      if (!['user', 'authority', 'volunteer'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be user, authority, or volunteer" });
      }
      const users = await storage.getUsersByRole(role);
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users by role" });
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
