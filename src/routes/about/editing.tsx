import { component$ } from '@builder.io/qwik'

export default component$(({ about }) => {
  console.log('editing, about:', about)

  return <div>editing</div>
})
