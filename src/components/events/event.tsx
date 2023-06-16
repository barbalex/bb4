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
            <button
              type="button"
              class="rounded-full hover:bg-gray-200 ml-1 p-1"
              data-title="delete"
            >
              <DeleteIcon class="text-red-600 font-bold text-sm" />
            </button>
          </>
        )}
      </div>
    </li>
  )
})
