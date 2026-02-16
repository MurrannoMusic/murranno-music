import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, CheckCircle, XCircle, Music } from 'lucide-react';
import { format } from 'date-fns';
import { ContentStats } from '@/components/admin/ContentStats';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { RejectionDialog } from '@/components/admin/RejectionDialog';
import { AudioPreviewPlayer } from '@/components/admin/AudioPreviewPlayer';
import { AdvancedFilters } from '@/components/admin/AdvancedFilters';
import { MetadataWarnings } from '@/components/admin/MetadataWarnings';
import { useAdminFilters } from '@/hooks/admin/useAdminFilters';
import { useAdminReleases } from '@/hooks/admin/useAdminReleases';
import { AdminRelease, AdminTrack } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

import { AdminEditReleaseDialog } from '@/components/admin/AdminEditReleaseDialog';
import { Pencil } from 'lucide-react';

export default function AdminContent() {
  const {
    page,
    setPage,
    search,
    setSearch,
    filters,
    handleFilterChange,
    resetFilters
  } = useAdminFilters({
    status: 'all',
    genre: 'all',
    releaseType: 'all'
  });

  const {
    releases,
    total,
    totalPages,
    stats,
    isLoading,
    moderateRelease
  } = useAdminReleases({
    page,
    search,
    statusFilter: filters.status,
    genreFilter: filters.genre,
    releaseTypeFilter: filters.releaseType
  });

  const [selectedRelease, setSelectedRelease] = useState<AdminRelease | null>(null);
  const [selectedReleases, setSelectedReleases] = useState<Set<string>>(new Set());
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [releaseToReject, setReleaseToReject] = useState<AdminRelease | null>(null);
  const [releaseToEdit, setReleaseToEdit] = useState<AdminRelease | null>(null);
  const [tracks, setTracks] = useState<AdminTrack[]>([]);
  const queryClient = useQueryClient();

  const handleSelectRelease = (releaseId: string, checked: boolean) => {
    const newSelection = new Set(selectedReleases);
    if (checked) {
      newSelection.add(releaseId);
    } else {
      newSelection.delete(releaseId);
    }
    setSelectedReleases(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(releases.map(r => r.id));
      setSelectedReleases(allIds);
    } else {
      setSelectedReleases(new Set());
    }
  };

  const handleBulkApprove = async () => {
    for (const releaseId of selectedReleases) {
      await moderateRelease.mutateAsync({ releaseId, status: 'Published' });
    }
    toast.success(`Approved ${selectedReleases.size} releases`);
  };

  const handleBulkReject = async () => {
    for (const releaseId of selectedReleases) {
      await moderateRelease.mutateAsync({ releaseId, status: 'Rejected', reason: 'Bulk rejection' });
    }
    toast.success(`Rejected ${selectedReleases.size} releases`);
  };

  const handleRejectWithReason = async (reason: string) => {
    if (releaseToReject) {
      await moderateRelease.mutateAsync({
        releaseId: releaseToReject.id,
        status: 'Rejected',
        reason,
      });
      setRejectionDialogOpen(false);
      setReleaseToReject(null);
    }
  };

  const fetchTracks = async (releaseId: string) => {
    const { data, error } = await supabase
      .from('tracks')
      .select('id, title, audio_file_url')
      .eq('release_id', releaseId);

    if (!error && data) {
      setTracks(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Pending':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      case 'Takedown':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Moderation</h2>
          <p className="text-muted-foreground">Review and moderate releases on the platform</p>
        </div>

        <ContentStats
          totalReleases={total}
          pendingCount={stats.pending}
          publishedCount={stats.published}
          rejectedCount={stats.rejected}
        />

        <AdvancedFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={filters.status}
          onStatusChange={(val) => handleFilterChange('status', val)}
          genreFilter={filters.genre}
          onGenreChange={(val) => handleFilterChange('genre', val)}
          releaseTypeFilter={filters.releaseType}
          onReleaseTypeChange={(val) => handleFilterChange('releaseType', val)}
          onClearFilters={resetFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle>Releases ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedReleases.size === releases.length && releases.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Artwork</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : releases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No releases found
                    </TableCell>
                  </TableRow>
                ) : (
                  releases.map((release) => (
                    <TableRow key={release.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReleases.has(release.id)}
                          onCheckedChange={(checked) => handleSelectRelease(release.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        {release.cover_art_url ? (
                          <img
                            src={release.cover_art_url}
                            alt={release.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Music className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{release.title}</TableCell>
                      <TableCell className="capitalize">{release.release_type}</TableCell>
                      <TableCell>{release.genre || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(release.status)}>
                          {release.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(release.release_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRelease(release);
                                  fetchTracks(release.id);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Review Release</DialogTitle>
                                <DialogDescription>
                                  Moderate this release submission
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRelease && (
                                <div className="space-y-4">
                                  <MetadataWarnings campaign={{
                                    ...selectedRelease,
                                    campaignAssets: [],
                                    campaignBrief: '',
                                    targetAudience: {},
                                    socialLinks: {},
                                    budget: '0',
                                    artist: '',
                                    platform: '',
                                    status: selectedRelease.status || 'Draft',
                                    spent: '0',
                                    reach: '0',
                                    engagement: '0',
                                    startDate: new Date().toISOString(),
                                    type: 'TikTok'
                                  } as any} />

                                  <div className="flex gap-4">
                                    {selectedRelease.cover_art_url && (
                                      <div className="relative group">
                                        <img
                                          src={selectedRelease.cover_art_url}
                                          alt={selectedRelease.title}
                                          className="h-32 w-32 rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                          <a
                                            href={selectedRelease.cover_art_url}
                                            download={`cover-${selectedRelease.title}.jpg`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                                            title="Download Artwork"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                      <h3 className="font-semibold text-lg">{selectedRelease.title}</h3>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-muted-foreground capitalize">
                                          <span className="font-medium">Type:</span> {selectedRelease.release_type}
                                        </p>
                                        <p className="text-muted-foreground">
                                          <span className="font-medium">Genre:</span> {selectedRelease.genre || 'Not specified'}
                                        </p>
                                        <p className="text-muted-foreground">
                                          <span className="font-medium">Label:</span> {selectedRelease.label || 'Not specified'}
                                        </p>
                                        <p className="text-muted-foreground">
                                          <span className="font-medium">UPC/EAN:</span> {selectedRelease.upc_ean || 'Not specified'}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setReleaseToEdit(selectedRelease);
                                        setEditDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                  </div>

                                  {tracks.length > 0 && tracks.map((track, i) => (
                                    <div key={track.id} className="space-y-2 border p-3 rounded-lg bg-muted/20">
                                      <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-sm">Track {i + 1}: {track.title}</h4>
                                        {track.audio_file_url && (
                                          <a
                                            href={track.audio_file_url}
                                            download={`track-${track.title}.mp3`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                              Download
                                            </Button>
                                          </a>
                                        )}
                                      </div>
                                      {track.audio_file_url && (
                                        <AudioPreviewPlayer audioUrl={track.audio_file_url} />
                                      )}
                                    </div>
                                  ))}

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() =>
                                        moderateRelease.mutate({
                                          releaseId: selectedRelease.id,
                                          status: 'Published',
                                        })
                                      }
                                      className="flex-1"
                                      disabled={moderateRelease.isPending}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setReleaseToReject(selectedRelease);
                                        setRejectionDialogOpen(true);
                                      }}
                                      variant="destructive"
                                      className="flex-1"
                                      disabled={moderateRelease.isPending}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReleaseToEdit(release);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <BulkActionsBar
          selectedCount={selectedReleases.size}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          onPause={() => { }}
          onActivate={() => { }}
          onDelete={() => { }}
          onClearSelection={() => setSelectedReleases(new Set())}
        />

        <RejectionDialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
          onReject={handleRejectWithReason}
          releaseName={releaseToReject?.title || ''}
          isLoading={moderateRelease.isPending}
        />

        <AdminEditReleaseDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          release={releaseToEdit}
        />
      </div>
    </AdminLayout>
  );
}
