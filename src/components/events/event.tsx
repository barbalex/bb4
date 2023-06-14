import { component$ } from '@builder.io/qwik'

export default component$(({ event }) => {
  // TODO: when login is done
  // const showEditingGlyphons = !!store.login.user
  const eventClasses = (event.tags ?? []).map((tag) => `event-${tag}`).join(' ')

  return (
    <li
      class={
        event.tags?.length
          ? `py-1.5 list-none pl-1.5`
          : `py-1.5 list-disc pl-1.5`
      }
    >
      <div class={`${eventClasses} relative`}>
        {event.title}{' '}
        <span>
          {(event.links ?? []).map((l, key) => (
            <span class="pl-1" key={key}>
              {key > 0 && ' '}
              <a
                class="after:content-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==)] font-normal"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${l.label} `}
              </a>
            </span>
          ))}
        </span>
      </div>
    </li>
  )
})
