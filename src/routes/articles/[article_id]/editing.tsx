import { component$ } from '@builder.io/qwik'

export default component$(({ article }) => {
  console.log('editing, article:', article)

  return <div>editing</div>
})
