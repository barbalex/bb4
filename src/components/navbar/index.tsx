import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { Link, useLocation } from '@builder.io/qwik-city'

export default component$(() => {
  const location = useLocation()
  const menuOpen = useSignal(false)

  useTask$(async ({ track }) => {
    track(() => location.url.pathname)

    if (menuOpen.value) {
      menuOpen.value = false
    }
  })

  return (
    <nav class="bg-white shadow-sm sticky top-0 z-40 bg-[url('/oceanDark_4.webp')] border border-blue-800 sm-text-shadowed">
      <div class="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2">
        <div class="flex h-14 justify-between">
          <div class="flex">
            <div class="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  (
                    location.url.pathname === '/' ||
                    location.url.pathname.startsWith('/events/')
                  ) ?
                    ' border-white font-extrabold '
                  : ' border-transparent font-medium '
                }`}
              >
                Events
              </Link>
              <Link
                href="/sar"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname === '/sar/' ?
                    ' border-white font-extrabold '
                  : ' border-transparent font-medium '
                }`}
              >
                SAR NGOs
              </Link>
              <Link
                href="/publications"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/publications/') ?
                    ' border-white font-extrabold '
                  : ' border-transparent font-medium '
                }`}
              >
                Publications
              </Link>
              <Link
                href="/articles"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/articles/') ?
                    ' border-white font-extrabold '
                  : ' border-transparent font-medium '
                }`}
              >
                Articles
              </Link>
              <Link
                href="/about"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname === '/about/' ?
                    ' border-white font-extrabold '
                  : ' border-transparent font-medium '
                }`}
              >
                About Us
              </Link>
            </div>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 mr-2 text-white hover:bg-gray-100 hover:text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen.value}
              onClick$={() => {
                menuOpen.value = !menuOpen.value
              }}
            >
              <span class="sr-only">Open main menu</span>
              {menuOpen.value ?
                <svg
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              : <svg
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              }
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      {menuOpen.value && (
        <div
          class="sm:hidden"
          id="mobile-menu"
        >
          <div class="space-y-1 pb-3 pt-2">
            <Link
              href="/"
              class={
                (
                  location.url.pathname === '/' ||
                  location.url.pathname.startsWith('/events/')
                ) ?
                  'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Events
            </Link>
            <Link
              href="/sar"
              class={
                location.url.pathname === '/sar/' ?
                  'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              SAR NGOs
            </Link>
            <Link
              href="/publications"
              class={
                location.url.pathname.startsWith('/publications/') ?
                  'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Publications
            </Link>
            <Link
              href="/articles"
              class={
                location.url.pathname.startsWith('/articles/') ?
                  'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Articles
            </Link>
            <Link
              href="/about"
              class={
                location.url.pathname === '/about/' ?
                  'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
})
