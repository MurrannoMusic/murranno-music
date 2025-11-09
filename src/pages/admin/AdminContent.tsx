import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, CheckCircle, XCircle, Music, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ContentStats } from '@/components/admin/ContentStats';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { RejectionDialog } from '@/components/admin/RejectionDialog';
import { AudioPreviewPlayer } from '@/components/admin/AudioPreviewPlayer';
import { AdvancedFilters } from '@/components/admin/AdvancedFilters';
import { MetadataWarnings } from '@/components/admin/MetadataWarnings';

interface Release {
  id: string;
  title: string;
  artist_id: string;
  release_type: string;
  status: string;
  release_date: string;
  cover_art_url: string | null;
  genre: string | null;
  created_at: string;
  upc_ean: string | null;
  label: string | null;
  copyright: string | null;
  language: string | null;
}

interface Track {
  id: string;
  title: string;
  audio_file_url: string | null;
}

export default function AdminContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [releaseTypeFilter, setReleaseTypeFilter] = useState('all');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [selectedReleases, setSelectedReleases] = useState<Set<string>>(new Set());
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [releaseToReject, setReleaseToReject] = useState<Release | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const queryClient = useQueryClient();

  const { data: releases, isLoading } = useQuery({
    queryKey: ['admin-releases', page, search, statusFilter, genreFilter, releaseTypeFilter],
    queryFn: async () => {
      let query = supabase
        .from('releases')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1);

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (genreFilter && genreFilter !== 'all') {
        query = query.eq('genre', genreFilter);
      }

      if (releaseTypeFilter && releaseTypeFilter !== 'all') {
        query = query.eq('release_type', releaseTypeFilter);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        releases: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / 20),
        pending: data?.filter(r => r.status === 'Pending').length || 0,
        published: data?.filter(r => r.status === 'Published').length || 0,
        rejected: data?.filter(r => r.status === 'Rejected').length || 0,
      };
    },
  });

  const moderateRelease = useMutation({
    mutationFn: async ({ releaseId, status, reason }: { releaseId: string; status: string; reason?: string }) => {
      const { data, error } = await supabase.functions.invoke('admin-moderate-release', {
        body: { releaseId, status, reason },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Release status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
      setSelectedRelease(null);
      setSelectedReleases(new Set());
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update release status');
    },
  });

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
      const allIds = new Set(releases?.releases.map(r => r.id) || []);
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

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setGenreFilter('all');
    setReleaseTypeFilter('all');
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
          totalReleases={releases?.total || 0}
          pendingCount={releases?.pending || 0}
          publishedCount={releases?.published || 0}
          rejectedCount={releases?.rejected || 0}
        />

        <AdvancedFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          genreFilter={genreFilter}
          onGenreChange={setGenreFilter}
          releaseTypeFilter={releaseTypeFilter}
          onReleaseTypeChange={setReleaseTypeFilter}
          onClearFilters={handleClearFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle>Releases ({releases?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedReleases.size === releases?.releases.length && releases?.releases.length > 0}
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
                ) : releases?.releases?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No releases found
                    </TableCell>
                  </TableRow>
                ) : (
                  releases?.releases?.map((release: Release) => (
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
                                    <img
                                      src={selectedRelease.cover_art_url}
                                      alt={selectedRelease.title}
                                      className="h-32 w-32 rounded-lg object-cover"
                                    />
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
                                </div>

                                {tracks.length > 0 && tracks[0].audio_file_url && (
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Audio Preview</h4>
                                    <AudioPreviewPlayer audioUrl={tracks[0].audio_file_url} />
                                  </div>
                                )}

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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {releases && releases.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {releases.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(releases.totalPages, p + 1))}
                  disabled={page === releases.totalPages}
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
          onPause={() => {}}
          onActivate={() => {}}
          onDelete={() => {}}
          onClearSelection={() => setSelectedReleases(new Set())}
        />

        <RejectionDialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
          onReject={handleRejectWithReason}
          releaseName={releaseToReject?.title || ''}
          isLoading={moderateRelease.isPending}
        />
      </div>
    </AdminLayout>
  );
}
