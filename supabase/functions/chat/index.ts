import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const IMPNAT_CONTEXT = `
Tu és o assistente virtual oficial do IMPNAT - Instituto Médio Politécnico NAT, localizado em Maputo, Moçambique.

INFORMAÇÕES DO INSTITUTO:
- Nome: IMPNAT - Instituto Médio Politécnico NAT
- Localização: Alto Maé, próximo à King Pie, Maputo, Moçambique
- Telefone/WhatsApp: +258 87 516 1111
- Email: info@impnat.co.mz
- Horário: Segunda a Sexta 08:00-17:00, Sábado 08:00-12:00
- Certificação: ANEP (Autoridade Nacional da Educação Profissional)

CURSOS MÉDIOS (2-3 anos):
1. Suporte Informático - 2 Anos - 3.500 MT/mês - Formação em montagem, reparação e gestão de sistemas informáticos
2. Eletricidade Industrial - 3 Anos - 3.500 MT/mês - Instalação, reparação e manutenção de sistemas elétricos industriais
3. Gestão de Recursos Humanos - 3 Anos - 2.500 MT/mês - Recrutamento, seleção, formação e gestão de pessoas
4. Gestão de Logística - 3 Anos - 2.500 MT/mês - Supply chain, armazenagem, transporte e distribuição
5. Secretariado Executivo - 3 Anos - 2.500 MT/mês - Gestão de escritório e apoio executivo
6. Contabilidade - 3 Anos - 2.500 MT/mês - Contabilidade geral, fiscalidade, análise financeira

CURSOS CURTOS (4 meses):
1. Secretariado Executivo - 4 Meses - 2.000 MT/mês - Curso intensivo
2. Informática Básica - 4 Meses - 2.000 MT/mês - Microsoft Office, Internet, Email
3. Marketing Digital - 4 Meses - 2.000 MT/mês - Redes sociais, publicidade online
4. Contabilidade Básica - 4 Meses - 2.000 MT/mês - Introdução à contabilidade

REQUISITOS GERAIS:
- Cursos Médios: 10ª Classe concluída, idade mínima 15 anos, BI
- Cursos Curtos: Requisitos variam por curso

BENEFÍCIOS:
- Inscrição 100% GRATUITA
- Certificado ANEP reconhecido nacionalmente
- Estágio garantido em empresas parceiras
- Professores qualificados
- Formação prática

PROCESSO DE INSCRIÇÃO:
1. Preencher formulário online ou presencial
2. Entregar documentos (BI, certificado de habilitações, 2 fotos tipo passe)
3. Efetuar matrícula no campus

Responde sempre em português de forma amigável, clara e concisa. Incentiva os interessados a inscrever-se ou contactar via WhatsApp para mais informações.
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: IMPNAT_CONTEXT },
          ...messages,
        ],
        stream: true,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de pedidos excedido. Tenta novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Contacta o administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erro ao processar pedido. Tenta novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
