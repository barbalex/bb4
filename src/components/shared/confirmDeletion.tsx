import { component$ } from '@builder.io/qwik'

export default component$(({ onYes, onNo }) => {
  return (
    <div class="w-auto flex-auto overflow-hidden rounded-md p-2 pt-1 bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
      <p class="font-semibold whitespace-nowrap">Delete this event?</p>
      <div class="mt-1 flex justify-between">
        <button
          type="button"
          class="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:cursor-pointer hover:bg-red-800"
          onClick$={onYes}
        >
          Yes
        </button>
        <button
          type="button"
          class="rounded bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:cursor-pointer hover:bg-gray-50"
          onClick$={onNo}
        >
          No
        </button>
      </div>
    </div>
  )
})
