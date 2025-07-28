import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResourceDialog } from "@/components/admin/ResourceDialog";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Download, 
  Trash2,
  Filter,
  FileText,
  Video,
  FileSpreadsheet,
  FileImage,
  File,
  Smartphone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface FreeResource {
  id: string;
  title: string;
  description: string;
  type: string;
  size_info: string;
  page_info: string;
  features: string[];
  download_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  icon_name: string;
}

function getResourceIcon(type: string) {
  switch (type?.toUpperCase()) {
    case 'PDF':
      return FileText;
    case 'VIDEO':
      return Video;
    case 'SPREADSHEET':
      return FileSpreadsheet;
    case 'IMAGE':
      return FileImage;
    case 'WORD':
      return FileText;
    case 'APK':
      return Smartphone;
    case 'TOOL':
      return File;
    default:
      return File;
  }
}

export function AdminResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<FreeResource | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();

    // Set up real-time subscription
    const channel = supabase
      .channel('free_resources_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'free_resources' },
        () => {
          console.log('Free resources table changed, refetching...');
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchResources = async () => {
    try {
      console.log('Fetching resources...');
      const { data, error } = await supabase
        .from('free_resources')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching resources:', error);
        throw error;
      }
      
      console.log('Fetched resources:', data);
      setResources(data || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch resources.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && resource.is_active) ||
                         (statusFilter === "inactive" && !resource.is_active);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (resource: FreeResource) => {
    setEditingResource(resource);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      // Get the resource to find the file URL
      const resourceToDeleteData = resources.find(r => r.id === resourceToDelete);
      
      // Delete from database
      const { error } = await supabase
        .from('free_resources')
        .delete()
        .eq('id', resourceToDelete);

      if (error) throw error;

      // Delete file from storage if it exists
      if (resourceToDeleteData?.download_url) {
        try {
          // Extract file path from URL
          const url = new URL(resourceToDeleteData.download_url);
          const pathParts = url.pathname.split('/');
          const bucketIndex = pathParts.findIndex(part => part === 'resources');
          
          if (bucketIndex !== -1 && pathParts[bucketIndex + 1]) {
            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            await supabase.storage
              .from('resources')
              .remove([filePath]);
          }
        } catch (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Don't fail the whole operation if storage deletion fails
        }
      }

      toast({
        title: "Success",
        description: "Resource and file deleted successfully.",
      });

      fetchResources();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resource.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    }
  };

  const handleSave = () => {
    console.log('HandleSave called - refetching resources...');
    fetchResources();
    setEditingResource(null);
    setDialogOpen(false);
  };

  const handleDownload = async (resource: FreeResource) => {
    if (resource.download_url) {
      // Track download
      await supabase.from('resource_downloads').insert([{
        resource_id: resource.id
      }]);
      
      // Open download link
      window.open(resource.download_url, '_blank');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Free Resources</h1>
            <p className="text-muted-foreground">
              Manage downloadable resources for your audience
            </p>
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => {
              setEditingResource(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="SPREADSHEET">Spreadsheet</SelectItem>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="WORD">Word Document</SelectItem>
                    <SelectItem value="APK">APK</SelectItem>
                    <SelectItem value="TOOL">Tool</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resources found.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => {
                const IconComponent = getResourceIcon(resource.type);
                return (
                  <Card key={resource.id} className="hover:shadow-elegant transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <Badge 
                            variant={resource.is_active ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {resource.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload(resource)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(resource)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setResourceToDelete(resource.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {resource.description}
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{resource.size_info}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Content:</span>
                          <span>{resource.page_info}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {resource.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resource={editingResource}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}