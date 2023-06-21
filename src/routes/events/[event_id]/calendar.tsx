import { component$, useComputed$, useSignal } from '@builder.io/qwik'
import groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

export default component$(({ datum }) => {
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
        date: '',
        weekNumber: 0,
        weekDay: 0,
        day: 0,
        isToday: false,
        isChoosen: false,
        isMonth: false,
        isTopLeft: i === 0,
        isTopRight: i === 6,
        isBottomLeft: i === 34,
        isBottomRight: i === 41,
      }
      if (i < firstDayOfMonthWeekDayIndex.value) {
        dayObject.date = dayjs(firstDayOfMonth.value)
          .subtract(firstDayOfMonthWeekDayIndex.value - i, 'day')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.date).isoWeek()
        dayObject.day = dayjs(dayObject.date).date()
      } else if (
        i >= firstDayOfMonthWeekDayIndex.value &&
        i < daysInMonth.value + firstDayOfMonthWeekDayIndex.value
      ) {
        dayObject.date = dayjs(firstDayOfMonth.value)
          .add(i - firstDayOfMonthWeekDayIndex.value, 'day')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.date).isoWeek()
        dayObject.day = dayjs(dayObject.date).date()
        dayObject.isMonth = true
      } else {
        dayObject.date = dayjs(firstDayOfMonth.value)
          .add(i - firstDayOfNextMonthIndex.value, 'day')
          .add(1, 'month')
          .format('YYYY-MM-DD')
        dayObject.weekNumber = dayjs(dayObject.date).isoWeek()
        dayObject.day = dayjs(dayObject.date).date()
      }
      dayObject.isChoosen = dayjs(dayObject.date).isSame(
        dayjs(choosenDate.value),
        'day',
      )
      dayObject.isToday = dayjs(dayObject.date).isSame(dayjs(), 'day')
      dayObject.weekDay = dayjs(dayObject.date).isoWeekday() - 1
      dayObjectArray.push(dayObject)
    }
    return dayObjectArray
  })

  // console.log('calendar, date:', {
  //   datum,
  //   currentDate: currentDate?.format('YYYY-MM-DD'),
  //   dateString: dateString.value,
  //   firstDayOfMonth: dayjs(firstDayOfMonth.value).format('YYYY-MM-DD'),
  //   daysInMonth: daysInMonth.value,
  //   firstDayOfMonthWeekDayIndex: firstDayOfMonthWeekDayIndex.value,
  //   monthAndYear: monthAndYear.value,
  //   firstDayOfNextMonthIndex: firstDayOfNextMonthIndex.value,
  //   dayObjectArray: dayObjectArray.value,
  //   dayObjectArrayLength: dayObjectArray.value.length,
  //   dayObjectArrayLast: dayObjectArray.value[dayObjectArray.value.length - 1],
  // })

  console.log('calendar, dayObjectArray:', dayObjectArray.value)

  /**
   * TODO: Implement calendar
   * nr of days to show: 42
   * - [x] get weekday of the first day of month
   * - [x] calculate nr of days to show before first day of month (0 to 6)
   * - [x] get nr of days in month
   * - [ ] calculate index of last day of month
   * - [ ] build an array of day-objects containing: date, weeknumber, day, isToday, isMonth
   * - [ ] render by looping over array of day-objects, grouped by weeknumber
   * - [ ] when rendering, save date in data-date attribute for later use
   * - [ ] on click, get date from data-date attribute and set it
   */

  return (
    <div class="sm:col-span-3 sm:col-start-6">
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
                key={o.date}
                type="button"
                class={`${
                  o.isChoosen
                    ? 'bg-blue-700'
                    : o.isMonth
                    ? 'bg-white'
                    : 'bg-gray-50'
                } py-1.5 text-gray-400 ${
                  o.isChoosen ? 'hover:bg-blue-800' : 'hover:bg-gray-100'
                } focus:z-10`}
              >
                <time
                  dateTime={o.date}
                  class={`${(o.isToday || o.isChoosen) && 'font-bold'} ${
                    o.isChoosen
                      ? 'text-white'
                      : o.isMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  } mx-auto flex h-7 w-7 items-center justify-center rounded-full`}
                >
                  {o.day}
                </time>
              </button>
            ))}
            {/*
Always include: "py-1.5 hover:bg-gray-100 focus:z-10"
y: Is current month, include: "bg-white"
y: Is not current month, include: "bg-gray-50"
y: Is selected or is today, include: "font-semibold"
y: Is selected, include: "text-white"
y: Is not selected, is not today, and is current month, include: "text-gray-900"
y: Is not selected, is not today, and is not current month, include: "text-gray-400"
Is today and is not selected, include: "text-blue-600"

Top left day, include: "rounded-tl-lg"
Top right day, include: "rounded-tr-lg"
Bottom left day, include: "rounded-bl-lg"
Bottom right day, include: "rounded-br-lg"
*/}
            <button
              type="button"
              class="rounded-tl-lg bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              {/*
time:
Always include: "mx-auto flex h-7 w-7 items-center justify-center rounded-full"
Is selected and is today, include: "bg-blue-600"
Is selected and is not today, include: "bg-gray-900"
*/}
              <time
                dateTime="2021-12-27"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                27
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2021-12-28"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                28
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2021-12-29"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                29
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2021-12-30"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                30
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2021-12-31"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                31
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-01"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                1
              </time>
            </button>
            <button
              type="button"
              class="rounded-tr-lg bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-01"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                2
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-02"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                3
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-04"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                4
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-05"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                5
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-06"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                6
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-07"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                7
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-08"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                8
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-09"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                9
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-10"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                10
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-11"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                11
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 font-semibold text-blue-600 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-12"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                12
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-13"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                13
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-14"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                14
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-15"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                15
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-16"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                16
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-17"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                17
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-18"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                18
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-19"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                19
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-20"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                20
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-21"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                21
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-22"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 font-semibold text-white"
              >
                22
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-23"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                23
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-24"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                24
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-25"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                25
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-26"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                26
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-27"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                27
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-28"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                28
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-29"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                29
              </time>
            </button>
            <button
              type="button"
              class="bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-30"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                30
              </time>
            </button>
            <button
              type="button"
              class="rounded-bl-lg bg-white py-1.5 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-01-31"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                31
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-01"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                1
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-02"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                2
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-03"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                3
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-04"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                4
              </time>
            </button>
            <button
              type="button"
              class="bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-05"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                5
              </time>
            </button>
            <button
              type="button"
              class="rounded-br-lg bg-gray-50 py-1.5 text-gray-400 hover:bg-gray-100 focus:z-10"
            >
              <time
                dateTime="2022-02-06"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              >
                6
              </time>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
