/* eslint-disable qwik/jsx-img */
import { component$, useContext, noSerialize } from '@builder.io/qwik'
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city'
import {
  BsBoxArrowInRight as LoginIcon,
  BsBoxArrowRight as LogoutIcon,
  BsPlus as PlusIcon,
} from '@qwikest/icons/bootstrap'
import { signOut } from 'firebase/auth'

import { CTX } from '../../root'

export default component$(() => {
  const nav = useNavigate()
  const location = useLocation()
  const store = useContext(CTX)
  const loggedIn = !!store.user
  const firebaseAuth = store.firebaseAuth

  return (
    <nav class="bg-white shadow sticky top-0 z-40 bg-[url(../../../oceanDark.jpg)]">
      <div class="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2">
        <div class="flex h-14 justify-between">
          <div class="flex">
            <div class="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-base text-white hover:font-bold hover:border-white hover:no-underline ${
                  location.url.pathname === '/' ||
                  location.url.pathname.startsWith('/events/')
                    ? ' border-white font-bold '
                    : ' border-transparent font-normal '
                }`}
              >
                Events
              </Link>
              <Link
                href="/sar"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-base text-white hover:font-bold hover:border-white hover:no-underline ${
                  location.url.pathname === '/sar/'
                    ? ' border-white font-bold '
                    : ' border-transparent font-normal '
                }`}
              >
                SAR NGOs
              </Link>
              <Link
                href="/publications"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-base text-white hover:font-bold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/publications/')
                    ? ' border-white font-bold '
                    : ' border-transparent font-normal '
                }`}
              >
                Publications
              </Link>
              <Link
                href="/articles"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-base text-white hover:font-bold hover:border-white hover:no-underline ${
                  location.url.pathname.startsWith('/articles/')
                    ? ' border-white font-bold '
                    : ' border-transparent font-normal '
                }`}
              >
                Articles
              </Link>
              <Link
                href="/about"
                class={`inline-flex items-center border-b-2 px-1 pt-1 text-base text-white hover:font-bold hover:border-white hover:no-underline ${
                  location.url.pathname === '/about/'
                    ? ' border-white font-bold '
                    : ' border-transparent font-normal '
                }`}
              >
                About us
              </Link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            {!!store.user && (
              <button
                type="button"
                class="rounded-full shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 p-1 text-white font-black hover:text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                title="add new Event"
              >
                <PlusIcon />
              </button>
            )}
            <div class="relative ml-3">
              <button
                type="button"
                class="rounded-full shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 p-1 text-white hover:text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                title={store.user ? 'Log out' : 'Log in'}
                onClick$={() => {
                  if (loggedIn) {
                    firebaseAuth && signOut(firebaseAuth)
                    window.localStorage.removeItem('token')
                    store.user = noSerialize(null)
                    store.firebaseAuth = noSerialize(null)
                    return
                  }
                  nav('/login')
                }}
              >
                {store.user ? <LogoutIcon /> : <LoginIcon />}
              </button>
            </div>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              {/*
          Icon when menu is closed.
          Menu open: "hidden", Menu closed: "block"
        */}
              <svg
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/*
          Icon when menu is open.
          Menu open: "block", Menu closed: "hidden"
        */}
              <svg
                class="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      <div class="sm:hidden" id="mobile-menu">
        <div class="space-y-1 pb-3 pt-2">
          {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
          <a
            href="#"
            class="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
          >
            Dashboard
          </a>
          <a
            href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white hover:border-gray-300 hover:bg-gray-100 hover:text-orange-200"
          >
            Team
          </a>
          <a
            href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white hover:border-gray-300 hover:bg-gray-100 hover:text-orange-200"
          >
            Projects
          </a>
          <a
            href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white hover:border-gray-300 hover:bg-gray-100 hover:text-orange-200"
          >
            Calendar
          </a>
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">Tom Cook</div>
              <div class="text-sm font-medium text-white">tom@example.com</div>
            </div>
            <button
              type="button"
              class="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">View notifications</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
          </div>
          <div class="mt-3 space-y-1">
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
            >
              Your Profile
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
            >
              Settings
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
})
