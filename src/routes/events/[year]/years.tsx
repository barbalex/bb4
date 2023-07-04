import { component$, useSignal, useResource$, Resource } from '@builder.io/qwik'
import { server$, useNavigate, useLocation } from '@builder.io/qwik-city'

import * as db from '~/db'

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

export default component$(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const grouped15to18 = useSignal(true)
  const grouped19to22 = useSignal(true)
  const chooserFocused = useSignal(false)
  const years = useResource$(async () => await dataFetcher())

  return (
    <>
      <div>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">
            Select a tab
          </label>
          <Resource
            value={years}
            onPending={() => <div>Loading...</div>}
            onRejected={(reason) => <div>Error: {reason}</div>}
            onResolved={(years) => {
              // need to add 2011-2014 to the list
              const yearsToUse = [
                ...new Set([...[2011, 2012, 2013, 2014], ...years]),
              ]

              return (
                <div>
                  <label
                    id="listbox-label"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Choose a year
                  </label>
                  <div class="relative mt-2">
                    <button
                      type="button"
                      class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      aria-haspopup="listbox"
                      aria-expanded="true"
                      aria-labelledby="listbox-label"
                      onFocusin$={() => (chooserFocused.value = true)}
                      onFocusout$={() => (chooserFocused.value = false)}
                    >
                      <span class="block truncate">{location.params.year}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg
                          class="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                    <ul
                      class={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                        chooserFocused.value
                          ? 'transition ease-in opacity-100 z-30'
                          : 'transition duration-200 ease-out opacity-0 z-0'
                      }`}
                      tabIndex={-1}
                      role="listbox"
                      aria-labelledby="listbox-label"
                      aria-activedescendant={`listbox-option-${location.params.year}`}
                    >
                      {yearsToUse.reverse().map((year) => {
                        const selected = year === +location.params.year

                        return (
                          <li
                            key={`${year}-option`}
                            class={`${
                              selected
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900'
                            } relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white`}
                            id={`listbox-option-${year}`}
                            role="option"
                            onClick$={() => {
                              // console.log('click', year)
                              if (year < 2015) {
                                navigate(`/monthly-events/${year}/`)
                              } else {
                                navigate(`/events/${year}/`)
                              }
                              chooserFocused.value = false
                            }}
                          >
                            <span
                              class={`block truncate ${
                                selected ? 'font-semibold' : 'font-normal'
                              }`}
                            >
                              {year}
                            </span>
                            {selected && (
                              <span
                                class={`absolute inset-y-0 right-0 flex items-center pr-4 text-white`}
                              >
                                <svg
                                  class="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            }}
          />
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
                              +location.params.year === year
                                ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                                : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                            }
                            onClick$={() => navigate(`/events/${year}/`)}
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
                              +location.params.year === year
                                ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                                : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                            }
                            onClick$={() => navigate(`/events/${year}/`)}
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
                            +location.params.year === year
                              ? `border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                              : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                          }
                          onClick$={() => navigate(`/events/${year}/`)}
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
