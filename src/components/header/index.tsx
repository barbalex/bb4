import { component$ } from '@builder.io/qwik'
import styles from './header.module.css'

export default component$(() => {
  return (
    <div class="flex flex-col p-7 bg-[url(../../../ocean.jpg)]">
      <div class={styles['intro-title']}>mediterranean migration</div>
      <div class={styles['intro-text']}>blue borders</div>
    </div>
  )
})
