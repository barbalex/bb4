import {
  component$,
  useContext,
  useSignal,
  $,
  // useVisibleTask$,
} from '@builder.io/qwik'
import { useNavigate, server$, useLocation } from '@builder.io/qwik-city'
import {
  BsPencilFill as EditIcon,
  BsXCircle as DeleteIcon,
} from '@qwikest/icons/bootstrap'

import { CTX } from '~/root'
import * as db from '~/db'
import ConfirmDeletion from '~/components/shared/confirmDeletion'

const deleter = server$(async function ({ id }) {
  try {
    await db.query(
      `delete from event
       where id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})

export default component$(({ event }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const store = useContext(CTX)
  const showEditingGlyphons = !!store.user
  const deleteMenuOpen = useSignal(false)

  // enable clicking outside of delete menu to close it
  // deactivated because menu could only be opened once
  // useVisibleTask$(({ track, cleanup }) => {
  //   track(() => deleteMenuOpen.value)

  //   // close delete menu when clicking outside of it
  //   document.addEventListener('click', () => {
  //     if (deleteMenuOpen.value === true) deleteMenuOpen.value = false
  //   })
  //   const deleteButton = document.getElementById('deleteButton')
  //   // prevent closing delete menu when clicking on delete button and it's menu
  //   deleteButton?.addEventListener('click', (e) => e.stopPropagation())
  //   const deleteMenu = document.getElementById('deleteMenu')
  //   deleteMenu?.addEventListener('click', (e) => e.stopPropagation())

  //   cleanup(() => {
  //     deleteMenu?.removeEventListener('click', () => {
  //       if (deleteMenuOpen.value === true) deleteMenuOpen.value = false
  //     })
  //     deleteButton?.removeEventListener('click', (e) => e.stopPropagation())
  //     window.removeEventListener('click', (e) => e.stopPropagation())
  //   })
  // })

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
              onClick$={() =>
                navigate(`/events/${location.params.year}/${event.id}`)
              }
            >
              <EditIcon class="text-sm" />
            </button>
            <div
              id="deleteMenu"
              class="relative inline"
              aria-expanded={deleteMenuOpen.value}
            >
              <button
                id={`${event.id}/deleteButton`}
                type="button"
                class="rounded-full hover:bg-gray-200 ml-1 p-1"
                data-title={deleteMenuOpen.value ? undefined : 'delete'}
                onClick$={() => (deleteMenuOpen.value = !deleteMenuOpen.value)}
              >
                <DeleteIcon class="text-red-600 font-bold text-sm" />
              </button>
              {/* need to build only when open, otherwise every item will have it's dom */}
              {deleteMenuOpen.value && (
                <div
                  class={`absolute left-1/2 z-50 flex -translate-x-1/2 px-4 ${
                    deleteMenuOpen.value
                      ? 'transition ease-in opacity-100 translate-y-0'
                      : 'transition duration-200 ease-out opacity-0 translate-y-1 h-0'
                  }`}
                >
                  <ConfirmDeletion
                    onYes={$(async () => {
                      deleteMenuOpen.value = false
                      await deleter({ id: event.id })
                      // with `navigate()`, list did not render correctly
                      window.location.reload()
                    })}
                    onNo={$(() => (deleteMenuOpen.value = false))}
                    subject="event"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  )
})
