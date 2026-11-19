import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

// cycles system > light > dark > system (pattern from ae3/apf2).
// the pre-paint script in root.tsx resolves the stored mode onto
// html[data-theme] before first paint; this button updates it live
const NEXT_MODE = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}
const STORAGE_KEY = 'bb-theme-mode'

const applyTheme = (mode) => {
  const isDark =
    mode === 'dark' ||
    (mode !== 'light' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  const html = document.documentElement
  html.dataset.theme = isDark ? 'dark' : 'light'
  html.style.colorScheme = isDark ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', isDark ? '#111827' : '#ffffff')
}

export default component$(() => {
  const mode = useSignal('system')

  // the stored mode can only be read on the client; until then the icon
  // shows 'system', the theme itself never flashes (pre-paint script)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    mode.value = localStorage.getItem(STORAGE_KEY) ?? 'system'
  })

  const label = `theme: ${mode.value}`

  return (
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      data-title-below={label}
      aria-label={label}
      onClick$={() => {
        mode.value = NEXT_MODE[mode.value]
        localStorage.setItem(STORAGE_KEY, mode.value)
        applyTheme(mode.value)
      }}
    >
      {mode.value === 'system' ? (
        // half circle: follow the system
        <svg
          class="block h-6 w-6"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
        </svg>
      ) : mode.value === 'light' ? (
        // sun
        <svg
          class="block h-6 w-6"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 0 0 2.83-6.83l-.88.88A3 3 0 1 0 8.7 9.71l-.88.88A4 4 0 0 0 8 12zM7.5 0h1v2h-1V0zm0 14h1v2h-1v-2zM0 7.5h2v1H0v-1zm14 0h2v1h-2v-1zM2.35 1.65l1.06 1.06-.7.7-1.06-1.06.7-.7zm10.6 10.6 1.06 1.06-.7.7-1.06-1.06.7-.7zm1.06-10.6.7.7-1.06 1.06-.7-.7 1.06-1.06zM3.41 12.24l.7.7-1.06 1.06-.7-.7 1.06-1.06z" />
        </svg>
      ) : (
        // moon
        <svg
          class="block h-6 w-6"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6 .278a.77.77 0 0 1 .08.8 5.5 5.5 0 0 0 3.4 8.72.77.77 0 0 1 .5.85A6 6 0 1 1 6.15.3a.77.77 0 0 1 .85-.02zM4.5 1.9a4.5 4.5 0 1 0 6.36 6.36A6.5 6.5 0 0 1 4.5 1.9z" />
        </svg>
      )}
    </button>
  )
})
