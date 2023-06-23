import { component$ } from '@builder.io/qwik'

export default component$(({ publication }) => {
  console.log('editing, publication:', publication)

  return <div>editing</div>
})
