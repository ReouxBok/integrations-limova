import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRow {
  id: string;
  description: string;
  agent_id: string | null;
  is_global: boolean;
  bug_type: string | null;
  feedback_category: string | null;
  criticality: string;
  date: string;
  client_email: string;
  status: string;
  agent: { name: string }[] | null;
}

interface MergeSuggestion {
  feedback1: FeedbackRow;
  feedback2: FeedbackRow;
  score: number;
  reason: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all non-merged, non-resolved feedbacks
    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select(`
        id,
        description,
        agent_id,
        is_global,
        bug_type,
        feedback_category,
        criticality,
        date,
        client_email,
        status,
        agent:agents(name)
      `)
      .is("merged_into_id", null)
      .not("status", "in", '("resolved","closed")')
      .order("date", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching feedbacks:", error);
      throw error;
    }

    console.log(`Fetched ${feedbacks?.length || 0} feedbacks for analysis`);

    if (!feedbacks || feedbacks.length < 2) {
      return new Response(
        JSON.stringify({ suggestions: [], message: "Not enough feedbacks to analyze" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare feedbacks for AI analysis
    const feedbackSummaries = feedbacks.map((f: FeedbackRow) => ({
      id: f.id,
      description: f.description.substring(0, 500),
      agent: f.agent?.[0]?.name || (f.is_global ? "Global Platform" : "Unknown"),
      bug_type: f.bug_type,
      category: f.feedback_category,
      criticality: f.criticality,
      date: f.date,
      client: f.client_email,
    }));

    const prompt = `Tu es un assistant spécialisé dans l'analyse de tickets de support. Analyse les feedbacks suivants et identifie les paires qui pourraient être fusionnées car ils décrivent le même problème ou des problèmes très similaires.

Critères de fusion :
- Descriptions similaires (même bug, même fonctionnalité concernée)
- Même agent Limova concerné OU même catégorie de problème global
- Même type de bug (backend, frontend, AI, etc.)
- Problèmes signalés par différents clients mais identiques

Feedbacks à analyser :
${JSON.stringify(feedbackSummaries, null, 2)}

Réponds UNIQUEMENT avec un JSON valide au format suivant (sans markdown, sans \`\`\`):
{
  "suggestions": [
    {
      "id1": "uuid-du-premier-feedback",
      "id2": "uuid-du-second-feedback",
      "score": 85,
      "reason": "Explication courte de pourquoi ces feedbacks devraient être fusionnés"
    }
  ]
}

Retourne maximum 5 suggestions avec un score > 70. Si aucune paire ne semble pertinente, retourne {"suggestions": []}.`;

    console.log("Calling Lovable AI for analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Tu es un expert en analyse de tickets de support. Tu réponds uniquement en JSON valide." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "{}";
    
    console.log("AI response:", content);

    // Parse AI response
    let parsed;
    try {
      // Clean the response in case it has markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ suggestions: [], error: "Failed to parse AI response" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build full suggestions with feedback data
    const suggestions: MergeSuggestion[] = [];
    const feedbackMap = new Map(feedbacks.map((f: FeedbackRow) => [f.id, f]));

    for (const suggestion of parsed.suggestions || []) {
      const f1 = feedbackMap.get(suggestion.id1);
      const f2 = feedbackMap.get(suggestion.id2);
      
      if (f1 && f2) {
        suggestions.push({
          feedback1: f1,
          feedback2: f2,
          score: suggestion.score,
          reason: suggestion.reason,
        });
      }
    }

    console.log(`Found ${suggestions.length} merge suggestions`);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-merge-suggestions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
