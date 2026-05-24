import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';

async function resolvePaddlePrice(priceId: string, environment: PaddleEnv): Promise<string> {
  const response = await gatewayFetch(
    environment,
    `/prices?external_id=${encodeURIComponent(priceId)}`,
  );
  const data = await response.json();
  if (!data.data?.length) throw new Error(`Price not found: ${priceId}`);
  return data.data[0].id;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, environment } = await req.json();
    if (!priceId || (environment !== 'sandbox' && environment !== 'live')) {
      return new Response(
        JSON.stringify({ error: 'priceId and environment (sandbox|live) required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const paddleId = await resolvePaddlePrice(priceId, environment as PaddleEnv);
    return new Response(JSON.stringify({ paddleId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('get-paddle-price error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
