import { component$, useVisibleTask$ } from '@builder.io/qwik'
// import tinymce from 'tinymce/tinymce'

export default component$(({ about }) => {
  // console.log('editing, about:', about)
  useVisibleTask$(() => {
    window.changeEditorHandler = (e) => {
      console.log('editor, window.changeEditorHandler, event:', e)
    }
    window.blurEditorHandler = (e) => {
      console.log('editor blurred, event:', e)
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
        on-Change="changeEditorHandler"
        on-Blur="blurEditorHandler"
      >
        {about}
      </tinymce-editor>
    </div>
  )
})
