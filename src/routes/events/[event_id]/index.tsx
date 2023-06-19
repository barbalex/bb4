import { component$, useResource$, Resource, useSignal } from '@builder.io/qwik'
import { server$, useLocation, routeAction$, Form } from '@builder.io/qwik-city'
import dayjs from 'dayjs'

import * as db from '../../../db'

const dataFetcher = server$(async function (id) {
  let res
  try {
    res = await db.query(
      `SELECT
          *
        FROM
          EVENT
        where
          id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows[0]
})

export const useFormData = routeAction$(async (data, requestEvent) => {
  // This will only run on the server when the user submits the form (or when the action is called programatically)
  // tags_sort is set by a trigger
  // accept date in format D, DD, D.M, DD.M, D.MM, DD.MM, D.M.YY, DD.M.YY, D.MM.YY, DD.MM.YY, D.M.YYYY, DD.M.YYYY, D.MM.YYYY, DD.MM.YYYY
  const date = dayjs(data.datum, 'DD.MM.YYYY').isValid()
    ? dayjs(data.datum, 'DD.MM.YYYY')
    : dayjs(data.datum, 'D.MM.YYYY').isValid()
    ? dayjs(data.datum, 'D.MM.YYYY')
    : dayjs(data.datum, 'DD.M.YYYY').isValid()
    ? dayjs(data.datum, 'DD.M.YYYY')
    : dayjs(data.datum, 'D.M.YYYY').isValid()
    ? dayjs(data.datum, 'D.M.YYYY')
    : dayjs(data.datum, 'DD.MM.YY').isValid()
    ? dayjs(data.datum, 'DD.MM.YY')
    : dayjs(data.datum, 'D.MM.YY').isValid()
    ? dayjs(data.datum, 'D.MM.YY')
    : dayjs(data.datum, 'DD.M.YY').isValid()
    ? dayjs(data.datum, 'DD.M.YY')
    : dayjs(data.datum, 'D.M.YY').isValid()
    ? dayjs(data.datum, 'D.M.YY')
    : dayjs(data.datum, 'DD.MM').isValid()
    ? dayjs(data.datum, 'DD.MM')
    : dayjs(data.datum, 'D.MM').isValid()
    ? dayjs(data.datum, 'D.MM')
    : dayjs(data.datum, 'DD.M').isValid()
    ? dayjs(data.datum, 'DD.M')
    : dayjs(data.datum, 'D.M').isValid()
    ? dayjs(data.datum, 'D.M')
    : dayjs(data.datum, 'DD').isValid()
    ? dayjs(data.datum, 'DD')
    : dayjs(data.datum, 'D').isValid()
    ? dayjs(data.datum, 'D')
    : null
  const dateIsValid = date.isValid()
  const dateFormated = dateIsValid ? date.format('YYYY-MM-DD') : null
  const dataToUpdate = {
    ...data,
    datum: dateFormated,
  }
  const id = requestEvent.params.event_id
  // TODO: how to know if the data has changed / is dirty?
  // would be better to only update if necessary

  try {
    await db.query(
      `update event
        set 
          datum = $1,
          title = $2,
          event_type = $3,
          tag = $4
        where
          id = $5`,
      [
        dataToUpdate.datum,
        dataToUpdate.title,
        dataToUpdate.event_type,
        dataToUpdate.tag,
        id,
      ],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return {
    success: true,
  }
})

export default component$(() => {
  const location = useLocation()
  const dirty = useSignal(false)

  const event = useResource$(async ({ track }) => {
    const id = track(() => location.params.event_id)

    return await dataFetcher(id)
  })

  const action = useFormData()

  return (
    <Resource
      value={event}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(event) => {
        // console.log('event', event)
        // console.log('event, form:', { action, formData: action.formData })

        return (
          <Form action={action} class="space-y-5">
            <h2 class="border-b border-gray-900/10 pb-2 text-xl font-semibold leading-7">
              Edit event
            </h2>
            <fieldset class="" role="group">
              <legend class="text-sm font-semibold leading-6">Column</legend>
              <ul
                id="event_type"
                class="filter-switch inline-flex items-center relative space-x-0 font-semibold mt-2"
              >
                <li class="filter-switch-item flex relative shadow-sm">
                  <input
                    type="radio"
                    name="event_type"
                    id="event_type-0"
                    class="sr-only"
                    value="migration"
                    checked={event.event_type === 'migration'}
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="event_type-0"
                    class={`px-3 py-1.5 text-sm leading-6 ${
                      event.event_type === 'migration'
                        ? 'bg-blue-800 text-white  ring-blue-800'
                        : 'bg-white text-black  ring-gray-300 hover:bg-blue-50'
                    } rounded-l-md shadow ring-1 ring-inset`}
                    onClick$={() => {
                      // TODO: set the value
                      dirty.value = true
                    }}
                  >
                    maritime events
                  </label>
                  <div aria-hidden="true" class="filter-active"></div>
                </li>
                <li class="filter-switch-item flex relative shadow-sm">
                  <input
                    type="radio"
                    name="event_type"
                    id="event_type-1"
                    class="sr-only"
                    value="politics"
                    checked={event.event_type === 'politics'}
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="event_type-1"
                    class={`px-3 py-1.5 -ml-px text-sm leading-6  ${
                      event.event_type === 'politics'
                        ? 'bg-blue-800 text-white  ring-blue-800'
                        : 'bg-white text-black  ring-gray-300 hover:bg-blue-50'
                    } rounded-r-md shadow ring-1 ring-inset`}
                    onClick$={() => {
                      // TODO: set the value
                      dirty.value = true
                    }}
                  >
                    political events
                  </label>
                </li>
              </ul>
            </fieldset>
            <fieldset class="col-span-full" id="title">
              <label for="title" class="block text-sm font-medium leading-6">
                Title
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={event.title}
                  onChange$={() => (dirty.value = true)}
                />
              </div>
            </fieldset>
            <fieldset class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <legend
                for="title"
                class="block text-sm font-medium leading-6 col-span-full"
              >
                Date
              </legend>
              <div class="col-span-2">
                <div class="mt-2">
                  <input
                    type="text"
                    name="datum"
                    id="title"
                    class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={
                      event.datum
                        ? dayjs(event.datum).format('DD.MM.YYYY')
                        : null
                    }
                    onChange$={() => (dirty.value = true)}
                    required
                  />
                </div>
              </div>
              <div class="sm:col-span-3 sm:col-start-4">
                <div class="grid grid-cols-4 gap-x-16">
                  <div class="text-center col-start-1 col-end-5 row-start-1">
                    <div class="flex items-center">
                      <button
                        type="button"
                        class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
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
                      <div class="flex-auto text-sm font-semibold">January</div>
                      <button
                        type="button"
                        class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
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
                    <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                      <div>M</div>
                      <div>T</div>
                      <div>W</div>
                      <div>T</div>
                      <div>F</div>
                      <div>S</div>
                      <div>S</div>
                    </div>
                    <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                      {/*
    Always include: "py-1.5 hover:bg-gray-100 focus:z-10"
    Is current month, include: "bg-white"
    Is not current month, include: "bg-gray-50"
    Is selected or is today, include: "font-semibold"
    Is selected, include: "text-white"
    Is not selected, is not today, and is current month, include: "text-gray-900"
    Is not selected, is not today, and is not current month, include: "text-gray-400"
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
            </fieldset>
            <fieldset class="select-none">
              <legend class="text-sm font-semibold leading-6">Tag</legend>
              <p class="text-sm text-grey-600">
                The tag replaces the bullet point of the event. Thus only one
                can be choosen.
              </p>
              <div class="flex flex-wrap gap-x-3 gap-y-4 grow shrink-0 mt-4">
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="weather"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === 'weather'}
                    value="weather"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="weather"
                    class="text-sm font-medium relative ml-6 event-weather"
                  >
                    weather
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="victims"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === 'victims'}
                    value="victims"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="victims"
                    class="text-sm font-medium relative ml-6 event-victims"
                  >
                    victims
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="highlighted"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === 'highlighted'}
                    value="highlighted"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="highlighted"
                    class="text-sm font-medium relative ml-6 event-highlighted"
                  >
                    highlighted
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="statistics"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === 'statistics'}
                    value="statistics"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="statistics"
                    class="text-sm font-medium relative ml-6 event-statistics"
                  >
                    statistics
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="monthlyStatistics"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === 'monthlyStatistics'}
                    value="monthlyStatistics"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label
                    for="monthlyStatistics"
                    class="text-sm font-medium  relative ml-6 event-monthlyStatistics"
                  >
                    monthly Statistics
                  </label>
                </div>
              </div>
            </fieldset>
            <fieldset class="border-b border-gray-900/10 pb-3">
              <legend class="text-sm font-semibold leading-6">Links</legend>
              <p class="mt-1 text-sm leading-6 text-gray-600">
                Links will be listet after the title and open in a new tab.
              </p>
              <div class="mt-4 space-y-6">
                {(event.links ?? []).map((link) => JSON.stringify(link))}
              </div>
            </fieldset>
            <div class="flex items-center justify-end gap-x-6">
              <button
                type="submit"
                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Save
              </button>
            </div>
          </Form>
        )
      }}
    />
  )
})
