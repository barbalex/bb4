import {
  component$,
  useResource$,
  Resource,
  Slot,
  useContext,
  useSignal,
  $,
} from '@builder.io/qwik'
import { server$, Link, useLocation, useNavigate } from '@builder.io/qwik-city'

import { CTX } from '~/root'
import * as db from '~/db'
import ConfirmDeletion from '~/components/shared/confirmDeletion'

// order of categories is used to sort the menu
export const categories = ['European Union', 'IOs & NGOs', 'Academic']

const sorter = (a, b) => {
  const aCategorySort = categories.indexOf(a.category) + 1
  const bCategorySort = categories.indexOf(b.category) + 1
  if (aCategorySort && bCategorySort && aCategorySort !== bCategorySort) {
    return aCategorySort - bCategorySort
  }

  const aSort = a.sort
  const bSort = b.sort
  if (aSort && bSort && aSort !== bSort) {
    return aSort - bSort
  }

  return a.title?.localeCompare(b.title)
}

// select all publications: id, title, draft
const dataFetcher = server$(async function (isLoggedIn) {
  // include drafts only if user is logged in
  let res
  try {
    res = await db.query(
      `select id, title, category, draft, sort from publication ${
        isLoggedIn ? '' : 'where draft is false'
      }`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  const rows = res?.rows ?? []
  const rowsSorted = [...rows].sort(sorter)

  return rowsSorted
})
const deleter = server$(async function (id) {
  try {
    await db.query(
      `delete from publication
      where id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return true
})

const urlByCategory = {
  'European Union': '/publications/eu/',
  'IOs & NGOs': '/publications/io-ngo/',
  Academic: '/publications/academic/',
}

export default component$(() => {
  const store = useContext(CTX)
  const navigate = useNavigate()

  const deleteMenuOpen = useSignal(false)

  const publications = useResource$(async ({ track }) => {
    track(() => store.publicationsRefetcher)
    const isLoggedIn = track(() => !!store.user)

    return await dataFetcher(isLoggedIn)
  })

  const location = useLocation()
  const isIdNgo = location.url.pathname.startsWith('/publications/io-ngo/')
  const isAcademic = location.url.pathname.startsWith('/publications/academic/')
  // if none is choosen, default to EU
  const activeCategory = isAcademic
    ? 'Academic'
    : isIdNgo
    ? 'IOs & NGOs'
    : 'European Union'

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 min-[820px]:flex">
        <div class="px-2 min-[820px]:w-36 lg:w-52 xl:w-64 min-[820px]:shrink-0">
          <nav class="sticky top-24 flex flex-1 flex-col" aria-label="Sidebar">
            <Resource
              value={publications}
              onPending={() => <div>Loading...</div>}
              onRejected={(reason) => {
                console.log('reason:', reason)
                return <div>Error: {reason}</div>
              }}
              onResolved={(publications) => {
                const publicationsByCategory = publications.group(
                  ({ category }) => category,
                )

                return Object.entries(publicationsByCategory).map(
                  ([category, pubs]) => {
                    const isActive = activeCategory === category
                    const categoryUrl = urlByCategory[category]

                    return (
                      <ul
                        key={category}
                        class="-mx-2 mt-3 first:mt-0 border-collapse draft-parent"
                        role="list"
                      >
                        <li
                          class={`bg-[url(../../../oceanDark_4.webp)] text-shadowed leading-6 border-collapse rounded-t-md ${
                            !isActive && 'rounded-b-md'
                          }`}
                        >
                          <Link
                            href={categoryUrl}
                            class={`${
                              categoryUrl === location.url.pathname
                                ? 'font-extrabold'
                                : ''
                            } font-bold flex p-2 pl-3 text-white text-sm text-inherit leading-6 hover:font-extrabold hover:no-underline`}
                          >
                            {`${category} (${pubs.length})`}
                          </Link>
                        </li>
                        {isActive &&
                          pubs.map((p) => (
                            <li
                              class={`border border-slate-200 last:rounded-b-md  ${
                                !!p.draft && 'draft'
                              }`}
                              key={p.id}
                            >
                              <Link
                                href={`${categoryUrl}/${p.id}`}
                                class={`${
                                  location.params.publication_id === p.id
                                    ? 'font-extrabold content-item-selected'
                                    : ''
                                } font-bold flex p-2 pl-3 text-sm text-inherit hover:no-underline leading-6 hover:font-extrabold content-item-hovered`}
                              >
                                {p.title || '(no title)'}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )
                  },
                )
              }}
            />
          </nav>
        </div>
        <div class="px-2 py-2 md:flex-1 relative">
          {!!store.user && !!location.params.publication_id && (
            <div class="absolute top-0 right-0">
              <div
                id="deleteMenu"
                class="relative inline"
                aria-expanded={deleteMenuOpen.value}
              >
                <button
                  type="button"
                  class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                  data-title="delete"
                  aria-label="delete"
                  onClick$={() =>
                    (deleteMenuOpen.value = !deleteMenuOpen.value)
                  }
                >
                  <svg class="block h-6 w-6" fill="red" viewBox="0 0 384 512">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m376.64 126.88c14.953-16.082 4.9818-40.702-9.9708-56.784-14.953-16.082-43.224-29.542-58.177-13.461l-113.5 127.12-110.63-123.01c-14.953-16.082-52.198-8.6035-67.15 7.4781-14.953 16.082-23.428 52.667-8.4752 68.749l116.11 123.01-116.49 124.63c-14.953 16.082-7.973 43.195 6.9796 59.277 14.953 16.082 44.221 26.052 59.174 9.9708l119.98-125.63 112.62 123.01c14.953 16.082 46.215 9.6006 61.168-6.481 14.953-16.082 19.938-46.186 4.9854-62.268l-112.62-125z"
                    />
                  </svg>
                </button>
                <div
                  class={`absolute left-full z-50 flex -translate-x-full px-4 ${
                    deleteMenuOpen.value
                      ? 'transition ease-in opacity-100 translate-y-0'
                      : 'transition duration-200 ease-out opacity-0 translate-y-1 h-0'
                  }`}
                >
                  <ConfirmDeletion
                    onYes={$(async () => {
                      await deleter(location.params.publication_id)
                      deleteMenuOpen.value = false
                      navigate('/publications')
                      store.publicationsRefetcher++
                    })}
                    onNo={$(() => (deleteMenuOpen.value = false))}
                    subject="publication"
                  />
                </div>
              </div>
            </div>
          )}
          <Slot />
        </div>
      </div>
    </div>
  )
})
