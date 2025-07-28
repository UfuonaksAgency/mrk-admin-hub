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
  Eye, 
  Trash2,
  Filter
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

// Mock data for blog posts
const mockBlogPosts = [
  {
    id: '1',
    title: 'Advanced Trading Strategies for 2024',
    slug: 'advanced-trading-strategies-2024',
    excerpt: 'Discover the most effective trading strategies that are working in the current market...',
    status: 'published',
    featured: true,
    viewCount: 1250,
    createdAt: '2024-01-15',
    publishedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Risk Management in Volatile Markets',
    slug: 'risk-management-volatile-markets',
    excerpt: 'Learn how to protect your capital during uncertain market conditions...',
    status: 'published',
    featured: false,
    viewCount: 890,
    createdAt: '2024-01-10',
    publishedAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Technical Analysis Fundamentals',
    slug: 'technical-analysis-fundamentals',
    excerpt: 'Master the basics of technical analysis to improve your trading decisions...',
    status: 'draft',
    featured: false,
    viewCount: 0,
    createdAt: '2024-01-08',
    publishedAt: null
  }
];

export function AdminBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog content and articles
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      {post.featured && (
                        <Badge variant="default" className="text-xs">Featured</Badge>
                      )}
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {post.createdAt}</span>
                      {post.publishedAt && <span>Published: {post.publishedAt}</span>}
                      <span>Views: {post.viewCount}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}