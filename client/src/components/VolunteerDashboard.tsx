import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { HazardReport } from "@shared/schema";

// Mock current volunteer ID - in a real app this would come from auth context
const CURRENT_VOLUNTEER_ID = "user-2";

interface VolunteerDashboardData {
  assignedReports: HazardReport[];
  availableTasks: HazardReport[];
  totalAssigned: number;
  totalAvailable: number;
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

export default function VolunteerDashboard() {
  const { toast } = useToast();

  const { data: dashboardData, isLoading, error } = useQuery<VolunteerDashboardData>({
    queryKey: ['/api/dashboard/volunteer', CURRENT_VOLUNTEER_ID],
  });

  const assignMyselfMutation = useMutation({
    mutationFn: (reportId: string) => 
      apiRequest('POST', `/api/hazard-reports/${reportId}/assign/${CURRENT_VOLUNTEER_ID}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/volunteer'] });
      toast({
        title: "Task Assigned",
        description: "You have been assigned to this incident report.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign task.",
        variant: "destructive",
      });
    },
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
        <p className="text-destructive">Failed to load volunteer dashboard data</p>
      </div>
    );
  }

  const data = dashboardData!;

  const handleAssignMyself = (reportId: string) => {
    assignMyselfMutation.mutate(reportId);
  };

  return (
    <div className="space-y-6" data-testid="volunteer-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
          Volunteer Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Coordinate response efforts and assist with ocean safety incidents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-assigned-tasks">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-assigned-count">
              {data.totalAssigned}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active assignments
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-available-tasks">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent" data-testid="text-available-count">
              {data.totalAvailable}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unassigned incidents
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-response-rank">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-response-rank">
              #12
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In Tamil Nadu region
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="assigned" data-testid="tabs-tasks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned" data-testid="tab-assigned">
            My Assignments ({data.totalAssigned})
          </TabsTrigger>
          <TabsTrigger value="available" data-testid="tab-available">
            Available Tasks ({data.totalAvailable})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-6">
          <Card data-testid="card-assigned-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-tasks text-primary"></i>
                My Assigned Tasks
              </CardTitle>
              <CardDescription>
                Incident reports currently assigned to you for response coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.assignedReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-assigned">
                  <i className="fas fa-clipboard-list text-4xl mb-4 opacity-50"></i>
                  <p>No tasks currently assigned</p>
                  <p className="text-sm">Check available tasks to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.assignedReports.map((report) => (
                    <div key={report.id} className="border border-primary/20 bg-primary/5 rounded-lg p-4" data-testid={`assigned-report-${report.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground" data-testid={`text-location-${report.id}`}>
                              {report.location}
                            </h3>
                            <UrgencyBadge score={report.urgencyScore} />
                            {report.verified && (
                              <Badge variant="default" data-testid={`badge-verified-${report.id}`}>
                                <i className="fas fa-check mr-1"></i>
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By {report.username} • {new Date(report.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="default" data-testid={`badge-assigned-${report.id}`}>
                          <i className="fas fa-user-check mr-1"></i>
                          Assigned to Me
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3" data-testid={`text-description-${report.id}`}>
                        {report.description}
                      </p>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            Trust Score: <TrustScoreDisplay score={report.trustScore} />
                          </span>
                          <span className="text-muted-foreground">
                            Risk Level: <Badge variant="outline">{report.riskLevel}</Badge>
                          </span>
                          <span className="text-muted-foreground">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" data-testid={`button-contact-${report.id}`}>
                            <i className="fas fa-phone mr-1"></i>
                            Contact Reporter
                          </Button>
                          <Button size="sm" data-testid={`button-update-${report.id}`}>
                            <i className="fas fa-edit mr-1"></i>
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <Card data-testid="card-available-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-clipboard-list text-accent"></i>
                Available Tasks
              </CardTitle>
              <CardDescription>
                Unassigned incident reports that need volunteer coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.availableTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-available">
                  <i className="fas fa-check-circle text-4xl mb-4 opacity-50"></i>
                  <p>All tasks are currently assigned</p>
                  <p className="text-sm">Great teamwork! Check back later for new incidents.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.availableTasks.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-4" data-testid={`available-report-${report.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground" data-testid={`text-location-${report.id}`}>
                              {report.location}
                            </h3>
                            <UrgencyBadge score={report.urgencyScore} />
                            {report.verified && (
                              <Badge variant="default">
                                <i className="fas fa-check mr-1"></i>
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By {report.username} • {new Date(report.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAssignMyself(report.id)}
                          disabled={assignMyselfMutation.isPending}
                          data-testid={`button-assign-${report.id}`}
                        >
                          <i className="fas fa-hand-paper mr-1"></i>
                          Assign to Me
                        </Button>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3" data-testid={`text-description-${report.id}`}>
                        {report.description.substring(0, 200)}
                        {report.description.length > 200 && '...'}
                      </p>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            Trust Score: <TrustScoreDisplay score={report.trustScore} />
                          </span>
                          <span className="text-muted-foreground">
                            Urgency: <span className="font-medium">{report.urgencyScore?.toFixed(1)}/10</span>
                          </span>
                          <span className="text-muted-foreground">
                            <i className="fas fa-clock mr-1"></i>
                            {new Date(report.createdAt!).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <i className="fas fa-map-marker-alt"></i>
                          <span className="text-xs">
                            {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-bolt text-accent"></i>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16" data-testid="button-emergency-contact">
              <div className="text-center">
                <i className="fas fa-phone-alt text-lg mb-1"></i>
                <div className="text-xs">Emergency Contact</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16" data-testid="button-weather-update">
              <div className="text-center">
                <i className="fas fa-cloud-sun text-lg mb-1"></i>
                <div className="text-xs">Weather Update</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16" data-testid="button-resource-request">
              <div className="text-center">
                <i className="fas fa-shipping-fast text-lg mb-1"></i>
                <div className="text-xs">Request Resources</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}