import { useQuery } from "@tanstack/react-query";
import { SocialPost } from "@shared/schema";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours === 0) return "Just now";
  if (hours === 1) return "1h";
  return `${hours}h`;
}

function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'twitter':
      return 'fab fa-twitter';
    case 'youtube':
      return 'fab fa-youtube';
    case 'reddit':
      return 'fab fa-reddit-alien';
    default:
      return 'fas fa-share';
  }
}

function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'twitter':
      return 'bg-blue-500';
    case 'youtube':
      return 'bg-red-600';
    case 'reddit':
      return 'bg-orange-600';
    default:
      return 'bg-gray-500';
  }
}

function getSentimentBadge(sentiment: string): { color: string; icon: string; label: string } {
  switch (sentiment) {
    case 'alert':
      return { color: 'bg-accent/20 text-accent', icon: 'fas fa-exclamation-triangle', label: 'Alert' };
    case 'positive':
      return { color: 'bg-primary/20 text-primary', icon: 'fas fa-thumbs-up', label: 'Positive' };
    case 'negative':
      return { color: 'bg-destructive/20 text-destructive', icon: 'fas fa-thumbs-down', label: 'Negative' };
    default:
      return { color: 'bg-secondary/20 text-secondary', icon: 'fas fa-info-circle', label: 'Info' };
  }
}

export default function SocialFeed() {
  const { data: posts = [], isLoading, error } = useQuery<SocialPost[]>({
    queryKey: ['/api/social-posts'],
  });

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <i className="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
          <p className="text-destructive font-medium">Failed to load social posts</p>
          <p className="text-muted-foreground text-sm mt-1">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Social Media Ocean Updates</h2>
        <p className="text-muted-foreground mb-6">Real-time social media posts about ocean conditions and hazards</p>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const sentiment = getSentimentBadge(post.sentiment);
              
              return (
                <div key={post.id} className="border border-border rounded-lg p-4" data-testid={`social-post-${post.id}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${getPlatformColor(post.platform)} rounded-full flex items-center justify-center`}>
                      <i className={`${getPlatformIcon(post.platform)} text-white`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-foreground">{post.username}</h4>
                        <span className="text-sm text-muted-foreground">• {formatTimeAgo(post.createdAt!)}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${sentiment.color}`}>
                          <i className={sentiment.icon}></i>
                          <span>{sentiment.label}</span>
                        </div>
                      </div>
                      <p className="text-foreground mb-2">{post.description}</p>
                      
                      {post.media && (
                        <div className="relative mb-2">
                          <img 
                            src={post.media}
                            alt="Social media content"
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          {post.platform === 'youtube' && (
                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                              <i className="fas fa-play text-white text-3xl"></i>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {post.platform === 'twitter' && (
                          <>
                            <span><i className="far fa-heart mr-1"></i>{post.likes}</span>
                            <span><i className="fas fa-retweet mr-1"></i>{post.shares}</span>
                            <span><i className="far fa-comment mr-1"></i>{post.comments}</span>
                          </>
                        )}
                        {post.platform === 'youtube' && (
                          <>
                            <span><i className="far fa-thumbs-up mr-1"></i>{post.likes}</span>
                            <span><i className="far fa-eye mr-1"></i>{post.views?.toLocaleString()} views</span>
                            <span><i className="far fa-comment mr-1"></i>{post.comments}</span>
                          </>
                        )}
                        {post.platform === 'reddit' && (
                          <>
                            <span><i className="fas fa-arrow-up mr-1 text-orange-500"></i>{post.likes}</span>
                            <span><i className="far fa-comment mr-1"></i>{post.comments}</span>
                            <span><i className="fas fa-share mr-1"></i>{post.shares}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
