import { component$, useTask$ } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { isServer } from '@builder.io/qwik/build'

import * as db from '~/db'

const saver = server$(async function (content) {
  try {
    await db.query(
      `update page
       set content = $1
       where id = '24c9db53-6d7d-4a97-98b4-666c9aaa85c9'`,
      [content],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return true
})

export default component$(({ about, refetcher }) => {
  // useVisibleTask had issues on first render - code did not run reliably
  useTask$(() => {
    if (isServer) return

    // this is essential or the event handler will only run on the first render
    if (window.editorChangeHandler) return

    window.editorChangeHandler = async (e) => {
      await saver(e?.target?.getContent?.())
      refetcher.value++
    }
  })

  // https://www.tiny.cloud/docs/tinymce/6/webcomponent-pm/
  // https://www.tiny.cloud/docs/tinymce/6/webcomponent-ref/
  return (
    <div class="-my-2.5">
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
        {about}
      </tinymce-editor>
    </div>
  )
})
