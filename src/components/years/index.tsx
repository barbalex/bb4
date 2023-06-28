import { component$, useSignal, useResource$, Resource } from '@builder.io/qwik'
import { server$, useNavigate } from '@builder.io/qwik-city'

import * as db from '../../db'

// select all articles: id, title, draft
export const dataFetcher = server$(async function () {
  let res
  try {
    res = await db.query(
      `SELECT
          to_char(date_trunc('year', datum), 'yyyy')::int AS year
        FROM
          EVENT
        where datum is not null
        GROUP BY
          year
        ORDER BY
          year ASC`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows?.map((r) => r.year)
})

export default component$(({ activeYear }) => {
  const navigate = useNavigate()
  const grouped15to18 = useSignal(true)
  const grouped19to22 = useSignal(true)
  const years = useResource$(async () => await dataFetcher())

  return (
    <>
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
            onChange$={(e) => {
              if (e.target.value < 2015) {
                return navigate(`/monthly-events/${e.target.value}/`)
              }
              activeYear.value = e.target.value
            }}
          >
            <Resource
              value={years}
              onPending={() => <div>Loading...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(years) => {
                // need to add 2011-2014 to the list
                const yearsToUse = [
                  ...new Set([...[2011, 2012, 2013, 2014], ...years]),
                ]
                return yearsToUse.map((year) =>
                  activeYear.value === year ? (
                    <option key={year} value={year} selected="">
                      {year}
                    </option>
                  ) : (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ),
                )
              }}
            />
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex" aria-label="Tabs">
              <a
                href="/monthly-events/2014/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
              >
                2011 - 2014
              </a>
              <Resource
                value={years}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(years) => {
                  const years15to18 = years.filter(
                    (y) => y >= 2015 && y <= 2018,
                  )
                  const years19to22 = years.filter(
                    (y) => y >= 2019 && y <= 2022,
                  )
                  const yearsAfter22 = years.filter((y) => y > 2022)

                  return (
                    <>
                      {grouped15to18.value ? (
                        <a
                          href="#"
                          class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
                          onClick$={() => (grouped15to18.value = false)}
                        >
                          2015 - 2018
                        </a>
                      ) : (
                        years15to18.map((year) => (
                          <a
                            key={year}
                            href="#"
                            class={
                              activeYear.value === year
                                ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                                : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                            }
                            onClick$={() => (activeYear.value = year)}
                          >
                            {year}
                          </a>
                        ))
                      )}
                      {grouped19to22.value ? (
                        <a
                          href="#"
                          class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
                          onClick$={() => (grouped19to22.value = false)}
                        >
                          2019 - 2022
                        </a>
                      ) : (
                        years19to22.map((year) => (
                          <a
                            key={year}
                            href="#"
                            class={
                              activeYear.value === year
                                ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                                : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                            }
                            onClick$={() => (activeYear.value = year)}
                          >
                            {year}
                          </a>
                        ))
                      )}
                      {yearsAfter22.map((year) => (
                        <a
                          key={year}
                          href="#"
                          class={
                            activeYear.value === year
                              ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                              : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                          }
                          onClick$={() => (activeYear.value = year)}
                        >
                          {year}
                        </a>
                      ))}
                    </>
                  )
                }}
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  )
})
