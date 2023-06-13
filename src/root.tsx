import {
  component$,
  createContextId,
  useStore,
  useContextProvider,
  useContext,
  useResource$,
  noSerialize,
} from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
  server$,
} from '@builder.io/qwik-city'
import { RouterHead } from './components/router-head/router-head'
import { Client } from 'pg'

import './global.css'

export const CTX = createContextId('root')

const clientFetcher = server$(async () => {
  const isDev = process.env.NODE_ENV === 'development'
  const options = {
    connectionString: isDev
      ? process.env.PG_CONNECTIONSTRING_DEV
      : process.env.PG_CONNECTIONSTRING_PROD,
  }
  const client = new Client(options)
  try {
    await client.connect()
  } catch (error) {
    console.error('connection error', error.stack)
  }

  client.end()

  return noSerialize(client)
})

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  const store = useStore({ client: undefined })
  useContextProvider(CTX, store)
  const client = useResource$(async () => await clientFetcher())
  store.client = noSerialize(client)

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
