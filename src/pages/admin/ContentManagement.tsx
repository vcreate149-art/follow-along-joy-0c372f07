import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell,
  BookOpen,
  Upload,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const ContentManagement = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Notícias",
    published: false,
  });
  
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    is_urgent: false,
    target_audience: "all",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: posts }, { data: announcs }] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*").order("published_at", { ascending: false }),
    ]);

    setBlogPosts(posts || []);
    setAnnouncements(announcs || []);
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slug = blogForm.slug || generateSlug(blogForm.title);
      
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update({ ...blogForm, slug })
          .eq("id", editingPost.id);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Artigo atualizado." });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert({ ...blogForm, slug });
        if (error) throw error;
        toast({ title: "Sucesso", description: "Artigo criado." });
      }

      setBlogDialogOpen(false);
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Notícias", published: false });
      setEditingPost(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAnnouncement) {
        const { error } = await supabase
          .from("announcements")
          .update(announcementForm)
          .eq("id", editingAnnouncement.id);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Aviso atualizado." });
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert(announcementForm);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Aviso publicado." });
      }

      setAnnouncementDialogOpen(false);
      setAnnouncementForm({ title: "", content: "", is_urgent: false, target_audience: "all" });
      setEditingAnnouncement(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este artigo?")) return;
    
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível eliminar.", variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Artigo eliminado." });
      fetchData();
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este aviso?")) return;
    
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível eliminar.", variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Aviso eliminado." });
      fetchData();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gestão de Conteúdo</h1>
          <p className="text-muted-foreground">
            Gere artigos do blog e avisos para os alunos.
          </p>
        </div>

        <Tabs defaultValue="blog">
          <TabsList>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="h-4 w-4" />
              Blog ({blogPosts.length})
            </TabsTrigger>
            <TabsTrigger value="avisos" className="gap-2">
              <Bell className="h-4 w-4" />
              Avisos ({announcements.length})
            </TabsTrigger>
          </TabsList>

          {/* Blog Tab */}
          <TabsContent value="blog" className="mt-6 space-y-4">
            <div className="flex justify-end">
              <Dialog open={blogDialogOpen} onOpenChange={(open) => {
                setBlogDialogOpen(open);
                if (!open) {
                  setEditingPost(null);
                  setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Notícias", published: false });
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Artigo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPost ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título *</Label>
                      <Input
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug (URL)</Label>
                      <Input
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        placeholder="Gerado automaticamente se vazio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Input
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Resumo *</Label>
                      <Textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        rows={2}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conteúdo *</Label>
                      <Textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        rows={8}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={blogForm.published}
                        onCheckedChange={(checked) => setBlogForm({ ...blogForm, published: checked })}
                      />
                      <Label>Publicar imediatamente</Label>
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setBlogDialogOpen(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingPost ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {blogPosts.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum artigo publicado.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{post.title}</h4>
                            <Badge variant={post.published ? "default" : "outline"}>
                              {post.published ? "Publicado" : "Rascunho"}
                            </Badge>
                            <Badge variant="secondary">{post.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(post.created_at), "d MMM yyyy", { locale: pt })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingPost(post);
                              setBlogForm({
                                title: post.title,
                                slug: post.slug,
                                excerpt: post.excerpt,
                                content: post.content,
                                category: post.category,
                                published: post.published,
                              });
                              setBlogDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteBlogPost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="avisos" className="mt-6 space-y-4">
            <div className="flex justify-end">
              <Dialog open={announcementDialogOpen} onOpenChange={(open) => {
                setAnnouncementDialogOpen(open);
                if (!open) {
                  setEditingAnnouncement(null);
                  setAnnouncementForm({ title: "", content: "", is_urgent: false, target_audience: "all" });
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Aviso
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAnnouncement ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título *</Label>
                      <Input
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conteúdo *</Label>
                      <Textarea
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={announcementForm.is_urgent}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, is_urgent: checked })}
                      />
                      <Label>Marcar como Urgente</Label>
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setAnnouncementDialogOpen(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingAnnouncement ? "Atualizar" : "Publicar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {announcements.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum aviso publicado.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="flex items-center justify-between p-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{announcement.title}</h4>
                            {announcement.is_urgent && (
                              <Badge variant="destructive">Urgente</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(announcement.published_at), "d MMM yyyy 'às' HH:mm", { locale: pt })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setAnnouncementForm({
                                title: announcement.title,
                                content: announcement.content,
                                is_urgent: announcement.is_urgent,
                                target_audience: announcement.target_audience,
                              });
                              setAnnouncementDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
