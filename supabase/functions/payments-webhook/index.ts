import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, EventName, type PaddleEnv } from '../_shared/paddle.ts';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }
  return _supabase;
}

// price_id → certificate credits granted per unit purchased
const CREDIT_MAP: Record<string, number> = {
  certificate_single: 1,
  personal_individual_annual: 1,
  personal_family_annual: 3,
  personal_family_plus_annual: 5,
  employer_starter_seat_annual: 1, // per seat (uses quantity)
  employer_team_25_annual: 25,
  employer_team_50_annual: 50,
};
const UNLIMITED_PRICE_IDS = new Set(['employer_workplace_annual']);

async function grantCredits(
  userId: string,
  priceId: string,
  quantity: number,
  env: PaddleEnv,
) {
  const supabase = getSupabase();
  const unlimited = UNLIMITED_PRICE_IDS.has(priceId);
  const perUnit = CREDIT_MAP[priceId] ?? 0;
  const add = unlimited ? 0 : perUnit * Math.max(1, quantity);
  if (!unlimited && add <= 0) return;

  const { data: existing } = await supabase
    .from('certificate_credits')
    .select('balance, unlimited')
    .eq('user_id', userId)
    .eq('environment', env)
    .maybeSingle();

  const nextBalance = (existing?.balance ?? 0) + add;
  const nextUnlimited = (existing?.unlimited ?? false) || unlimited;

  await supabase.from('certificate_credits').upsert(
    {
      user_id: userId,
      balance: nextBalance,
      unlimited: nextUnlimited,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
}

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;

  const userId = customData?.userId;
  if (!userId) {
    console.error('No userId in customData');
    return;
  }

  const item = items[0];
  const priceId = item.price?.importMeta?.externalId;
  const productId = item.product?.importMeta?.externalId;
  const quantity = item.quantity ?? 1;
  if (!priceId || !productId) {
    console.warn('Skipping subscription: missing importMeta.externalId', {
      rawPriceId: item.price?.id,
      rawProductId: item.product?.id,
    });
    return;
  }

  await getSupabase().from('subscriptions').upsert(
    {
      user_id: userId,
      paddle_subscription_id: id,
      paddle_customer_id: customerId,
      product_id: productId,
      price_id: priceId,
      status,
      current_period_start: currentBillingPeriod?.startsAt,
      current_period_end: currentBillingPeriod?.endsAt,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'paddle_subscription_id' },
  );

  await grantCredits(userId, priceId, quantity, env);
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange } = data;
  await getSupabase()
    .from('subscriptions')
    .update({
      status,
      current_period_start: currentBillingPeriod?.startsAt,
      current_period_end: currentBillingPeriod?.endsAt,
      cancel_at_period_end: scheduledChange?.action === 'cancel',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', id)
    .eq('environment', env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  await getSupabase()
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('paddle_subscription_id', data.id)
    .eq('environment', env);
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  // Used for one-off purchases (e.g. certificate_single). Subscription creates
  // already grant credits via handleSubscriptionCreated, so we only act on
  // transactions with no subscription_id to avoid double-granting.
  if (data.subscriptionId) return;

  const userId = data.customData?.userId;
  if (!userId) return;

  for (const item of data.items ?? []) {
    const priceId = item.price?.importMeta?.externalId;
    if (!priceId) continue;
    await grantCredits(userId, priceId, item.quantity ?? 1, env);
  }
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.eventType) {
    case EventName.SubscriptionCreated:
      await handleSubscriptionCreated(event.data, env);
      break;
    case EventName.SubscriptionUpdated:
      await handleSubscriptionUpdated(event.data, env);
      break;
    case EventName.SubscriptionCanceled:
      await handleSubscriptionCanceled(event.data, env);
      break;
    case EventName.TransactionCompleted:
      await handleTransactionCompleted(event.data, env);
      break;
    default:
      console.log('Unhandled event:', event.eventType);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;
  try {
    await handleWebhook(req, env);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});
