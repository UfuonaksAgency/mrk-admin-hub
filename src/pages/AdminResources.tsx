import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  File
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

// Mock data for free resources
const mockResources = [
  {
    id: '1',
    title: 'Complete Trading Guide',
    description: 'A comprehensive guide covering all aspects of trading',
    type: 'pdf',
    size_info: '2.5 MB',
    page_info: '45 pages',
    features: ['Market Analysis', 'Risk Management', 'Trading Psychology'],
    download_url: '/resources/trading-guide.pdf',
    is_active: true,
    display_order: 1,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Technical Analysis Video Series',
    description: 'Step-by-step video tutorials on technical analysis',
    type: 'video',
    size_info: '1.2 GB',
    page_info: '8 videos',
    features: ['Chart Patterns', 'Indicators', 'Price Action'],
    download_url: '/resources/technical-analysis-videos.zip',
    is_active: true,
    display_order: 2,
    created_at: '2024-01-10'
  },
  {
    id: '3',
    title: 'Risk Management Spreadsheet',
    description: 'Excel template for calculating position sizes',
    type: 'spreadsheet',
    size_info: '156 KB',
    page_info: '5 sheets',
    features: ['Position Sizing', 'Risk Calculator', 'Portfolio Tracker'],
    download_url: '/resources/risk-management.xlsx',
    is_active: false,
    display_order: 3,
    created_at: '2024-01-08'
  }
];

function getResourceIcon(type: string) {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'video':
      return Video;
    case 'spreadsheet':
      return FileSpreadsheet;
    case 'image':
      return FileImage;
    default:
      return File;
  }
}

export function AdminResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && resource.is_active) ||
                         (statusFilter === "inactive" && !resource.is_active);
    return matchesSearch && matchesType && matchesStatus;
  });

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
          <Button className="bg-gradient-primary hover:opacity-90">
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
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
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
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}