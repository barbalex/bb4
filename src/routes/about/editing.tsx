import { component$ } from '@builder.io/qwik'

export default component$(({ doc }) => {
  console.log('editing, doc:', doc)

  return <div>editing</div>
})
