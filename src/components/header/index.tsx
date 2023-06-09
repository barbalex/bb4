import { component$ } from '@builder.io/qwik'
import styles from './header.module.css'

export default component$(() => {
  return (
    <div class={styles.container}>
      <div class={styles['intro-title']}>mediterranean migration</div>
      <div class={styles['intro-text']}>blue borders</div>
    </div>
  )
})
