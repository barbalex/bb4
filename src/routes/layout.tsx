import { component$, Slot } from '@builder.io/qwik'

import Navbar from '~/components/navbar'
import Header from '~/components/header'

// prerender every route: this is a purely static site now
export const prerender = true

export default component$(() => {
  return (
    <>
      <Header />
      <Navbar />
      <main class="mx-auto max-w-7xl p-2.5">
        <Slot />
      </main>
    </>
  )
})
