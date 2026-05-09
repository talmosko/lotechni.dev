export const prerender = false

import type { APIRoute } from 'astro'

const MAILERLITE_API = 'https://connect.mailerlite.com/api'

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.MAILERLITE_API_KEY

  if (!token) {
    console.error('MAILERLITE_API_KEY not configured')
    return new Response(JSON.stringify({ message: 'Service not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { name, email, consent } = body

    if (!email || !consent) {
      return new Response(
        JSON.stringify({ message: 'יש למלא אימייל ולאשר תנאים' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add subscriber to MailerLite
    const res = await fetch(`${MAILERLITE_API}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        fields: { name: name || '' },
        status: 'active',
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      // If already subscribed, that's ok
      if (res.status === 422) {
        return new Response(
          JSON.stringify({ message: 'כבר רשום/ה!' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
      throw new Error(errData.message || 'Failed to subscribe')
    }

    return new Response(
      JSON.stringify({ message: 'נרשמת בהצלחה!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Subscribe error:', error)
    return new Response(
      JSON.stringify({ message: error.message || 'שגיאה בשרת' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
