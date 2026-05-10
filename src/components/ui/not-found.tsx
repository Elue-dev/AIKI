import { Link } from '@tanstack/react-router'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-8xl font-bold text-primary mb-4 select-none">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded-full bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  )
}
