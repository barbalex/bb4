import { component$, useContext } from '@builder.io/qwik'
import {
  BsPencilFill as EditIcon,
  BsXCircle as DeleteIcon,
} from '@qwikest/icons/bootstrap'

import { CTX } from '~/root'

export default component$(({ event }) => {
  // TODO: when login is done
  const store = useContext(CTX)
  const showEditingGlyphons = !!store.user

  return (
    <li
      class={
        event.tags?.length
          ? `py-1.5 list-none pl-1.5`
          : `py-1.5 list-disc pl-1.5`
      }
    >
      <div
        class={`${(event.tags ?? [])
          .map((tag) => `event-${tag}`)
          .join(' ')} relative`}
      >
        {event.title}&nbsp;
        <>
          {(event.links ?? []).map((l, key) => (
            <span class="pl-1" key={l.label}>
              {key > 0 && ' '}
              <a
                class="after:content-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==)]"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${l.label} `}
              </a>
            </span>
          ))}
        </>
        {showEditingGlyphons && (
          <>
            <button
              type="button"
              class="rounded-full hover:bg-gray-200 ml-2 p-1"
              data-title="edit"
            >
              <EditIcon class="text-sm" />
            </button>
            <div class="relative inline" aria-expanded="false">
              <button
                type="button"
                class="rounded-full hover:bg-gray-200 ml-1 p-1"
                data-title="delete"
              >
                <DeleteIcon class="text-red-600 font-bold text-sm" />
              </button>
              <div class="absolute left-1/2 z-10 flex -translate-x-1/2 px-4">
                <div class="w-auto flex-auto overflow-hidden rounded-md p-2 pt-1 bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <p class="font-semibold whitespace-nowrap">
                    Delete this event?
                  </p>
                  <div class="mt-1 flex justify-between">
                    <button
                      type="button"
                      class="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-800"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="rounded bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </li>
  )
})
