import { component$ } from '@builder.io/qwik'
import styles from './articles.module.css'

export default component$(() => {
  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
          <nav
            class={[styles.scrollspy, 'flex', 'flex-1', 'flex-col']}
            aria-label="Sidebar"
          >
            <ul role="list" class="-mx-2 space-y-1">
              <li>
                <a
                  href="#"
                  class="bg-gray-50 text-indigo-600 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">Main area</div>
      </div>
    </div>
  )
})
