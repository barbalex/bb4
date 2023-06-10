import { component$, Slot } from '@builder.io/qwik'

import Navbar from '~/components/navbar'
import Header from '~/components/header'

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
