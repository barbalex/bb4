import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  return (
    <>
      <p class="hyphens-manual text-center px-7 pt-6 pb-6 text-lg">
        Large numbers of migrants and refugees arriving in Europe cross some
        part of the Mediterranean. The purpose of this website is to take a look
        at the most important route, that of the Central Mediterranean, by
        focusing on both maritime and political events.
      </p>
      <div>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option>2011 - 2014</option>
            <option>2015 - 2018</option>
            <option>2019 - 2022</option>
            <option selected="">2023</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex" aria-label="Tabs">
              {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              <a
                href="/monthly-events/2014/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2011 - 2014
              </a>
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2015 - 2018
              </a>
              <a
                href="#"
                class="border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
                aria-current="page"
              >
                2019 - 2022
              </a>
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2023
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: 'mediterranean migration',
  meta: [
    {
      name: 'mediterranean migration',
      content:
        'Overview over migration across the the blue borders of the Me­diterrane­an',
    },
  ],
}
