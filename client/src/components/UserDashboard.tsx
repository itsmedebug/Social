import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HazardReport } from "@shared/schema";

// Mock current user ID - in a real app this would come from auth context
const CURRENT_USER_ID = "user-1";

interface TrustScoreDisplayProps {
  score: number | null;
}

function TrustScoreDisplay({ score }: TrustScoreDisplayProps) {
  if (!score) return <span className="text-muted-foreground">N/A</span>;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <span className={`font-medium ${getScoreColor(score)}`}>
      {score.toFixed(1)}/10
    </span>
  );
}

interface UrgencyBadgeProps {
  score: number | null;
}

function UrgencyBadge({ score }: UrgencyBadgeProps) {
  if (!score) return <Badge variant="secondary">Unknown</Badge>;
  
  if (score >= 8) return <Badge variant="destructive">Critical</Badge>;
  if (score >= 6) return <Badge variant="default">High</Badge>;
  if (score >= 4) return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

export default function UserDashboard() {
  const { data: userReports, isLoading, error } = useQuery<HazardReport[]>({
    queryKey: ['/api/dashboard/user', CURRENT_USER_ID],
  });

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="dashboard-loading">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" data-testid="dashboard-error">
        <p className="text-destructive">Failed to load dashboard data</p>
      </div>
    );
  }

  const reports = userReports || [];
  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.verified).length;
  const averageTrustScore = reports.length > 0 
    ? reports.reduce((sum, r) => sum + (r.trustScore || 0), 0) / reports.length 
    : 0;

  return (
    <div className="space-y-6" data-testid="user-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
          My Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your contributions to ocean safety
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-total-reports">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground" data-testid="text-total-reports">
              {totalReports}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hazard reports submitted
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-verified-reports">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-verified-reports">
              {verifiedReports}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Authority verified
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-trust-score">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-trust-score">
              <TrustScoreDisplay score={averageTrustScore} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Community reliability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card data-testid="card-recent-reports">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-accent"></i>
            Recent Reports
          </CardTitle>
          <CardDescription>
            Your latest hazard reports and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-reports">
              <i className="fas fa-clipboard-list text-4xl mb-4 opacity-50"></i>
              <p>No reports submitted yet</p>
              <p className="text-sm">Submit your first hazard report to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="border border-border rounded-lg p-4" data-testid={`report-${report.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground" data-testid={`text-location-${report.id}`}>
                          {report.location}
                        </h3>
                        {report.verified && (
                          <Badge variant="default" data-testid={`badge-verified-${report.id}`}>
                            <i className="fas fa-check mr-1"></i>
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-time-${report.id}`}>
                        {new Date(report.createdAt!).toLocaleDateString()} at{' '}
                        {new Date(report.createdAt!).toLocaleTimeString()}
                      </p>
                    </div>
                    <UrgencyBadge score={report.urgencyScore} />
                  </div>
                  
                  <p className="text-sm text-foreground mb-3" data-testid={`text-description-${report.id}`}>
                    {report.description.substring(0, 150)}
                    {report.description.length > 150 && '...'}
                  </p>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        Trust Score: <TrustScoreDisplay score={report.trustScore} />
                      </span>
                      <span className="text-muted-foreground">
                        <i className="fas fa-thumbs-up mr-1"></i>
                        {report.likes} likes
                      </span>
                      <span className="text-muted-foreground">
                        <i className="fas fa-comments mr-1"></i>
                        {report.comments} comments
                      </span>
                      {report.geoTagged && (
                        <span className="text-muted-foreground text-xs">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {report.geoTagged && (
                        <button 
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                          data-testid={`button-view-map-${report.id}`}
                          onClick={() => {
                            // In a real app, this would navigate to map view with coordinates
                            console.log('Navigate to map:', report.latitude, report.longitude);
                          }}
                        >
                          <i className="fas fa-map mr-1"></i>
                          View on Map
                        </button>
                      )}
                      {report.assignedVolunteers && report.assignedVolunteers.length > 0 && (
                        <Badge variant="outline" data-testid={`badge-assigned-${report.id}`}>
                          <i className="fas fa-user-check mr-1"></i>
                          Volunteer Assigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}