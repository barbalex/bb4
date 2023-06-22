import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'
import {
  BsPencilFill as EditIcon,
  BsXCircle as DeleteIcon,
} from '@qwikest/icons/bootstrap'

import { CTX } from '~/root'

export default component$(({ event }) => {
  const navigate = useNavigate()
  const store = useContext(CTX)
  const showEditingGlyphons = !!store.user
  const deleteMenuOpen = useSignal(false)

  // enable clicking outside of delete menu to close it
  useVisibleTask$(({ track, cleanup }) => {
    track(() => deleteMenuOpen.value)

    // close delete menu when clicking outside of it
    document.addEventListener('click', () => {
      if (deleteMenuOpen.value === true) deleteMenuOpen.value = false
    })
    const deleteButton = document.getElementById('deleteButton')
    // prevent closing delete menu when clicking on delete button and it's menu
    deleteButton?.addEventListener('click', (e) => e.stopPropagation())
    const deleteMenu = document.getElementById('deleteMenu')
    deleteMenu?.addEventListener('click', (e) => e.stopPropagation())

    cleanup(() => {
      deleteMenu?.removeEventListener('click', () => {
        if (deleteMenuOpen.value === true) deleteMenuOpen.value = false
      })
      deleteButton?.removeEventListener('click', (e) => e.stopPropagation())
      window.removeEventListener('click', (e) => e.stopPropagation())
    })
  })

  return (
    <li
      class={event.tag ? `py-1.5 list-none pl-1.5` : `py-1.5 list-disc pl-1.5`}
    >
      <div class={`${`event-${event.tag}`} relative`}>
        {event.title || '(event with no title)'}&nbsp;
        <>
          {(event.links ?? []).map((l, key) => (
            <span class="pl-1" key={`${l.label}/${key}`}>
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
              onClick$={() => navigate(`/events/${event.id}`)}
            >
              <EditIcon class="text-sm" />
            </button>
            <div
              id="deleteMenu"
              class="relative inline"
              aria-expanded={deleteMenuOpen.value}
            >
              <button
                id="deleteButton"
                type="button"
                class="rounded-full hover:bg-gray-200 ml-1 p-1"
                data-title={deleteMenuOpen.value ? undefined : 'delete'}
                onClick$={() => (deleteMenuOpen.value = !deleteMenuOpen.value)}
              >
                <DeleteIcon class="text-red-600 font-bold text-sm" />
              </button>
              <div
                class={`absolute left-1/2 z-50 flex -translate-x-1/2 px-4 ${
                  deleteMenuOpen.value
                    ? 'transition ease-in opacity-100 translate-y-0'
                    : 'transition duration-200 ease-out opacity-0 translate-y-1 w-0 h-0'
                }`}
              >
                <div class="w-auto flex-auto overflow-hidden rounded-md p-2 pt-1 bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <p class="font-semibold whitespace-nowrap">
                    Delete this event?
                  </p>
                  <div class="mt-1 flex justify-between">
                    <button
                      type="button"
                      class="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-800"
                      onClick$={() => {
                        console.log('TODO: delete event')
                        deleteMenuOpen.value = false
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="rounded bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick$={() => (deleteMenuOpen.value = false)}
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
