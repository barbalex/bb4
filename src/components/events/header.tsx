import { component$ } from '@builder.io/qwik'

export default component$(() => (
  <div class="sticky top-14 h-10 mt-6 pb-0 font-bold text-xl sm:text-2xl break-words bg-white z-20 border border-solid border-white border-b-slate-200 flex items-center content-center event-row">
    <div class="grow-0 shrink-0 basis-8 sm:basis-14 pr-4 text-right items-center"></div>
    <div class="grow-1 shrink-1 pr-2 text-center event-category">
      Maritime Events
    </div>
    <div class="grow-1 shrink-1 pr-2 text-center event-category">
      Political Events
    </div>
  </div>
))
