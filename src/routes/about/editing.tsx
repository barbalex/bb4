import { component$, useTask$ } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { isServer } from '@builder.io/qwik/build'
// import tinymce from 'tinymce/tinymce'

export default component$(({ about }) => {
  // console.log('editing, about:', about)

  useTask$(() => {
    if (isServer) return

    console.log('editor, visibleTask running')
    // TODO:
    // 1. save on change
    // 2. or: save on blur if changed
    if (window.editorChangeHandler) {
      // this is essential or the event handler will only run on the first render
      console.log('editor, visibleTask, editorChangeHandler already set')
      return
    }
    window.editorChangeHandler = (e) => {
      console.log('editor, window.editorChangeHandler, content:', {
        content: e?.target?.getContent?.(),
      })
    }
    window.editorBlurHandler = (e) => {
      console.log('editor blurred, content:', {
        content: e?.target?.getContent?.(),
      })
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
        plugins="advlist autolink lists link image charmap preview anchor autosave save
                searchreplace visualblocks code fullscreen
                insertdatetime media table code help wordcount"
        toolbar="undo redo | blocks | bold italic underline forecolor backcolor |
                alignleft aligncenter alignright alignjustify |
                bullist numlist outdent indent | removeformat | link image code | wordcount print fullscreen"
        browser_spellcheck="true"
        resize="false"
        on-Change="editorChangeHandler"
        on-Blur="editorBlurHandler"
      >
        {about}
      </tinymce-editor>
    </div>
  )
})
