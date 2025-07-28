import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FreeResource {
  id?: string;
  title: string;
  description: string;
  type: string;
  size_info: string;
  page_info: string;
  features: string[];
  download_url?: string;
  is_active: boolean;
  display_order: number;
  icon_name: string;
}

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: FreeResource | null;
  onSave: () => void;
}

export function ResourceDialog({ open, onOpenChange, resource, onSave }: ResourceDialogProps) {
  const [formData, setFormData] = useState<FreeResource>({
    title: "",
    description: "",
    type: "PDF",
    size_info: "",
    page_info: "",
    features: [],
    is_active: true,
    display_order: 0,
    icon_name: "FileText"
  });
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resource) {
      setFormData(resource);
      setFeaturesText(resource.features.join(", "));
    } else {
      setFormData({
        title: "",
        description: "",
        type: "PDF",
        size_info: "",
        page_info: "",
        features: [],
        is_active: true,
        display_order: 0,
        icon_name: "FileText"
      });
      setFeaturesText("");
    }
  }, [resource]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      setFormData({ ...formData, download_url: data.publicUrl });
      
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resourceData = {
        ...formData,
        features: featuresText.split(",").map(f => f.trim()).filter(f => f)
      };

      console.log('Saving resource data:', resourceData);

      if (resource?.id) {
        console.log('Updating existing resource with id:', resource.id);
        const { error } = await supabase
          .from('free_resources')
          .update(resourceData)
          .eq('id', resource.id);

        if (error) {
          console.error('Error updating resource:', error);
          throw error;
        }
        
        console.log('Resource updated successfully');
        toast({
          title: "Success",
          description: "Resource updated successfully.",
        });
      } else {
        console.log('Creating new resource');
        const { error } = await supabase
          .from('free_resources')
          .insert([resourceData]);

        if (error) {
          console.error('Error creating resource:', error);
          throw error;
        }
        
        console.log('Resource created successfully');
        toast({
          title: "Success",
          description: "Resource created successfully.",
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save resource:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save resource.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Edit Resource" : "Create New Resource"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    const getIconName = (type: string) => {
                      switch (type) {
                        case 'PDF': return 'FileText';
                        case 'VIDEO': return 'Video';
                        case 'SPREADSHEET': return 'FileSpreadsheet';
                        case 'IMAGE': return 'FileImage';
                        case 'WORD': return 'FileText';
                        case 'APK': return 'Smartphone';
                        case 'TOOL': return 'File';
                        default: return 'File';
                      }
                    };
                    setFormData({ ...formData, type: value, icon_name: getIconName(value) });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="SPREADSHEET">Spreadsheet</SelectItem>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="WORD">Word Document</SelectItem>
                    <SelectItem value="APK">APK</SelectItem>
                    <SelectItem value="TOOL">Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size_info">Size Info</Label>
                <Input
                  id="size_info"
                  value={formData.size_info}
                  onChange={(e) => setFormData({ ...formData, size_info: e.target.value })}
                  placeholder="e.g. 2.5 MB"
                  required
                />
              </div>

              <div>
                <Label htmlFor="page_info">Page Info</Label>
                <Input
                  id="page_info"
                  value={formData.page_info}
                  onChange={(e) => setFormData({ ...formData, page_info: e.target.value })}
                  placeholder="e.g. 15 pages"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Feature 1, Feature 2, Feature 3"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov,.avi,.mkv,.jpg,.jpeg,.png,.gif,.apk"
              />
              {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              {formData.download_url && (
                <p className="text-sm text-success mt-1">File uploaded successfully</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}