import { component$, Slot } from '@builder.io/qwik'
import { Link, useLocation } from '@builder.io/qwik-city'

export default component$(() => {
  const location = useLocation()

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="px-2 py-0 xl:w-64 xl:shrink-0">
          <nav class="sticky top-24 flex  flex-1 flex-col" aria-label="Sidebar">
            <ul class="-mx-2 mt-3 mb-3 first:mt-0 border-collapse" role="list">
              <li class="bg-[url(../../../oceanDark.jpg)] font-bold flex p-2 pl-3 text-sm text-white leading-6 border-collapse rounded-t-md">
                2014
              </li>
              <li class="border border-slate-200 last:rounded-b-md">
                <Link
                  href="/monthly-events/2014/1"
                  class={`${
                    location.url.pathname === '/monthly-events/2014/1/'
                      ? 'font-extrabold bg-slate-100'
                      : ''
                  } font-bold flex p-2 pl-3 text-sm leading-6 hover:font-extrabold hover:bg-slate-100`}
                >
                  January
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="px-2 py-2 xl:flex-1">
          <Slot />
        </div>
      </div>
    </div>
  )
})
