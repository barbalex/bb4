import { component$, useTask$, useContext } from '@builder.io/qwik'
import { server$, useNavigate } from '@builder.io/qwik-city'
import { isServer } from '@builder.io/qwik/build'

import * as db from '~/db'
import { CTX } from '~/root'

const updater = server$(async function ({ field, value, id }) {
  try {
    await db.query(
      `update publication
       set ${field} = $1
       where id = $2`,
      [value, id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})
const contentUpdater = server$(async function ({ content, id }) {
  try {
    await db.query(
      `update publication
       set content = $1
       where id = $2`,
      [content, id],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }

  return true
})

export default component$(({ data }) => {
  const { id, title, category, sort, content } = data.value
  const store = useContext(CTX)
  const navigate = useNavigate()

  // useVisibleTask had issues on first render - code did not run reliably
  useTask$(() => {
    if (isServer) return

    // this is essential or the event handler will only run on the first render
    if (window.editorChangeHandler) return

    window.editorChangeHandler = async (e) => {
      await contentUpdater({ id, content: e?.target?.getContent?.() })
      navigate()
    }
  })

  // https://www.tiny.cloud/docs/tinymce/6/webcomponent-pm/
  // https://www.tiny.cloud/docs/tinymce/6/webcomponent-ref/
  return (
    <>
      <fieldset role="group">
        <legend class="text-sm font-semibold leading-6">Category</legend>
        <div class="mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          <div class="flex items-center">
            <input
              id="eu"
              name="category"
              type="radio"
              checked={category === 'European Union'}
              value="European Union"
              onChange$={async () => {
                await updater({
                  field: 'category',
                  value: 'European Union',
                  id,
                })
                navigate()
                store.publicationsRefetcher++
                navigate(`/publications/eu/${id}`)
              }}
              class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
            />
            <label
              for="eu"
              class="ml-3 block text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
            >
              European Union
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="ios"
              name="category"
              type="radio"
              checked={category === 'IOs & NGOs'}
              value="IOs & NGOs"
              onChange$={async () => {
                await updater({
                  field: 'category',
                  value: 'IOs & NGOs',
                  id,
                })
                navigate()
                store.publicationsRefetcher++
                navigate(`/publications/io-ngo/${id}`)
              }}
              class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
            />
            <label
              for="ios"
              class="ml-3 block text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
            >
              IOs & NGOs
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="academic"
              name="category"
              type="radio"
              checked={category === 'Academic'}
              value="Academic"
              onChange$={async () => {
                await updater({
                  field: 'category',
                  value: 'Academic',
                  id,
                })
                navigate()
                store.publicationsRefetcher++
                navigate(`/publications/academic/${id}`)
              }}
              class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
            />
            <label
              for="academic"
              class="ml-3 block text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
            >
              Academic
            </label>
          </div>
        </div>
      </fieldset>
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
          autofocus
          onChange$={async (e) => {
            await updater({ id, field: 'title', value: e?.target?.value })
            navigate()
            store.publicationsRefetcher++
          }}
        />
      </fieldset>
      <fieldset class="mt-1 -mr-2.5 mb-4" role="group">
        <label
          for="sort"
          class="block text-sm font-medium leading-6 text-gray-900"
        >
          Sort
        </label>
        <input
          type="number"
          name="sort"
          id="sort"
          class="block w-full rounded-md border-0 py-1.5 px-3 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={sort}
          onChange$={async (e) => {
            await updater({ id, field: 'sort', value: e?.target?.value })
            navigate()
            store.publicationsRefetcher++
          }}
        />
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
})
