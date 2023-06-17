import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return (
    <>
      <form>
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-2">
            <h2 class="text-xl font-semibold leading-7 text-gray-900">
              Edit event
            </h2>
          </div>
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
              <div class="col-span-full">
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
            </div>
          </div>
          <div class="border-b border-gray-900/10 pb-12">
            <h2 class="text-base font-semibold leading-7 text-gray-900">
              Tags
            </h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              A tag's symbol will replace the bullet point of the event. Thus
              only one tag can be choosen.
            </p>
            <div class="mt-10 space-y-10">
              <fieldset>
                <legend class="text-sm font-semibold leading-6 text-gray-900">
                  By Email
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
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
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
          </div>
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
