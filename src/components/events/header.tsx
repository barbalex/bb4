import { component$ } from '@builder.io/qwik'

export default component$(() => (
  <div class="sticky top-14 mt-6 pb-1.5 font-bold text-2xl break-words bg-white z-20 border-solid border border-white border-b-slate-200">
    <div class="flex">
      <div class="grow-0 shrink-0 basis-14 pr-4 text-right"></div>
      <div class="grow-1 shrink-1 basis-1/2 pr-2 text-center">
        Maritime Events
      </div>
      <div class="grow-1 shrink-1 basis-1/2 pr-2 text-center">
        Political Events
      </div>
    </div>
  </div>
))
