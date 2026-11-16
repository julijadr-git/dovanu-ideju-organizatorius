export async function sendGiftWebhook(type, gift) {
  const webhookUrl = import.meta.env.VITE_ZAPIER_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('Zapier webhook URL is not configured; the saved gift event was not sent.')
    return { status: 'not-configured' }
  }

  const payload = new URLSearchParams({
    type,
    record__id: String(gift.id),
    record__title: gift.title,
    record__priority: gift.priority,
    record__user_id: String(gift.user_id),
    record__created_at: gift.created_at,
  })

  try {
    // Form-encoded is accepted by Zapier Catch Hook and is a CORS-safelisted content type.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: payload,
    })

    if (!response.ok) {
      console.warn(`Zapier webhook returned HTTP ${response.status}; the saved gift remains unchanged.`)
      return { status: 'http-error', statusCode: response.status }
    }

    return { status: 'accepted', statusCode: response.status }
  } catch {
    // A CORS/network failure can hide the response even when Zapier received the simple POST.
    console.warn('Could not confirm the Zapier webhook response (CORS or network issue); the event may still have reached Zapier.')
    return { status: 'unconfirmed' }
  }
}
