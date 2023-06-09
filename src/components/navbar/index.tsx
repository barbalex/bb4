/* eslint-disable qwik/jsx-img */
import {
  component$,
  useContext,
  noSerialize,
  useSignal,
  useTask$,
} from '@builder.io/qwik'
import { Link, useLocation, useNavigate, server$ } from '@builder.io/qwik-city'
import { signOut } from 'firebase/auth'
import dayjs from 'dayjs'

import { CTX } from '../../root'
import * as db from '~/db'

const eventAdder = server$(async function () {
  let res
  try {
    res = await db.query(
      `insert into EVENT (datum, event_type)
      values ($1, $2)
      returning id`,
      [dayjs().format('YYYY-MM-DD'), 'migration'],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
    return undefined
  }

  return res.rows?.[0]?.id
})
const publicationAdder = server$(async function () {
  let res
  try {
    res = await db.query(
      `insert into publication (draft, category)
      values ($1, $2)
      returning id`,
      [true, 'European Union'],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
    return undefined
  }

  return res.rows?.[0]?.id
})
const articleAdder = server$(async function () {
  let res
  try {
    res = await db.query(
      `insert into article (datum, draft)
      values ($1, $2)
      returning id`,
      [dayjs().format('YYYY-MM-DD'), true],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
    return undefined
  }

  return res.rows?.[0]?.id
})

export default component$(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const store = useContext(CTX)
  const menuOpen = useSignal(false)

  useTask$(async ({ track }) => {
    track(() => location.url.pathname)

    if (menuOpen.value) {
      menuOpen.value = false
    }
  })

  return (
    <nav class="bg-white shadow sticky top-0 z-40 bg-[url(../../../oceanDark_4.webp)] border border-blue-800 sm-text-shadowed">
      <div class="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2">
        <div class="flex h-14 justify-between">
          <div class="flex">
            <div class="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname === '/' ||
                  location.url.pathname.startsWith('/events/')
                    ? ' border-white font-extrabold '
                    : ' border-transparent font-medium '
                }`}
              >
                Events
              </Link>
              <Link
                href="/sar"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname === '/sar/'
                    ? ' border-white font-extrabold '
                    : ' border-transparent font-medium '
                }`}
              >
                SAR NGOs
              </Link>
              <Link
                href="/publications"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/publications/')
                    ? ' border-white font-extrabold '
                    : ' border-transparent font-medium '
                }`}
              >
                Publications
              </Link>
              <Link
                href="/articles"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/articles/')
                    ? ' border-white font-extrabold '
                    : ' border-transparent font-medium '
                }`}
              >
                Articles
              </Link>
              <Link
                href="/about"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-lg text-white leading-none hover:font-extrabold hover:border-white hover:no-underline ${
                  location.url.pathname === '/about/'
                    ? ' border-white font-extrabold '
                    : ' border-transparent font-medium '
                }`}
              >
                About Us
              </Link>
            </div>
          </div>
          {/* buttons */}
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            {/* edit article, publication or about. Only show on respective urls */}
            {!!store.user &&
              (!!location.params.article_id ||
                !!location.params.publication_id ||
                location.url.pathname.startsWith('/about/')) && (
                <>
                  {store.editing ? (
                    <button
                      type="button"
                      class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      data-title-below="preview"
                      aria-label="preview"
                      onClick$={() => (store.editing = false)}
                    >
                      <svg
                        class="block h-6 w-6"
                        fill="#fff"
                        viewBox="0 0 576 512"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-2 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      data-title-below={
                        location.url.pathname.startsWith('/publications/')
                          ? 'edit publication'
                          : location.url.pathname.startsWith('/articles/')
                          ? 'edit article'
                          : 'edit event'
                      }
                      aria-label={
                        location.url.pathname.startsWith('/publications/')
                          ? 'edit publication'
                          : location.url.pathname.startsWith('/articles/')
                          ? 'edit article'
                          : 'edit event'
                      }
                      onClick$={async () => {
                        store.editing = true
                      }}
                    >
                      <svg
                        class="block h-5 w-5"
                        fill="#fff"
                        viewBox="0 0 512 512"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}
            {/* New event, article or publication. Only show on respective page */}
            {!!store.user &&
              (location.url.pathname === '/' ||
                location.url.pathname.startsWith('/events') ||
                location.url.pathname.startsWith('/articles/') ||
                location.url.pathname.startsWith('/publications/')) && (
                <button
                  type="button"
                  class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  data-title-below={
                    location.url.pathname.startsWith('/publications/')
                      ? 'new publication'
                      : location.url.pathname.startsWith('/articles/')
                      ? 'new article'
                      : 'new event'
                  }
                  aria-label={
                    location.url.pathname.startsWith('/publications/')
                      ? 'new publication'
                      : location.url.pathname.startsWith('/articles/')
                      ? 'new article'
                      : 'new event'
                  }
                  onClick$={async () => {
                    // 1. find what to create
                    // 2. create
                    // 3. set editing to true
                    // 4. navigate to edit page
                    if (location.url.pathname.startsWith('/publications/')) {
                      const id = await publicationAdder()
                      store.publicationsRefetcher++
                      store.editing = true
                      id && navigate(`/publications/eu/${id}`)
                    } else if (location.url.pathname.startsWith('/articles/')) {
                      const id = await articleAdder()
                      store.articlesRefetcher++
                      store.editing = true
                      id && navigate(`/articles/${id}`)
                    } else if (
                      location.url.pathname === '/' ||
                      location.url.pathname.startsWith('/events')
                    ) {
                      const id = await eventAdder()
                      store.editing = true
                      id &&
                        navigate(`/events/${new Date().getFullYear()}/${id}`)
                    }
                  }}
                >
                  <svg class="block h-6 w-6" fill="#fff" viewBox="0 0 448 512">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M266 80c0-17.7-24.3-32-42-32s-43.226 14.343-42 32v134H48c-17.7 0-32 24.3-32 42s14.35 43.317 32 42h134v134c0 17.7 24.3 32 42 32s42-14.3 42-32V298h134c17.7 0 32-24.3 32-42s-14.3-42-32-42H266Z"
                    />
                  </svg>
                </button>
              )}
            <div class="relative ml-3">
              <button
                type="button"
                class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-2 text-white hover:text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                data-title-below={store.user ? 'Log out' : 'Log in'}
                aria-label={store.user ? 'Log out' : 'Log in'}
                onClick$={() => {
                  if (store.user) {
                    store.firebaseAuth && signOut(store.firebaseAuth)
                    window.localStorage.removeItem('token')
                    store.user = ''
                    store.firebaseAuth = noSerialize(undefined)
                    return
                  }
                  navigate('/login')
                }}
              >
                {store.user ? (
                  <svg class="block h-5 w-5" fill="#fff" viewBox="0 0 512 512">
                    <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                  </svg>
                ) : (
                  <svg class="block h-5 w-5" fill="#fff" viewBox="0 0 512 512">
                    <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 mr-2 text-white hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen.value}
              onClick$={() => {
                menuOpen.value = !menuOpen.value
              }}
            >
              <span class="sr-only">Open main menu</span>
              {menuOpen.value ? (
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
              ) : (
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      {menuOpen.value && (
        <div class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 pb-3 pt-2">
            <Link
              href="/"
              class={
                location.url.pathname === '/' ||
                location.url.pathname.startsWith('/events/')
                  ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                  : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Events
            </Link>
            <Link
              href="/sar"
              class={
                location.url.pathname === '/sar/'
                  ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                  : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              SAR NGOs
            </Link>
            <Link
              href="/publications"
              class={
                location.url.pathname.startsWith('/publications/')
                  ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                  : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Publications
            </Link>
            <Link
              href="/articles"
              class={
                location.url.pathname.startsWith('/articles/')
                  ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
                  : 'block border-l-4 border-transparent bg-slate-50 py-2 pl-3 pr-4 text-base font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-100 hover:text-orange-700 hover:no-underline'
              }
            >
              Articles
            </Link>
            <Link
              href="/about"
              class={
                location.url.pathname === '/about/'
                  ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-bold text-indigo-800 hover:no-underline'
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
