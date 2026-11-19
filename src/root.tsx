import { component$ } from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'

import { RouterHead } from './components/router-head/router-head'
import './global.css'

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        {/* resolves the stored theme mode ('system' | 'light' | 'dark')
            against the OS preference and sets html[data-theme] +
            color-scheme before first paint, so dark mode does not flash.
            the toggle button keeps both in sync afterwards */}
        <script
          dangerouslySetInnerHTML={`;(() => {
  let mode
  try {
    mode = localStorage.getItem('bb-theme-mode')
  } catch {
    mode = null
  }
  const isDark =
    mode === 'dark' ||
    (mode !== 'light' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  const html = document.documentElement
  html.dataset.theme = isDark ? 'dark' : 'light'
  html.style.colorScheme = isDark ? 'dark' : 'light'
})()`}
        />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
