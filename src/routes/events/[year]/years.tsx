import { component$, useSignal, useComputed$ } from '@builder.io/qwik'
import { useNavigate, useLocation, Link } from '@builder.io/qwik-city'

// select all articles: id, title, draft
import { useYears } from './index.tsx'

export default component$(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const chooserFocused = useSignal(false)

  const years = useYears()
  const years15to18: Array<number> = useComputed$(() =>
    years.value.filter((y) => y >= 2015 && y <= 2018),
  )
  const years19to22 = useComputed$(() =>
    years.value.filter((y) => y >= 2019 && y <= 2022),
  )
  const yearsAfter22 = useComputed$(() => years.value.filter((y) => y > 2022))

  // ungroup if is active
  const grouped15to18 = useSignal(
    !years15to18.value.includes(+location.params.year),
  )
  const grouped19to22 = useSignal(
    !years19to22.value.includes(+location.params.year),
  )
  console.log('years', {
    years: years.value,
    years15to18: years15to18.value,
    years19to22: years19to22.value,
    yearsAfter22: yearsAfter22.value,
    grouped15to18: grouped15to18.value,
    grouped19to22: grouped19to22.value,
  })

  return (
    <>
      <div>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">
            Select a tab
          </label>
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
                {years.value.reverse().map((year) => {
                  const selected = year === +location.params.year

                  return (
                    <li
                      key={`${year}-option`}
                      class={`${
                        selected ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      } relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white`}
                      id={`listbox-option-${year}`}
                      role="option"
                      onClick$={() => {
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
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex" aria-label="Tabs">
              <Link
                href="/monthly-events/2014/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
              >
                2011 - 2014
              </Link>
              <>
                {grouped15to18.value ? (
                  <Link
                    href="#"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
                    onClick$={() => (grouped15to18.value = false)}
                  >
                    2015 - 2018
                  </Link>
                ) : (
                  years15to18.value.map((year) => (
                    <Link
                      key={year}
                      href="#"
                      class={
                        +location.params.year === year
                          ? `border-indigo-600 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                          : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                      }
                      onClick$={() => navigate(`/events/${year}/`)}
                    >
                      {year}
                    </Link>
                  ))
                )}
                {grouped19to22.value ? (
                  <Link
                    href="#"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline"
                    onClick$={() => (grouped19to22.value = false)}
                  >
                    2019 - 2022
                  </Link>
                ) : (
                  years19to22.value.map((year) => (
                    <Link
                      key={year}
                      href="#"
                      class={
                        +location.params.year === year
                          ? `border-indigo-600 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                          : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                      }
                      onClick$={() => navigate(`/events/${year}/`)}
                    >
                      {year}
                    </Link>
                  ))
                )}
                {yearsAfter22.value.map((year) => (
                  <Link
                    key={year}
                    href="#"
                    class={
                      +location.params.year === year
                        ? `border-indigo-600 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                        : `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-base font-medium hover:no-underline`
                    }
                    onClick$={() => navigate(`/events/${year}/`)}
                  >
                    {year}
                  </Link>
                ))}
              </>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
})
