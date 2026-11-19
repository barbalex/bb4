import { component$ } from '@builder.io/qwik'

export default component$(({ event }) => {
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
      </div>
    </li>
  )
})
