import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

export default component$(({ date }) => {
  const month = dayjs(date).format('MMMM')
  const year = dayjs(date).format('YYYY')

  return (
    <div class="sticky top-24 w-full px-4 py-1 text-white font-bold bg-[url(../../../oceanDark.jpg)] z-10 rounded">{`${month} ${year}`}</div>
  )
})
