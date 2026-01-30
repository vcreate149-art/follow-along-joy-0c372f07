import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, Calendar } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const Avisos = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false });

      setAnnouncements(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const urgentAnnouncements = announcements.filter(a => a.is_urgent);
  const regularAnnouncements = announcements.filter(a => !a.is_urgent);

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
          <h1 className="font-heading text-2xl font-bold">Avisos e Comunicados</h1>
          <p className="text-muted-foreground">
            Acompanha as últimas notícias e comunicados da coordenação.
          </p>
        </div>

        {/* Urgent Announcements */}
        {urgentAnnouncements.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Avisos Urgentes
            </h2>
            {urgentAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-destructive bg-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{announcement.title}</h3>
                        <Badge variant="destructive">Urgente</Badge>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
                      <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(announcement.published_at), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Comunicados Gerais
          </h2>
          
          {regularAnnouncements.length === 0 && urgentAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Não há avisos publicados de momento.
                </p>
              </CardContent>
            </Card>
          ) : regularAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Sem comunicados gerais recentes.
                </p>
              </CardContent>
            </Card>
          ) : (
            regularAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg mb-2">{announcement.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(announcement.published_at), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                        </span>
                        {announcement.target_audience !== "all" && (
                          <Badge variant="outline">{announcement.target_audience}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Avisos;
