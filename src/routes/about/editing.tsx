import { component$, useVisibleTask$ } from '@builder.io/qwik'
// import tinymce from 'tinymce/tinymce'

export default component$(({ about }) => {
  console.log('editing, about:', about)

  useVisibleTask$(() => {
    tinymce.init({
      selector: '#editor',
      plugins:
        'advlist autolink link image lists charmap print anchor pagebreak searchreplace wordcount visualblocks visualchars media nonbreaking save table directionality autosave fullscreen code',
      menubar: 'edit insert view format table',
      toolbar:
        'insertfile undo redo searchreplace | styleselect | bold italic underline forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code | wordcount print fullscreen',
      height: 500,
      browser_spellcheck: true,
      automatic_uploads: false,
      statusbar: false,
      body_class: '',
      fullscreen_native: true,
    })
  })

  return <textarea id="editor">editing</textarea>
})
