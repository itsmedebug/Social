import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { HazardReport } from "@shared/schema";

interface AuthorityDashboardData {
  unreviewedReports: HazardReport[];
  highUrgencyReports: HazardReport[];
  totalUnreviewed: number;
  totalHighUrgency: number;
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

export default function AuthorityDashboard() {
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const { toast } = useToast();

  const { data: dashboardData, isLoading, error } = useQuery<AuthorityDashboardData>({
    queryKey: ['/api/dashboard/authority', ...(jurisdictionFilter ? ['?jurisdiction=' + jurisdictionFilter] : [])],
  });

  const markReviewedMutation = useMutation({
    mutationFn: (reportId: string) => 
      apiRequest('POST', `/api/hazard-reports/${reportId}/mark-reviewed`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/authority'] });
      toast({
        title: "Report Reviewed",
        description: "The report has been marked as reviewed by authority.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark report as reviewed.",
        variant: "destructive",
      });
    },
  });

  const updateTrustScoreMutation = useMutation({
    mutationFn: ({ reportId, trustScore }: { reportId: string; trustScore: number }) =>
      apiRequest('PATCH', `/api/hazard-reports/${reportId}/trust-score`, { trustScore }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/authority'] });
      toast({
        title: "Trust Score Updated",
        description: "The report trust score has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update trust score.",
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
        <p className="text-destructive">Failed to load authority dashboard data</p>
      </div>
    );
  }

  const data = dashboardData!;

  const handleMarkReviewed = (reportId: string) => {
    markReviewedMutation.mutate(reportId);
  };

  const handleUpdateTrustScore = (reportId: string, score: number) => {
    updateTrustScoreMutation.mutate({ reportId, trustScore: score });
  };

  return (
    <div className="space-y-6" data-testid="authority-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
          Authority Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and review hazard reports for your jurisdiction
        </p>
      </div>

      {/* Filter Controls */}
      <Card data-testid="card-filters">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Filter by jurisdiction (e.g., Chennai, Kerala)"
                value={jurisdictionFilter}
                onChange={(e) => setJurisdictionFilter(e.target.value)}
                data-testid="input-jurisdiction"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setJurisdictionFilter("")}
              data-testid="button-clear-filters"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-unreviewed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unreviewed Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-unreviewed-count">
              {data.totalUnreviewed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-high-urgency">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Urgency Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent" data-testid="text-high-urgency-count">
              {data.totalHighUrgency}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Priority incidents
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-response-time">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-response-time">
              2.5h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Authority review time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="unreviewed" data-testid="tabs-reports">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unreviewed" data-testid="tab-unreviewed">
            Unreviewed Reports ({data.totalUnreviewed})
          </TabsTrigger>
          <TabsTrigger value="high-urgency" data-testid="tab-high-urgency">
            High Urgency ({data.totalHighUrgency})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unreviewed" className="mt-6">
          <Card data-testid="card-unreviewed-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-clipboard-check text-destructive"></i>
                Unreviewed Reports
              </CardTitle>
              <CardDescription>
                Reports pending authority review and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.unreviewedReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-unreviewed">
                  <i className="fas fa-check-circle text-4xl mb-4 opacity-50"></i>
                  <p>All reports have been reviewed</p>
                  <p className="text-sm">Great work staying on top of incidents!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.unreviewedReports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-4" data-testid={`unreviewed-report-${report.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground" data-testid={`text-location-${report.id}`}>
                              {report.location}
                            </h3>
                            <UrgencyBadge score={report.urgencyScore} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By {report.username} • {new Date(report.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleMarkReviewed(report.id)}
                            disabled={markReviewedMutation.isPending}
                            data-testid={`button-review-${report.id}`}
                          >
                            <i className="fas fa-check mr-1"></i>
                            Mark Reviewed
                          </Button>
                        </div>
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
                        </div>
                        <div className="flex gap-2">
                          {[6, 7, 8, 9].map((score) => (
                            <Button
                              key={score}
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateTrustScore(report.id, score)}
                              disabled={updateTrustScoreMutation.isPending}
                              data-testid={`button-trust-${score}-${report.id}`}
                            >
                              {score}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high-urgency" className="mt-6">
          <Card data-testid="card-high-urgency-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-accent"></i>
                High Urgency Reports
              </CardTitle>
              <CardDescription>
                Critical incidents requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.highUrgencyReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-high-urgency">
                  <i className="fas fa-shield-check text-4xl mb-4 opacity-50"></i>
                  <p>No high urgency reports</p>
                  <p className="text-sm">Current situation is under control</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.highUrgencyReports.map((report) => (
                    <div key={report.id} className="border border-accent/20 bg-accent/5 rounded-lg p-4" data-testid={`high-urgency-report-${report.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">
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
                      </div>
                      
                      <p className="text-sm text-foreground mb-3">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            Trust Score: <TrustScoreDisplay score={report.trustScore} />
                          </span>
                          <span className="text-muted-foreground">
                            Urgency: <span className="font-medium">{report.urgencyScore?.toFixed(1)}/10</span>
                          </span>
                        </div>
                        {report.assignedVolunteers && report.assignedVolunteers.length > 0 && (
                          <Badge variant="outline">
                            <i className="fas fa-user-check mr-1"></i>
                            {report.assignedVolunteers.length} Volunteer(s) Assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}