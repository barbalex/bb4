import { component$, useComputed$, useSignal } from '@builder.io/qwik'
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

import * as db from '../../../db'

const updater = server$(async function ({ datum, eventId }) {
  try {
    await db.query(
      `update event
        set datum = $1
      where
        id = $2`,
      [datum, eventId],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
})

export default component$(({ event }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // const datum = useComputed$(() => event.datum)
  const datum = event.datum

  const today = dayjs()
  const choosenDate = useComputed$(() =>
    dayjs(datum).isValid() ? dayjs(datum).format() : undefined,
  )
  const initialDate = dayjs(datum).isValid() ? dayjs(datum) : today
  // signals and computeds need to be serializable, so we can't use dayjs objects directly
  const dateString = useSignal(initialDate.format())
  const daysInMonth = useComputed$(() => dayjs(dateString.value).daysInMonth())
  const firstDayOfMonth = useComputed$(() =>
    dayjs(dateString.value).startOf('month').format(),
  )
  // dayjs returns 0 for sunday, but we want 7
  // we will compare with an index, so we need to substract 1
  // thus: monday = 0, tuesday = 1, etc.
  const firstDayOfMonthWeekDayIndex = useComputed$(
    () => dayjs(firstDayOfMonth.value).isoWeekday() - 1,
  )
  const firstDayOfNextMonthIndex = useComputed$(
    () => daysInMonth.value + firstDayOfMonthWeekDayIndex.value,
  )
  const monthAndYear = useComputed$(() =>
    dayjs(dateString.value).format('MMMM YYYY'),
  )
  const dayObjectArray = useComputed$(() => {
    const dayObjectArray = []
    for (let i = 0; i < 42; i++) {
      const dayObject = {
        datum: '',
        weekNumber: 0,
        weekDay: 0,
        day: 0,
        isToday: false,
        isChoosen: false,
        isMonth: false,
        isTopLeft: i === 0,
        isTopRight: i === 6,
        isBottomLeft: i === 35,
        isBottomRight: i === 41,
      }
      if (i < firstDayOfMonthWeekDayIndex.value) {
        dayObject.datum = dayjs(firstDayOfMonth.value)
          .subtract(firstDayOfMonthWeekDayIndex.value - i, 'day')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.datum).isoWeek()
        dayObject.day = dayjs(dayObject.datum).date()
      } else if (
        i >= firstDayOfMonthWeekDayIndex.value &&
        i < daysInMonth.value + firstDayOfMonthWeekDayIndex.value
      ) {
        dayObject.datum = dayjs(firstDayOfMonth.value)
          .add(i - firstDayOfMonthWeekDayIndex.value, 'day')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.datum).isoWeek()
        dayObject.day = dayjs(dayObject.datum).date()
        dayObject.isMonth = true
      } else {
        dayObject.datum = dayjs(firstDayOfMonth.value)
          .add(i - firstDayOfNextMonthIndex.value, 'day')
          .add(1, 'month')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.datum).isoWeek()
        dayObject.day = dayjs(dayObject.datum).date()
      }
      dayObject.isChoosen = dayjs(dayObject.datum).isSame(
        dayjs(choosenDate.value),
        'day',
      )
      dayObject.isToday = dayjs(dayObject.datum).isSame(dayjs(), 'day')
      dayObject.weekDay = dayjs(dayObject.datum).isoWeekday() - 1
      dayObjectArray.push(dayObject)
    }
    return dayObjectArray
  })

  // console.log('calendar, dayObjectArray:', dayObjectArray.value)

  return (
    <div class="w-60 sm:w-80 bg-white">
      <div class="grid grid-cols-4 gap-x-16">
        <div class="text-center col-start-1 col-end-5 row-start-1">
          <div class="flex items-center h-0">
            <button
              type="button"
              class="flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              onClick$={() =>
                (dateString.value = dayjs(dateString.value)
                  .subtract(1, 'month')
                  .format())
              }
            >
              <span class="sr-only">Previous month</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div class="flex-auto text-sm font-semibold">
              {monthAndYear.value}
            </div>
            <button
              type="button"
              class="flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              onClick$={() =>
                (dateString.value = dayjs(dateString.value)
                  .add(1, 'month')
                  .format())
              }
            >
              <span class="sr-only">Next month</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="mt-4 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {dayObjectArray.value.map((o) => (
              <button
                key={o.datum}
                type="button"
                class={`${
                  o.isChoosen
                    ? 'bg-[url(../../../oceanDark.jpg)]'
                    : o.isMonth
                    ? 'bg-white'
                    : 'bg-gray-50'
                } py-1.5 text-gray-400 ${
                  o.isChoosen ? 'hover:bg-blue-800' : 'hover:bg-gray-100'
                } ${o.isTopLeft && 'rounded-tl-lg'} ${
                  o.isTopRight && 'rounded-tr-lg'
                } ${o.isBottomLeft && 'rounded-bl-lg'} ${
                  o.isBottomRight && 'rounded-br-lg'
                } focus:z-10`}
                onClick$={async () => {
                  if (!o.isChoosen) {
                    await updater({
                      datum: o.datum,
                      eventId: location.params.event_id,
                    })
                    navigate()
                  }
                }}
              >
                <time
                  dateTime={o.datum}
                  class={`${(o.isToday || o.isChoosen) && 'font-bold'} ${
                    o.isToday || o.isChoosen
                      ? 'text-white'
                      : o.isMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  } ${
                    o.isToday && o.isChoosen
                      ? 'bg-blue-400'
                      : o.isToday
                      ? 'bg-blue-800'
                      : ''
                  } mx-auto flex h-7 w-7 items-center justify-center rounded-full`}
                >
                  {o.day}
                </time>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
