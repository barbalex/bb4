import { component$ } from '@builder.io/qwik'

export default component$(() => (
  <div class="sticky top-14 h-10 mt-6 font-bold text-lg sm:text-2xl break-words bg-white z-20 border border-solid border-white border-b-slate-200 items-center content-center event-header event-row">
    <div class="pr-4 text-right"></div>
    <div class="pr-2 text-center leading-none">Maritime Events</div>
    <div class="pr-2 text-center leading-none">Political Events</div>
  </div>
))
