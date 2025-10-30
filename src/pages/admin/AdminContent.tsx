import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Eye, CheckCircle, XCircle, Music } from 'lucide-react';
import { format } from 'date-fns';

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
}

export default function AdminContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const queryClient = useQueryClient();

  const { data: releases, isLoading } = useQuery({
    queryKey: ['admin-releases', page, search, statusFilter],
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

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        releases: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / 20),
      };
    },
  });

  const moderateRelease = useMutation({
    mutationFn: async ({ releaseId, status }: { releaseId: string; status: string }) => {
      const { data, error } = await supabase.functions.invoke('admin-moderate-release', {
        body: { releaseId, status },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Release status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
      setSelectedRelease(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update release status');
    },
  });

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

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search releases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Releases ({releases?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : releases?.releases?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No releases found
                    </TableCell>
                  </TableRow>
                ) : (
                  releases?.releases?.map((release: Release) => (
                    <TableRow key={release.id}>
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
                              onClick={() => setSelectedRelease(release)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Release</DialogTitle>
                              <DialogDescription>
                                Moderate this release submission
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRelease && (
                              <div className="space-y-4">
                                <div className="flex gap-4">
                                  {selectedRelease.cover_art_url && (
                                    <img
                                      src={selectedRelease.cover_art_url}
                                      alt={selectedRelease.title}
                                      className="h-24 w-24 rounded-lg object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{selectedRelease.title}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {selectedRelease.release_type}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRelease.genre}
                                    </p>
                                  </div>
                                </div>

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
                                    onClick={() =>
                                      moderateRelease.mutate({
                                        releaseId: selectedRelease.id,
                                        status: 'Rejected',
                                      })
                                    }
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
      </div>
    </AdminLayout>
  );
}
