import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  email: string;
  firstName: string;
  agentName: string | null;
  isGeneral: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-content-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, agentName, isGeneral }: NotificationRequest = await req.json();
    console.log(`Sending notification to ${email} for ${firstName}`);

    const subject = isGeneral 
      ? "🎉 Votre contenu demandé est disponible sur Limova Academy !"
      : `🎉 Nouveau contenu disponible pour ${agentName} sur Limova Academy !`;

    const contentDescription = isGeneral
      ? "Le contenu général que vous aviez demandé"
      : `Le contenu pour l'agent ${agentName} que vous aviez demandé`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Limova Academy <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: `<h1>Bonjour ${firstName} !</h1><p>${contentDescription} est maintenant disponible sur Limova Academy.</p><p>— L'équipe Limova Academy</p>`,
      }),
    });

    const data = await res.json();
    console.log("Email sent:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
