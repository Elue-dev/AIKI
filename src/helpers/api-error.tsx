import type { ApiError } from '@/lib/interceptor'

/**
 * Converts an API error into a ReactNode suitable for a toast description.
 * If the message is an array, renders a bullet list; otherwise plain string.
 */
export function formatApiError(error: ApiError | null | undefined): React.ReactNode {
  if (!error) return 'Something went wrong, please try again.'

  const { message } = error

  if (Array.isArray(message)) {
    if (message.length === 1) return message[0]
    return (
      <ul className="list-disc pl-4 space-y-0.5 text-left">
        {message.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    )
  }

  return message
}
