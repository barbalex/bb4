import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return (
    <div class="flex flex-col p-7 bg-[url('/ocean.jpg')]">
      <div class="text-[40px] font-bold leading-[42px] text-center text-white [text-shadow:2px_2px_3px_black,-2px_-2px_3px_black,2px_-2px_3px_black,-2px_2px_3px_black]">
        mediterranean migration
      </div>
      <div class="text-[35px] font-bold leading-[38px] text-center text-white [text-shadow:2px_2px_3px_black,-2px_-2px_3px_black,2px_-2px_3px_black,-2px_2px_3px_black]">
        blue borders
      </div>
    </div>
  )
})
