import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sileo'

import Header from '#/components/header'
import NotFound from '#/components/ui/not-found'
import appCss from '../styles.css?url'
import { useLoaderStore } from '#/stores/loader'
import AppLoader from '#/components/ui/app-loader'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'AIKI',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const showLoader = useLoaderStore((s) => s.showLoader)

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background">
        <QueryClientProvider client={queryClient}>
          <Toaster theme="light" position="top-center" />

          {showLoader && <AppLoader />}

          <Header />
          {children}
          {/*<TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />*/}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
