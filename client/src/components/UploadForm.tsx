import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { apiRequest } from "@/lib/queryClient";
import { InsertHazardReport } from "@shared/schema";

export default function UploadForm() {
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, error: locationError, requestLocation } = useGeolocation();

  const mutation = useMutation({
    mutationFn: async (data: InsertHazardReport) => {
      return await apiRequest("POST", "/api/hazard-reports", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hazard-reports'] });
      setDescription("");
      setSelectedMedia(null);
      setMediaPreview(null);
      toast({
        title: "Report submitted successfully!",
        description: "Your hazard report has been submitted for verification.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationCapture = () => {
    requestLocation();
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for your hazard report.",
        variant: "destructive",
      });
      return;
    }

    // Use current location or generate random coordinates if not available
    const coords = location || {
      latitude: 13.045 + (Math.random() - 0.5) * 0.1,
      longitude: 80.273 + (Math.random() - 0.5) * 0.1,
    };

    const reportData: InsertHazardReport = {
      userId: "user-1", // Current user ID
      username: "Alice Chen", // Current username
      description: description.trim(),
      media: mediaPreview || undefined,
      mediaType: selectedMedia?.type.startsWith('video') ? 'video' : selectedMedia ? 'image' : undefined,
      latitude: coords.latitude,
      longitude: coords.longitude,
      location: "Current Location", // This could be reverse geocoded
      riskLevel: "medium",
    };

    mutation.mutate(reportData);
  };

  return (
    <div id="upload-form" className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-start space-x-3">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <Textarea
            placeholder="Report an ocean hazard in your area..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-muted border border-input rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
            data-testid="description-textarea"
          />
          
          {/* Media Preview */}
          {mediaPreview && (
            <div className="mt-3 relative">
              <img 
                src={mediaPreview} 
                alt="Media preview" 
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedMedia(null);
                  setMediaPreview(null);
                }}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-destructive/90"
                data-testid="remove-media"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Location Status */}
          {location && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center space-x-1">
              <i className="fas fa-map-marker-alt text-secondary"></i>
              <span>Location: {location.latitude.toFixed(3)}°N, {location.longitude.toFixed(3)}°E</span>
            </div>
          )}
          
          {locationError && (
            <div className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Location access denied - random coordinates will be used</span>
            </div>
          )}
          
          {/* Upload Options */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <i className="fas fa-camera"></i>
                <span className="text-sm">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleMediaUpload}
                  data-testid="photo-upload"
                />
              </label>
              <label className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <i className="fas fa-video"></i>
                <span className="text-sm">Video</span>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleMediaUpload}
                  data-testid="video-upload"
                />
              </label>
              <button 
                onClick={handleLocationCapture}
                className="flex items-center space-x-2 text-muted-foreground hover:text-secondary transition-colors"
                data-testid="location-capture"
              >
                <i className="fas fa-map-marker-alt"></i>
                <span className="text-sm">Location</span>
              </button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="submit-report"
            >
              {mutation.isPending ? "Reporting..." : "Report"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
