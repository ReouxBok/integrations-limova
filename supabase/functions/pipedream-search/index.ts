const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ success: true, data: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching Pipedream for:', query);

    // Scrape the main page of mcp.pipedream.com to get the list of integrations
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://mcp.pipedream.com/',
        formats: ['links', 'html'],
        onlyMainContent: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || 'Failed to fetch integrations' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract app links from the page
    const links = data.data?.links || data.links || [];
    const appLinks = links
      .filter((link: string) => link.includes('/app/') && !link.includes('/app/slack-bot'))
      .map((link: string) => {
        const match = link.match(/\/app\/([^\/\?#]+)/);
        if (match) {
          const slug = match[1];
          // Convert slug to display name
          const name = slug
            .split(/[-_]/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return { slug, name, url: link };
        }
        return null;
      })
      .filter(Boolean);

    // Filter by search query
    const queryLower = query.toLowerCase();
    const filteredApps = appLinks
      .filter((app: { slug: string; name: string }) => 
        app.name.toLowerCase().includes(queryLower) || 
        app.slug.toLowerCase().includes(queryLower)
      )
      .slice(0, 20); // Limit results

    console.log(`Found ${filteredApps.length} apps matching "${query}"`);

    return new Response(
      JSON.stringify({ success: true, data: filteredApps }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
