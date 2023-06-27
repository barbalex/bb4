import {
  component$,
  useTask$,
  useContext,
  useSignal,
  $,
} from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { isServer } from '@builder.io/qwik/build'
import dayjs from 'dayjs'

import * as db from '~/db'
import { CTX } from '~/root'
import Calendar from '~/components/shared/calendar'
import dateFromInputForDb from '~/utils/dateFromInputForDb'

const titleUpdater = server$(async function ({ title, id }) {
  try {
    await db.query(
      `update article
       set title = $1
       where id = $2`,
      [title, id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})
const datumUpdater = server$(async function ({ datum, id }) {
  try {
    await db.query(
      `update article
       set datum = $1
       where id = $2`,
      [datum, id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})
const contentUpdater = server$(async function ({ content, id }) {
  try {
    await db.query(
      `update article
       set content = $1
       where id = $2`,
      [content, id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})

export default component$(
  ({ id, title, datum, content, refetcher: articleRefetcher }) => {
    const store = useContext(CTX)

    const dateIsOpen = useSignal(false)
    const dateElement = useSignal()
    // useVisibleTask had issues on first render - code did not run reliably
    useTask$(() => {
      if (isServer) return

      // this is essential or the event handler will only run on the first render
      if (window.editorChangeHandler) return

      window.editorChangeHandler = async (e) => {
        await contentUpdater({ id, content: e?.target?.getContent?.() })
        articleRefetcher.value++
      }
    })

    // https://www.tiny.cloud/docs/tinymce/6/webcomponent-pm/
    // https://www.tiny.cloud/docs/tinymce/6/webcomponent-ref/
    return (
      <>
        <fieldset class="mt-1 -mr-2.5 mb-2" role="group">
          <label
            for="title"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            class="block w-full rounded-md border-0 py-1.5 px-3 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={title}
            onChange$={async (e) => {
              await titleUpdater({ id, title: e?.target?.value })
              articleRefetcher.value++
              store.articlesRefetcher++
            }}
          />
        </fieldset>
        <fieldset
          class="pb-4 -mr-2.5"
          onFocusin$={() => {
            dateIsOpen.value = true
          }}
          onFocusout$={() => {
            dateIsOpen.value = false
          }}
        >
          <legend
            for="title"
            class="block text-sm font-medium leading-6 col-span-full"
          >
            Date
          </legend>
          <input
            ref={dateElement}
            type="text"
            name="datum"
            id="title"
            class="block w-full rounded-md border-0 py-1.5 px-3 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={datum ? dayjs(datum).format('DD.MM.YYYY') : null}
            onChange$={async (e, currentTarget) => {
              await datumUpdater({
                datum: dateFromInputForDb(currentTarget.value),
                id,
              })
              articleRefetcher.value++
              store.articlesRefetcher++
            }}
            required
          />
          <div
            class={`absolute left-1/2 z-50 flex -translate-x-1/2 px-4 pt-4 mt-1 bg-white ${
              dateIsOpen.value
                ? 'transition ease-in opacity-100 translate-y-0'
                : 'transition duration-200 ease-out opacity-0 translate-y-1 h-0'
            }`}
          >
            <Calendar
              datum={datum}
              element={dateElement}
              updater={$(async (datum) => {
                await datumUpdater({
                  datum,
                  id,
                })
                articleRefetcher.value++
                store.articlesRefetcher++
                dateIsOpen.value = false
              })}
            />
          </div>
        </fieldset>
        <div class="-mb-2.5 -mr-2.5">
          <tinymce-editor
            api-key="58ali3ylgj6fv1zfjv6vdjkkt32yjw36v1iypn95psmae799"
            height="calc(100vh - 57px)"
            menubar="edit insert view format table"
            plugins="advlist autolink lists link image charmap preview anchor
                 searchreplace visualblocks code fullscreen
                 insertdatetime media table code help wordcount"
            toolbar="undo redo | blocks | bold italic underline forecolor backcolor |
                 alignleft aligncenter alignright alignjustify |
                 bullist numlist outdent indent | removeformat | link image code | wordcount print fullscreen"
            browser_spellcheck="true"
            branding="false" // does not seem to work
            resize="false"
            on-Change="editorChangeHandler"
          >
            {content}
          </tinymce-editor>
        </div>
      </>
    )
  },
)
