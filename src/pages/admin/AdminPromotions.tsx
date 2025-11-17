import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package, Tag, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePromotionServices } from '@/hooks/usePromotionServices';
import { usePromotionBundles } from '@/hooks/usePromotionBundles';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { PromotionCategory, PromotionService, PromotionBundle } from '@/types/promotion';

interface ServiceFormData {
  name: string;
  category: PromotionCategory;
  description: string;
  price: string;
  duration: string;
  features: string;
  imageUrl: string;
}

interface BundleFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  tierLevel: string;
  targetDescription: string;
  serviceIds: string[];
  imageUrl: string;
}

export default function AdminPromotions() {
  const { services, loading: servicesLoading, categories, refetch: refetchServices } = usePromotionServices();
  const { bundles, loading: bundlesLoading, refetch: refetchBundles } = usePromotionBundles();
  const { uploadImage, uploading, progress } = useCloudinaryUpload();

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<PromotionService | null>(null);
  const [editingBundle, setEditingBundle] = useState<PromotionBundle | null>(null);

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: '',
    category: 'Streaming & Playlist Promotion',
    description: '',
    price: '',
    duration: '',
    features: '',
    imageUrl: '',
  });

  const [bundleForm, setBundleForm] = useState<BundleFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    tierLevel: '1',
    targetDescription: '',
    serviceIds: [],
    imageUrl: '',
  });

  const handleImageUpload = async (file: File, isBundle: boolean = false) => {
    try {
      const result = await uploadImage(file, isBundle ? 'promotions/bundles' : 'promotions/services');
      
      if (isBundle) {
        setBundleForm(prev => ({ ...prev, imageUrl: result.publicId }));
      } else {
        setServiceForm(prev => ({ ...prev, imageUrl: result.publicId }));
      }
      
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const createService = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const { data: result, error } = await supabase
        .from('promotion_services')
        .insert({
          name: data.name,
          category: data.category,
          description: data.description,
          price: parseFloat(data.price),
          duration: data.duration,
          features: data.features.split('\n').filter(f => f.trim()),
          image_url: data.imageUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast.success('Service created successfully');
      setServiceDialogOpen(false);
      resetServiceForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create service');
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceFormData }) => {
      const { error } = await supabase
        .from('promotion_services')
        .update({
          name: data.name,
          category: data.category,
          description: data.description,
          price: parseFloat(data.price),
          duration: data.duration,
          features: data.features.split('\n').filter(f => f.trim()),
          image_url: data.imageUrl || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Service updated successfully');
      setServiceDialogOpen(false);
      setEditingService(null);
      resetServiceForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update service');
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promotion_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Service deleted successfully');
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });

  const createBundle = useMutation({
    mutationFn: async (data: BundleFormData) => {
      const { data: bundle, error: bundleError } = await supabase
        .from('promotion_bundles')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: parseFloat(data.price),
          tier_level: parseInt(data.tierLevel),
          target_description: data.targetDescription,
          image_url: data.imageUrl || null,
        })
        .select()
        .single();

      if (bundleError) throw bundleError;

      if (data.serviceIds.length > 0) {
        const { error: servicesError } = await supabase
          .from('bundle_services')
          .insert(
            data.serviceIds.map(serviceId => ({
              bundle_id: bundle.id,
              service_id: serviceId,
            }))
          );

        if (servicesError) throw servicesError;
      }

      return bundle;
    },
    onSuccess: () => {
      toast.success('Bundle created successfully');
      setBundleDialogOpen(false);
      resetBundleForm();
      refetchBundles();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create bundle');
    },
  });

  const updateBundle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BundleFormData }) => {
      const { error: bundleError } = await supabase
        .from('promotion_bundles')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: parseFloat(data.price),
          tier_level: parseInt(data.tierLevel),
          target_description: data.targetDescription,
          image_url: data.imageUrl || null,
        })
        .eq('id', id);

      if (bundleError) throw bundleError;

      const { error: deleteError } = await supabase
        .from('bundle_services')
        .delete()
        .eq('bundle_id', id);

      if (deleteError) throw deleteError;

      if (data.serviceIds.length > 0) {
        const { error: servicesError } = await supabase
          .from('bundle_services')
          .insert(
            data.serviceIds.map(serviceId => ({
              bundle_id: id,
              service_id: serviceId,
            }))
          );

        if (servicesError) throw servicesError;
      }
    },
    onSuccess: () => {
      toast.success('Bundle updated successfully');
      setBundleDialogOpen(false);
      setEditingBundle(null);
      resetBundleForm();
      refetchBundles();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update bundle');
    },
  });

  const deleteBundle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promotion_bundles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Bundle deleted successfully');
      refetchBundles();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete bundle');
    },
  });

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      category: 'Streaming & Playlist Promotion',
      description: '',
      price: '',
      duration: '',
      features: '',
      imageUrl: '',
    });
  };

  const resetBundleForm = () => {
    setBundleForm({
      name: '',
      slug: '',
      description: '',
      price: '',
      tierLevel: '1',
      targetDescription: '',
      serviceIds: [],
      imageUrl: '',
    });
  };

  const openServiceDialog = (service?: PromotionService) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        category: service.category,
        description: service.description || '',
        price: service.price.toString(),
        duration: service.duration || '',
        features: service.features?.join('\n') || '',
        imageUrl: service.imageUrl || '',
      });
    } else {
      setEditingService(null);
      resetServiceForm();
    }
    setServiceDialogOpen(true);
  };

  const openBundleDialog = (bundle?: PromotionBundle) => {
    if (bundle) {
      setEditingBundle(bundle);
      setBundleForm({
        name: bundle.name,
        slug: bundle.slug,
        description: bundle.description || '',
        price: bundle.price.toString(),
        tierLevel: bundle.tierLevel.toString(),
        targetDescription: bundle.targetDescription || '',
        serviceIds: bundle.includedServices?.map(s => s.id) || [],
        imageUrl: bundle.imageUrl || '',
      });
    } else {
      setEditingBundle(null);
      resetBundleForm();
    }
    setBundleDialogOpen(true);
  };

  const handleServiceSubmit = () => {
    if (editingService) {
      updateService.mutate({ id: editingService.id, data: serviceForm });
    } else {
      createService.mutate(serviceForm);
    }
  };

  const handleBundleSubmit = () => {
    if (editingBundle) {
      updateBundle.mutate({ id: editingBundle.id, data: bundleForm });
    } else {
      createBundle.mutate(bundleForm);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate(id);
    }
  };

  const handleDeleteBundle = (id: string) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      deleteBundle.mutate(id);
    }
  };

  const toggleServiceInBundle = (serviceId: string) => {
    setBundleForm(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotion Management</h2>
          <p className="text-muted-foreground">Manage promotional services and bundles</p>
        </div>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Promotion Services
                </CardTitle>
                <CardDescription>Manage individual promotional services</CardDescription>
              </div>
              <Button onClick={() => openServiceDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No services found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.category}</Badge>
                      </TableCell>
                      <TableCell>₦{service.price.toLocaleString()}</TableCell>
                      <TableCell>{service.duration || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openServiceDialog(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bundles Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Promotion Bundles
                </CardTitle>
                <CardDescription>Manage promotional packages</CardDescription>
              </div>
              <Button onClick={() => openBundleDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Bundle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {bundlesLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading bundles...</p>
            ) : bundles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No bundles found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell className="font-medium">{bundle.name}</TableCell>
                      <TableCell>
                        <Badge>Tier {bundle.tierLevel}</Badge>
                      </TableCell>
                      <TableCell>₦{bundle.price.toLocaleString()}</TableCell>
                      <TableCell>{bundle.includedServices?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBundleDialog(bundle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBundle(bundle.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Service Dialog */}
        <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Create Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update the service details below' : 'Add a new promotional service'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Image</Label>
                {serviceForm.imageUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <CloudinaryImage
                      publicId={serviceForm.imageUrl}
                      alt="Service preview"
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setServiceForm({ ...serviceForm, imageUrl: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, false);
                      }}
                      disabled={uploading}
                      className="max-w-xs mx-auto"
                    />
                    {uploading && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploading... {progress}%
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g., Spotify Playlist Placement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-category">Category</Label>
                <Select
                  value={serviceForm.category}
                  onValueChange={(value) => setServiceForm({ ...serviceForm, category: value as PromotionCategory })}
                >
                  <SelectTrigger id="service-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-price">Price (₦)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-duration">Duration</Label>
                  <Input
                    id="service-duration"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="e.g., 7 days"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe the service"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-features">Features (one per line)</Label>
                <Textarea
                  id="service-features"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={5}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleServiceSubmit} disabled={createService.isPending || updateService.isPending}>
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bundle Dialog */}
        <Dialog open={bundleDialogOpen} onOpenChange={setBundleDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBundle ? 'Edit Bundle' : 'Create Bundle'}</DialogTitle>
              <DialogDescription>
                {editingBundle ? 'Update the bundle details below' : 'Create a new promotional bundle'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bundle Image</Label>
                {bundleForm.imageUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <CloudinaryImage
                      publicId={bundleForm.imageUrl}
                      alt="Bundle preview"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setBundleForm({ ...bundleForm, imageUrl: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, true);
                      }}
                      disabled={uploading}
                      className="max-w-xs mx-auto"
                    />
                    {uploading && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploading... {progress}%
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bundle-name">Bundle Name</Label>
                  <Input
                    id="bundle-name"
                    value={bundleForm.name}
                    onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                    placeholder="e.g., Starter Pack"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bundle-slug">Slug</Label>
                  <Input
                    id="bundle-slug"
                    value={bundleForm.slug}
                    onChange={(e) => setBundleForm({ ...bundleForm, slug: e.target.value })}
                    placeholder="starter-pack"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bundle-price">Price (₦)</Label>
                  <Input
                    id="bundle-price"
                    type="number"
                    value={bundleForm.price}
                    onChange={(e) => setBundleForm({ ...bundleForm, price: e.target.value })}
                    placeholder="150000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bundle-tier">Tier Level</Label>
                  <Select
                    value={bundleForm.tierLevel}
                    onValueChange={(value) => setBundleForm({ ...bundleForm, tierLevel: value })}
                  >
                    <SelectTrigger id="bundle-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((tier) => (
                        <SelectItem key={tier} value={tier.toString()}>
                          Tier {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bundle-description">Description</Label>
                <Textarea
                  id="bundle-description"
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                  placeholder="Describe the bundle"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bundle-target">Target Description</Label>
                <Textarea
                  id="bundle-target"
                  value={bundleForm.targetDescription}
                  onChange={(e) => setBundleForm({ ...bundleForm, targetDescription: e.target.value })}
                  placeholder="Who is this bundle for?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Included Services</Label>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={bundleForm.serviceIds.includes(service.id)}
                        onChange={() => toggleServiceInBundle(service.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.category}</p>
                      </div>
                      <p className="text-sm font-medium">₦{service.price.toLocaleString()}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setBundleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBundleSubmit} disabled={createBundle.isPending || updateBundle.isPending}>
                {editingBundle ? 'Update' : 'Create'} Bundle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}