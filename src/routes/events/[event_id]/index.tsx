import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return (
    <>
      <form>
        <div class="space-y-8">
          <div class="border-b border-gray-900/10 pb-2">
            <h2 class="text-xl font-semibold leading-7 text-gray-900">
              Edit event
            </h2>
          </div>
          <div class="col-span-full">
            <label
              for="title"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div class="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-2">
              <label
                for="title"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div class="sm:col-span-3 sm:col-start-4">
              <div class="grid grid-cols-4 gap-x-16">
                <div class="mt-10 text-center col-start-1 col-end-5 row-start-1 mt-9">
                  <div class="flex items-center text-gray-900">
                    <button
                      type="button"
                      class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span class="sr-only">Previous month</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div class="flex-auto text-sm font-semibold">January</div>
                    <button
                      type="button"
                      class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span class="sr-only">Next month</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                    <div>S</div>
                  </div>
                  <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                    {/*
    Always include: "py-1.5 hover:bg-gray-100 focus:z-10"
    Is current month, include: "bg-white"
    Is not current month, include: "bg-gray-50"
    Is selected or is today, include: "font-semibold"
    Is selected, include: "text-white"
    Is not selected, is not today, and is current month, include: "text-gray-900"
    Is not selected, is not today, and is not current month, include: "text-gray-400"
    Is today and is not selected, include: "text-indigo-600"

    Top left day, include: "rounded-tl-lg"
    Top right day, include: "rounded-tr-lg"
    Bottom left day, include: "rounded-bl-lg"
    Bottom right day, include: "rounded-br-lg"
  */}
                    <button
                      type="button"
                      class="rounded-tl-lg bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      {/*
      Always include: "mx-auto flex h-7 w-7 items-center justify-center rounded-full"
      Is selected and is today, include: "bg-indigo-600"
      Is selected and is not today, include: "bg-gray-900"
    */}
                      <time
                        dateTime="2021-12-27"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        27
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2021-12-28"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        28
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2021-12-29"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        29
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2021-12-30"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        30
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2021-12-31"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        31
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-01"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        1
                      </time>
                    </button>
                    <button
                      type="button"
                      class="rounded-tr-lg bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-01"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        2
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-02"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        3
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-04"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        4
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-05"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        5
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-06"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        6
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-07"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        7
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-08"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        8
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-09"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        9
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-10"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        10
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-11"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        11
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 font-semibold text-indigo-600 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-12"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        12
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-13"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        13
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-14"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        14
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-15"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        15
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-16"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        16
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-17"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        17
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-18"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        18
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-19"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        19
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-20"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        20
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-21"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        21
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-22"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 font-semibold text-white"
                      >
                        22
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-23"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        23
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-24"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        24
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-25"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        25
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-26"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        26
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-27"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        27
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-28"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        28
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-29"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        29
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-30"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        30
                      </time>
                    </button>
                    <button
                      type="button"
                      class="rounded-bl-lg bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-01-31"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        31
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-01"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        1
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-02"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        2
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-03"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        3
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-04"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        4
                      </time>
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-05"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        5
                      </time>
                    </button>
                    <button
                      type="button"
                      class="rounded-br-lg bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        dateTime="2022-02-06"
                        class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      >
                        6
                      </time>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10 space-y-10">
            <fieldset>
              <legend class="text-sm font-semibold leading-6 text-gray-900">
                Column
              </legend>
              <div class="mt-6 space-y-6">
                <span class="isolate inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    class="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  >
                    maritime events / monthly statistics
                  </button>
                  <button
                    type="button"
                    class="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                  >
                    political events / total statistics
                  </button>
                </span>
              </div>
            </fieldset>
          </div>
          <div class="mt-10 space-y-10">
            <fieldset>
              <legend class="text-sm font-semibold leading-6 text-gray-900">
                Tags
              </legend>
              <div class="mt-6 space-y-6">
                <div class="relative flex gap-x-3">
                  <div class="flex h-6 items-center">
                    <input
                      id="comments"
                      name="tags"
                      type="radio"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div class="text-sm leading-6">
                    <label for="comments" class="font-medium text-gray-900">
                      Comments
                    </label>
                    <p class="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div class="relative flex gap-x-3">
                  <div class="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="tags"
                      type="radio"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div class="text-sm leading-6">
                    <label for="candidates" class="font-medium text-gray-900">
                      Candidates
                    </label>
                    <p class="text-gray-500">
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
                <div class="relative flex gap-x-3">
                  <div class="flex h-6 items-center">
                    <input
                      id="offers"
                      name="tags"
                      type="radio"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div class="text-sm leading-6">
                    <label for="offers" class="font-medium text-gray-900">
                      Offers
                    </label>
                    <p class="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <fieldset class="mt-10 space-y-10">
            <legend class="text-sm font-semibold leading-6 text-gray-900">
              Links
            </legend>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              Links will be listet after the title and open in a new tab.
            </p>
            <div class="mt-6 space-y-6">
              <div class="flex items-center gap-x-3">add links here</div>
            </div>
          </fieldset>
        </div>
        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
})
