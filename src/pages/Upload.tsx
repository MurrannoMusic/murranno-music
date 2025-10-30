import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload as UploadIcon, X, Music, Image as ImageIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { AvatarDropdown } from "@/components/layout/AvatarDropdown";
import { GenreSelector } from "@/components/forms/GenreSelector";
import { DynamicTextField } from "@/components/forms/DynamicTextField";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useCamera } from "@/hooks/useCamera";
import { useHaptics } from "@/hooks/useHaptics";
import { useLocalNotifications } from "@/hooks/useLocalNotifications";
import { supabase } from "@/integrations/supabase/client";
import { validateAudioFile, validateImageFile, getAudioDuration } from "@/utils/fileValidation";
import { formatFileSize } from "@/utils/formatters";
import { isNativeApp } from "@/utils/platformDetection";

// Upload page component
export default function Upload() {
  const navigate = useNavigate();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverArtInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, uploadAudio, uploading, progress } = useCloudinaryUpload();
  const { takePhoto, pickFromGallery, isCapturing } = useCamera();
  const { success: hapticSuccess, error: hapticError } = useHaptics();
  const { scheduleTrackUploadComplete } = useLocalNotifications();
  
  // File states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackTitle, setTrackTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState("");
  const [featuredArtists, setFeaturedArtists] = useState<string[]>([]);
  const [labelName, setLabelName] = useState("");
  const [trackType, setTrackType] = useState<"clean" | "explicit">("clean");
  const [producers, setProducers] = useState<string[]>([]);
  const [songwriters, setSongwriters] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [songDescription, setSongDescription] = useState("");

  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const duration = await getAudioDuration(file);
      setAudioDuration(duration);
      setAudioFile(file);
      toast.success("Audio file selected");
    } catch (error) {
      toast.error("Failed to load audio file");
    }
  };

  const handleCoverArtSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setCoverArtFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCoverArtPreview(previewUrl);
    toast.success("Cover art selected");
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setAudioDuration(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const removeCoverArt = () => {
    setCoverArtFile(null);
    if (coverArtPreview) URL.revokeObjectURL(coverArtPreview);
    setCoverArtPreview(null);
    if (coverArtInputRef.current) coverArtInputRef.current.value = "";
  };

  const handleTakePhoto = async () => {
    const file = await takePhoto();
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      setCoverArtFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverArtPreview(previewUrl);
      toast.success("Photo captured");
    }
  };

  const handlePickFromGallery = async () => {
    const file = await pickFromGallery();
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      setCoverArtFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverArtPreview(previewUrl);
      toast.success("Image selected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    if (!trackTitle || !artistName || !releaseDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedGenres.length === 0 && !customGenre) {
      toast.error("Please select or enter a genre");
      return;
    }

    await uploadTrack();
  };

  const uploadTrack = async () => {
    setIsSubmitting(true);
    setUploadError(null);

    try {
      // Get user's artist profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: artistProfile } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!artistProfile) throw new Error("Artist profile not found");

      // Upload cover art if provided
      let coverArtUrl = null;
      if (coverArtFile) {
        toast.info("Uploading cover art...");
        try {
          const coverResult = await uploadImage(coverArtFile, 'cover-art');
          coverArtUrl = coverResult.url;
        } catch (error) {
          throw new Error("Failed to upload cover art");
        }
      }

      // Upload audio file
      toast.info("Uploading audio file...");
      let audioResult;
      try {
        audioResult = await uploadAudio(audioFile!, 'tracks');
      } catch (error) {
        throw new Error("Failed to upload audio file");
      }

      // Prepare data for edge function
      const finalGenre = customGenre || selectedGenres[0];
      const releaseData = {
        title: trackTitle,
        type: 'Single',
        releaseDate,
        genre: finalGenre,
        label: labelName || null,
        language: 'English'
      };

      const trackData = {
        title: trackTitle,
        duration: audioDuration || 0,
        featuredArtists,
        producers,
        songwriters,
        trackType,
        description: songDescription
      };

      // Call upload-track edge function
      toast.info("Creating release...");
      const { data, error } = await supabase.functions.invoke('upload-track', {
        body: {
          releaseData,
          tracks: [trackData],
          coverArtFile: coverArtUrl ? { url: coverArtUrl } : null,
          audioFiles: [{ url: audioResult.url }]
        }
      });

      if (error) throw error;

      // Success haptics and notification
      hapticSuccess();
      await scheduleTrackUploadComplete(trackTitle);
      
      toast.success("Track uploaded successfully!");
      
      // Redirect to releases page after 1 second
      setTimeout(() => {
        navigate('/app/releases');
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Error haptics
      hapticError();
      
      setUploadError(error.message || 'Failed to upload track');
      toast.error(error.message || 'Failed to upload track');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    uploadTrack();
  };

  const isFormValid = audioFile && trackTitle && artistName && releaseDate && 
    (selectedGenres.length > 0 || customGenre);

  return (
    <PageContainer>
      <div className="min-h-screen bg-background p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Badge variant="outline" className="text-sm">UPLOAD</Badge>
          </div>
          <AvatarDropdown />
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Audio File Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Audio File</h3>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioSelect}
              className="hidden"
            />
            
            {!audioFile ? (
              <Button
                type="button"
                variant="outline"
                className="w-full h-32 border-dashed"
                onClick={() => audioInputRef.current?.click()}
                disabled={uploading || isSubmitting}
              >
                <div className="flex flex-col items-center gap-2">
                  <Music className="h-8 w-8 text-muted-foreground" />
                  <span>Select Audio File</span>
                  <span className="text-xs text-muted-foreground">MP3, WAV, FLAC (Max 100MB)</span>
                </div>
              </Button>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(audioFile.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeAudioFile}
                  disabled={uploading || isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Cover Art Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Artwork</h3>
            <input
              ref={coverArtInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverArtSelect}
              className="hidden"
            />
            
            {!coverArtFile ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-dashed"
                  onClick={() => coverArtInputRef.current?.click()}
                  disabled={uploading || isSubmitting || isCapturing}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span>Select Cover Art</span>
                    <span className="text-xs text-muted-foreground">JPG, PNG, WEBP (Recommended: 3000x3000px)</span>
                  </div>
                </Button>
                {isNativeApp() && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleTakePhoto}
                      disabled={uploading || isSubmitting || isCapturing}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handlePickFromGallery}
                      disabled={uploading || isSubmitting || isCapturing}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Gallery
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {coverArtPreview && (
                    <img src={coverArtPreview} alt="Cover preview" className="w-16 h-16 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{coverArtFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(coverArtFile.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeCoverArt}
                  disabled={uploading || isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Track Information */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Track Information</h3>
            
            <div>
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="Enter track title"
                disabled={uploading || isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Enter artist name"
                disabled={uploading || isSubmitting}
                required
              />
            </div>

            <GenreSelector
              primaryGenre={selectedGenres[0] || ""}
              secondaryGenre={selectedGenres[1] || ""}
              customPrimaryGenre={customGenre}
              customSecondaryGenre=""
              onPrimaryGenreChange={(value) => setSelectedGenres([value, selectedGenres[1] || ""])}
              onSecondaryGenreChange={(value) => setSelectedGenres([selectedGenres[0] || "", value])}
              onCustomPrimaryGenreChange={setCustomGenre}
              onCustomSecondaryGenreChange={() => {}}
            />

            <DynamicTextField
              label="Featured Artists"
              values={featuredArtists}
              onChange={setFeaturedArtists}
              placeholder="Add featured artist"
              disabled={uploading || isSubmitting}
            />

            <div>
              <Label htmlFor="label">Label Name</Label>
              <Input
                id="label"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                placeholder="Enter label name (optional)"
                disabled={uploading || isSubmitting}
              />
            </div>

            <div>
              <Label>Track Type</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={trackType === "clean" ? "default" : "outline"}
                  onClick={() => setTrackType("clean")}
                  disabled={uploading || isSubmitting}
                >
                  Clean
                </Button>
                <Button
                  type="button"
                  variant={trackType === "explicit" ? "default" : "outline"}
                  onClick={() => setTrackType("explicit")}
                  disabled={uploading || isSubmitting}
                >
                  Explicit
                </Button>
              </div>
            </div>

            <DynamicTextField
              label="Producers"
              values={producers}
              onChange={setProducers}
              placeholder="Add producer"
              disabled={uploading || isSubmitting}
            />

            <DynamicTextField
              label="Songwriters"
              values={songwriters}
              onChange={setSongwriters}
              placeholder="Add songwriter"
              disabled={uploading || isSubmitting}
            />

            <div>
              <Label htmlFor="releaseDate">Release Date *</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                disabled={uploading || isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Song Description</Label>
              <Textarea
                id="description"
                value={songDescription}
                onChange={(e) => setSongDescription(e.target.value)}
                placeholder="Tell us about your track..."
                disabled={uploading || isSubmitting}
              />
            </div>
          </Card>

          {/* Upload Progress */}
          {uploading && (
            <Card className="p-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </span>
                  <span className="font-bold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </Card>
          )}

          {/* Upload Error */}
          {uploadError && (
            <Card className="p-6 bg-destructive/10 border-destructive/30 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-destructive">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-destructive mb-1">Upload Failed</p>
                    <p className="text-sm text-muted-foreground">{uploadError}</p>
                    {retryCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Retry attempt: {retryCount}</p>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/20"
                  disabled={isSubmitting}
                >
                  Retry Upload
                </Button>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full h-12 text-lg shadow-primary hover:shadow-glow transition-all duration-200"
              disabled={!isFormValid || uploading || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {uploading ? `Uploading... ${progress}%` : 'Processing...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Submit for Review
                </span>
              )}
            </Button>
            
            {!isFormValid && audioFile && (
              <p className="text-xs text-center text-muted-foreground">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
