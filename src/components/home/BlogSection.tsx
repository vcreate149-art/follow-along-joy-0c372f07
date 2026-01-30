import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Motion3D, StaggerContainer, StaggerItem } from "@/components/animations/Motion3D";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  author: string;
  category: string;
  created_at: string;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, image_url, author, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Motion3D type="fadeUp" className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Notícias e Artigos
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            Fique a par das últimas novidades e eventos do IMPNAT
          </p>
        </Motion3D>

        {/* Blog Grid */}
        <StaggerContainer 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
          staggerDelay={0.15}
        >
          {posts.map((post) => (
            <StaggerItem key={post.id} type="card">
              <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                {/* Image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  {post.image_url ? (
                    <motion.img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="text-3xl font-heading font-bold text-primary/30">
                        IMPNAT
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <Badge variant="secondary" className="w-fit mb-3">
                    {post.category}
                  </Badge>
                  
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(post.created_at), "d MMM yyyy", { locale: pt })}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-primary font-medium group/link"
                    >
                      Ler
                      <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <Motion3D type="scaleIn" delay={0.6} className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block" }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none px-8 sm:px-12 font-medium text-sm sm:text-base"
            >
              <Link to="/blog">
                VER TODAS AS NOTÍCIAS
              </Link>
            </Button>
          </motion.div>
        </Motion3D>
      </div>
    </section>
  );
};

export default BlogSection;
