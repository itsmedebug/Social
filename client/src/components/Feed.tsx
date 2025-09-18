import { useQuery } from "@tanstack/react-query";
import UploadForm from "./UploadForm";
import { HazardReport } from "@shared/schema";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours === 0) return "Just now";
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-accent text-accent-foreground";
    case "medium":
      return "bg-primary/20 text-primary";
    case "low":
      return "bg-secondary/20 text-secondary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getRiskLevelIcon(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "🚨";
    case "high":
      return "⚠️";
    case "medium":
      return "🟡";
    case "low":
      return "🟢";
    default:
      return "ℹ️";
  }
}

export default function Feed() {
  const { data: reports = [], isLoading, error } = useQuery<HazardReport[]>({
    queryKey: ['/api/hazard-reports'],
  });

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <i className="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
          <p className="text-destructive font-medium">Failed to load reports</p>
          <p className="text-muted-foreground text-sm mt-1">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <UploadForm />
      
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden animate-pulse">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-80 bg-muted"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <article key={report.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" data-testid={`report-${report.id}`}>
              {/* Post Header */}
              <div className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
                      alt={`${report.username} Profile`}
                      className="w-10 h-10 rounded-full"
                      data-testid={`avatar-${report.id}`}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{report.username}</h3>
                        {report.verified && (
                          <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        )}
                        {!report.verified && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(report.createdAt!)} • {report.location}
                      </p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`menu-${report.id}`}>
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-foreground mb-3">{report.description}</p>
                
                {/* Location Info */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                  <i className="fas fa-map-marker-alt text-accent"></i>
                  <span>{report.latitude.toFixed(3)}°N, {report.longitude.toFixed(3)}°E</span>
                  <span>•</span>
                  <span>{report.location}</span>
                </div>
              </div>

              {/* Media Content */}
              {report.media && (
                <div className="relative">
                  {report.mediaType === 'image' ? (
                    <img 
                      src={report.media}
                      alt="Hazard report"
                      className="w-full h-80 object-cover"
                      data-testid={`media-${report.id}`}
                    />
                  ) : (
                    <video 
                      src={report.media}
                      className="w-full h-80 object-cover"
                      controls
                      data-testid={`media-${report.id}`}
                    />
                  )}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(report.riskLevel || 'medium')}`}>
                    {getRiskLevelIcon(report.riskLevel || 'medium')} {(report.riskLevel?.charAt(0).toUpperCase() + (report.riskLevel?.slice(1) || '')) || 'Medium'} Risk
                  </div>
                </div>
              )}

              {/* Engagement Actions */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      className="flex items-center space-x-2 text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`like-${report.id}`}
                    >
                      <i className="far fa-heart"></i>
                      <span className="text-sm">{report.likes}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`comment-${report.id}`}
                    >
                      <i className="far fa-comment"></i>
                      <span className="text-sm">{report.comments}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`share-${report.id}`}
                    >
                      <i className="far fa-share-square"></i>
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <button 
                    className="text-muted-foreground hover:text-accent transition-colors"
                    data-testid={`bookmark-${report.id}`}
                  >
                    <i className="far fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
