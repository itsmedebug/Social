import { type User, type InsertUser, type HazardReport, type InsertHazardReport, type SocialPost, type InsertSocialPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllHazardReports(): Promise<HazardReport[]>;
  getHazardReport(id: string): Promise<HazardReport | undefined>;
  createHazardReport(report: InsertHazardReport): Promise<HazardReport>;
  getAllSocialPosts(): Promise<SocialPost[]>;
  getSocialPost(id: string): Promise<SocialPost | undefined>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private hazardReports: Map<string, HazardReport>;
  private socialPosts: Map<string, SocialPost>;

  constructor() {
    this.users = new Map();
    this.hazardReports = new Map();
    this.socialPosts = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const users = [
      {
        id: "user-1",
        username: "Alice Chen",
        password: "password",
        profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
        verified: true,
        communityPoints: 245,
        role: "user",
        organizationId: null,
        jurisdiction: null,
      },
      {
        id: "user-2",
        username: "Bob Kumar",
        password: "password",
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
        verified: false,
        communityPoints: 180,
        role: "volunteer",
        organizationId: "vols-india-1",
        jurisdiction: "Tamil Nadu",
      },
      {
        id: "user-3",
        username: "Captain Sarah Nair",
        password: "password",
        profilePic: "https://images.unsplash.com/photo-1594736797933-d0a5ba1cdeed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
        verified: true,
        communityPoints: 850,
        role: "authority",
        organizationId: "coast-guard-india",
        jurisdiction: "Western Coast",
      }
    ];

    users.forEach(user => this.users.set(user.id, user));

    // Sample hazard reports
    const reports = [
      {
        id: "report-1",
        userId: "user-1",
        username: "Alice Chen",
        description: "🌊 High waves and strong currents observed near Marina Beach. Water level rising rapidly. Fishing boats advised to return to shore immediately. Local authorities have been notified.",
        media: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        mediaType: "image",
        latitude: 13.045,
        longitude: 80.273,
        location: "Marina Beach, Chennai",
        geoTagged: true,
        verified: true,
        riskLevel: "high",
        urgencyScore: 8.5,
        trustScore: 9.2,
        likes: 24,
        comments: 8,
        assignedVolunteers: ["user-2"],
        authorityReviewed: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "report-2",
        userId: "user-2",
        username: "Bob Kumar",
        description: "🚨 Coastal flooding reported in low-lying areas near Kochi port. Water entering residential areas. Emergency services dispatched. Residents advised to move to higher ground.",
        media: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        mediaType: "image",
        latitude: 9.931,
        longitude: 76.267,
        location: "Fort Kochi, Kerala",
        geoTagged: true,
        verified: false,
        riskLevel: "critical",
        urgencyScore: 9.8,
        trustScore: 7.1,
        likes: 18,
        comments: 12,
        assignedVolunteers: [],
        authorityReviewed: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      }
    ];

    reports.forEach(report => this.hazardReports.set(report.id, report));

    // Sample social posts
    const socialPosts = [
      {
        id: "social-1",
        platform: "twitter",
        username: "@OceanWatcher",
        description: "🌊 TSUNAMI WARNING: Bay of Bengal - Magnitude 7.2 earthquake detected. Coastal areas from Tamil Nadu to Andhra Pradesh should prepare for evacuation if needed. Stay tuned for official updates. #TsunamiAlert #BayOfBengal",
        media: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
        sentiment: "alert",
        latitude: 13.0827,
        longitude: 80.2707,
        location: "Bay of Bengal, Tamil Nadu",
        geoTagged: true,
        trustScore: 9.5,
        urgencyScore: 10.0,
        likes: 1200,
        shares: 856,
        comments: 234,
        views: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: "social-2",
        platform: "youtube",
        username: "Marine Weather Service",
        description: "📊 Weekly Ocean Conditions Report - Indian Ocean | Storm systems tracking, wave heights, and fishing safety guidelines for coastal regions",
        media: "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
        sentiment: "neutral",
        latitude: null,
        longitude: null,
        location: null,
        geoTagged: false,
        trustScore: 8.7,
        urgencyScore: 4.0,
        likes: 892,
        shares: 0,
        comments: 67,
        views: 15600,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: "social-3",
        platform: "reddit",
        username: "u/MarineBiologist",
        description: "🐠 Amazing recovery of coral reefs near Lakshadweep! Water quality has improved significantly over the past year. Great news for marine biodiversity and fishing communities.",
        media: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
        sentiment: "positive",
        latitude: 10.5667,
        longitude: 72.6417,
        location: "Lakshadweep Islands",
        geoTagged: true,
        trustScore: 7.8,
        urgencyScore: 2.0,
        likes: 847,
        shares: 23,
        comments: 156,
        views: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      }
    ];

    socialPosts.forEach(post => this.socialPosts.set(post.id, post));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      profilePic: insertUser.profilePic ?? null,
      verified: insertUser.verified ?? null,
      communityPoints: insertUser.communityPoints ?? null,
      role: insertUser.role ?? null,
      organizationId: insertUser.organizationId ?? null,
      jurisdiction: insertUser.jurisdiction ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllHazardReports(): Promise<HazardReport[]> {
    return Array.from(this.hazardReports.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getHazardReport(id: string): Promise<HazardReport | undefined> {
    return this.hazardReports.get(id);
  }

  async createHazardReport(insertReport: InsertHazardReport): Promise<HazardReport> {
    const id = randomUUID();
    const report: HazardReport = { 
      ...insertReport, 
      id, 
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      verified: false,
      media: insertReport.media ?? null,
      mediaType: insertReport.mediaType ?? null,
      location: insertReport.location ?? null,
      riskLevel: insertReport.riskLevel ?? null,
      geoTagged: insertReport.geoTagged ?? null,
      urgencyScore: insertReport.urgencyScore ?? null,
      trustScore: insertReport.trustScore ?? null,
      assignedVolunteers: insertReport.assignedVolunteers ?? null,
      authorityReviewed: insertReport.authorityReviewed ?? null
    };
    this.hazardReports.set(id, report);
    return report;
  }

  async getAllSocialPosts(): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSocialPost(id: string): Promise<SocialPost | undefined> {
    return this.socialPosts.get(id);
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const id = randomUUID();
    const post: SocialPost = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      media: insertPost.media ?? null,
      likes: insertPost.likes ?? null,
      comments: insertPost.comments ?? null,
      shares: insertPost.shares ?? null,
      views: insertPost.views ?? null,
      latitude: insertPost.latitude ?? null,
      longitude: insertPost.longitude ?? null,
      location: insertPost.location ?? null,
      geoTagged: insertPost.geoTagged ?? null,
      trustScore: insertPost.trustScore ?? null,
      urgencyScore: insertPost.urgencyScore ?? null
    };
    this.socialPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
