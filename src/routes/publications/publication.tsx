import { component$ } from '@builder.io/qwik'

export default component$(({ publication }) => {
  return (
    <div
      class="publications"
      dangerouslySetInnerHTML={
        publication.value?.content ?? '(no content has been created yet)'
      }
    />
  )
})
