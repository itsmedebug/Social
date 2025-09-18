import { HazardReport, SocialPost, User } from "@shared/schema";

export const sampleUsers: User[] = [
  {
    id: "user-1",
    username: "Alice Chen",
    password: "password",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    verified: true,
    communityPoints: 245,
  },
  {
    id: "user-2",
    username: "Bob Kumar", 
    password: "password",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    verified: false,
    communityPoints: 180,
  }
];

export const sampleReports: HazardReport[] = [
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
    verified: true,
    riskLevel: "high",
    likes: 24,
    comments: 8,
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
    verified: false,
    riskLevel: "critical",
    likes: 18,
    comments: 12,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  }
];

export const sampleSocialPosts: SocialPost[] = [
  {
    id: "social-1",
    platform: "twitter",
    username: "@OceanWatcher",
    description: "🌊 TSUNAMI WARNING: Bay of Bengal - Magnitude 7.2 earthquake detected. Coastal areas from Tamil Nadu to Andhra Pradesh should prepare for evacuation if needed. Stay tuned for official updates. #TsunamiAlert #BayOfBengal",
    media: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
    sentiment: "alert",
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
    likes: 847,
    shares: 23,
    comments: 156,
    views: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  }
];
