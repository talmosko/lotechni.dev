import { useState, type FormEvent } from 'react'

interface SubscribeState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export default function NewsletterForm() {
  const [state, setState] = useState<SubscribeState>({
    status: 'idle',
    message: '',
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    setState({ status: 'loading', message: '' })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          consent: true,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'שגיאה בהרשמה')
      }

      setState({ status: 'success', message: '✅ נרשמת בהצלחה! תודה 🙏' })
      form.reset()
    } catch (err: any) {
      setState({
        status: 'error',
        message: `❌ ${err.message || 'משהו השתבש, נסה שוב'}`,
      })
    }
  }

  const isLoading = state.status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label htmlFor="nl-name" className="mb-1 block text-sm text-gray-300">
          שם
        </label>
        <input
          id="nl-name"
          type="text"
          name="name"
          required
          disabled={isLoading}
          placeholder="איך קוראים לך?"
          className="w-full rounded-md border border-white/10 bg-surface-dark px-4 py-2 text-white placeholder:text-gray-500 focus:border-accent focus:outline-none disabled:opacity-50"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="nl-email" className="mb-1 block text-sm text-gray-300">
          אימייל
        </label>
        <input
          id="nl-email"
          type="email"
          name="email"
          required
          disabled={isLoading}
          placeholder="your@email.com"
          className="w-full rounded-md border border-white/10 bg-surface-dark px-4 py-2 text-white placeholder:text-gray-500 focus:border-accent focus:outline-none disabled:opacity-50"
          dir="ltr"
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-2">
        <input
          id="nl-consent"
          type="checkbox"
          name="consent"
          required
          disabled={isLoading}
          className="mt-1 h-4 w-4 rounded border-white/10 bg-surface-dark accent-accent"
        />
        <label htmlFor="nl-consent" className="text-xs text-gray-400">
          אני מאשר/ת לקבל מיילים מ"לא טכני ולא במקרה". אפשר לבטל בכל רגע
          בלחיצת כפתור.
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || state.status === 'success'}
        className="w-full rounded-md bg-accent px-6 py-3 font-bold text-surface transition-colors hover:bg-accent-light disabled:opacity-50"
      >
        {isLoading ? 'שולח...' : '🔥 שלחו לי אינסייטים'}
      </button>

      {/* Message */}
      {state.message && (
        <p
          className={`text-center text-sm ${
            state.status === 'success'
              ? 'text-green-400'
              : state.status === 'error'
                ? 'text-red-400'
                : 'hidden'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
