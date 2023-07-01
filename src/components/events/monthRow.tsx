import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

export default component$(({ date }) => {
  const month = dayjs(date).format('MMMM')
  const year = dayjs(date).format('YYYY')

  return (
    <div class="sticky top-24 px-4 py-1 text-white font-bold text-shadowed bg-[url(../../../oceanDark_4.webp)] z-10 rounded">{`${month} ${year}`}</div>
  )
})
