import { component$, useTask$, useContext } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { isServer } from '@builder.io/qwik/build'

import * as db from '~/db'
import { CTX } from '~/root'

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
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={title}
              onChange$={async (e) => {
                await titleUpdater({ id, title: e?.target?.value })
                articleRefetcher.value++
                store.articlesRefetcher++
              }}
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
