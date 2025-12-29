const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PipedreamAction {
  name: string;
  description: string;
  githubUrl: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: 'App slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const appUrl = `https://mcp.pipedream.com/app/${slug}`;
    console.log('Fetching app details from:', appUrl);

    // Scrape the app detail page
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: appUrl,
        formats: ['markdown', 'links'],
        onlyMainContent: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || 'Failed to fetch app details' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';
    const links = data.data?.links || data.links || [];

    // Extract app name from first heading
    const nameMatch = markdown.match(/^#\s+(.+)/m);
    const appName = nameMatch ? nameMatch[1].trim() : slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Extract description (first paragraph after heading)
    const descMatch = markdown.match(/^#.+\n\n(.+?)(?:\n\n|$)/s);
    const description = descMatch ? descMatch[1].trim().slice(0, 300) : '';

    // Parse actions from markdown
    // Format: [**Action Name** \ \ Description](github_url)
    const actions: PipedreamAction[] = [];
    
    // Match action patterns like [**Update Page** \...](url)
    const actionPattern = /\[\*\*([^*]+)\*\*[^\]]*?(?:See the documentation|[^\]]*)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = actionPattern.exec(markdown)) !== null) {
      const actionName = match[1].trim();
      const url = match[2];
      
      // Only include GitHub links (actual actions)
      if (url.includes('github.com/PipedreamHQ')) {
        // Extract description from the text between ** and ](
        const fullMatch = match[0];
        const descMatch = fullMatch.match(/\*\*[^*]+\*\*\s*\\?\s*\\?\s*([^[\]]+?)(?:See the documentation)?\]\(/);
        const actionDesc = descMatch ? descMatch[1].replace(/\\/g, '').trim() : '';
        
        actions.push({
          name: actionName,
          description: actionDesc || `${actionName} via ${appName}`,
          githubUrl: url,
        });
      }
    }

    // Alternative parsing if the first method didn't find actions
    if (actions.length === 0) {
      // Try simpler pattern
      const simplePattern = /\*\*([^*]+)\*\*/g;
      const githubLinks = links.filter((l: string) => l.includes('github.com/PipedreamHQ/pipedream/blob/master/components'));
      
      let simpleMatch;
      let linkIndex = 0;
      while ((simpleMatch = simplePattern.exec(markdown)) !== null && linkIndex < githubLinks.length) {
        const name = simpleMatch[1].trim();
        if (name.length > 2 && name.length < 60 && !name.includes('http')) {
          actions.push({
            name,
            description: `${name} via ${appName}`,
            githubUrl: githubLinks[linkIndex] || '',
          });
          linkIndex++;
        }
      }
    }

    // Get category from content
    const categoryMatch = markdown.match(/Category:\s*([^\n]+)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : 'Integration';

    console.log(`Found ${actions.length} actions for ${appName}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          slug,
          name: appName,
          description,
          category,
          actions,
          sourceUrl: appUrl,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching app details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch details';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
