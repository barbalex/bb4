import { component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

export default component$(() => {
  const location = useLocation()
  const id = location.params.article_id

  return <div>article id: {id}</div>
})
