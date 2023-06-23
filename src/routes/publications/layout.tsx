import {
  component$,
  useResource$,
  Resource,
  Slot,
  useContext,
} from '@builder.io/qwik'
import { server$, Link, useLocation } from '@builder.io/qwik-city'
import groupBy from 'lodash/groupBy'

import { CTX } from '~/root'
import * as db from '../../db'

const categorySort = {
  'European Union': 1,
  'IOs & NGOs': 2,
  Academic: 3,
}
const sorter = (a, b) => {
  const aCategorySort = categorySort[a.category]
  const bCategorySort = categorySort[b.category]
  if (aCategorySort && bCategorySort && aCategorySort !== bCategorySort) {
    return aCategorySort - bCategorySort
  }

  const aSort = a.sort
  const bSort = b.sort
  if (aSort && bSort && aSort !== bSort) {
    return aSort - bSort
  }

  return a.title.localeCompare(b.title)
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

const categoryChooser = {
  isEu: 'European Union',
  isIdNgo: 'IOs & NGOs',
  isAcademic: 'Academic',
}

export default component$(() => {
  const store = useContext(CTX)
  const isLoggedIn = !!store.user
  const publications = useResource$(async () => await dataFetcher(isLoggedIn))
  const location = useLocation()
  const isIdNgo = location.url.pathname.startsWith('/publications/io-ngo/')
  const isAcademic = location.url.pathname.startsWith('/publications/academic/')
  const isEu = location.url.pathname.startsWith('/publications/eu/')
  // if none is choosen, default to EU
  const activeCategory = isAcademic
    ? categoryChooser.isAcademic
    : isIdNgo
    ? categoryChooser.isIdNgo
    : categoryChooser.isEu
  console.log('isCategory:', { isEu, isIdNgo, isAcademic, activeCategory })

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 min-[820px]:flex">
        <div class="px-2 min-[820px]:w-36 lg:w-52 xl:w-64 min-[820px]:shrink-0">
          <nav class="sticky top-24 flex flex-1 flex-col" aria-label="Sidebar">
            <Resource
              value={publications}
              onPending={() => <div>Loading...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(publications) => {
                const publicationsByCategory = groupBy(publications, 'category')
                console.log('publicationsByCategory:', publicationsByCategory)

                return Object.entries(publicationsByCategory).map(
                  ([category, pubs]) => (
                    <ul
                      key={category}
                      class="-mx-2 mt-3 first:mt-0 border-collapse"
                      role="list"
                    >
                      <li class="bg-[url(../../../oceanDark.jpg)] font-bold flex p-2 pl-3 text-sm text-white leading-6 border-collapse rounded-t-md">
                        {category}
                      </li>
                      {pubs.map((p) => (
                        <li
                          class="border border-slate-200 last:rounded-b-md"
                          key={p.id}
                        >
                          <Link
                            href={`/publications/${p.id}`}
                            class={`${
                              location.params.publication_id === p.id
                                ? 'font-extrabold bg-slate-100'
                                : ''
                            } font-bold flex p-2 pl-3 text-sm text-inherit hover:no-underline leading-6 hover:font-extrabold hover:bg-slate-100`}
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ),
                )
              }}
            />
          </nav>
        </div>
        <div class="px-2 py-2 xl:flex-1">
          <Slot />
        </div>
      </div>
    </div>
  )
})
