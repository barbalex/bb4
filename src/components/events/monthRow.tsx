import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

export default component$(({ date }) => {
  const month = dayjs(date).format('MMMM')
  const year = dayjs(date).format('YYYY')

  return (
    <div class="absolute sticky top-0 px-4 py-1 text-white font-bold bg-[url(../../../oceanDark.jpg)] rounded">{`${month} ${year}`}</div>
  )
})
