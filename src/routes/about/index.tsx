import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import * as db from '~/db'

export const useData = routeLoader$(async function () {
  let res
  try {
    res = await db.query(
      `select content from page where id = '24c9db53-6d7d-4a97-98b4-666c9aaa85c9'`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  const about = res?.rows[0]?.content
  if (!about) return null

  return about.toString('utf-8')
})

export default component$(() => {
  const about = useData()

  return <div class="about" dangerouslySetInnerHTML={about.value}></div>
})
