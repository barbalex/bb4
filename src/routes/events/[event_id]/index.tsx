import { component$, useResource$, Resource, useSignal } from '@builder.io/qwik'
import {
  server$,
  useLocation,
  useNavigate,
  routeAction$,
  Form,
} from '@builder.io/qwik-city'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import * as db from '../../../db'
import dateFromInputForDb from '~/utils/dateFromInputForDb'
import Links from './links'
import Calendar from './calendar'

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
  const dataToUpdate = {
    ...data,
    datum: dateFromInputForDb(data.datum),
    tag: data.tag === 'null' ? null : data.tag,
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
  const navigate = useNavigate()
  const dirty = useSignal(false)

  const event = useResource$(async ({ track }) => {
    const id = track(() => location.params.event_id)

    return await dataFetcher(id)
  })

  const action = useFormData()

  // useTask$(({ cleanup }) => {
  //   cleanup(() => {
  //     console.log('unmounting dirty event form, submitting')
  //     document.getElementById('eventForm').submit()
  //     if (dirty.value) {
  //       // TODO:
  //       // action.formData is undefined. how to get the data from the form?
  //       // how to submit the form?
  //       // how to stop event until form is submitted?
  //       console.log('unmounting dirty event form, TODO: save data')
  //       // document.eventForm.submit() // does not work
  //     }
  //   })
  // })

  // useOnWindow(
  //   'beforeunload',
  //   $(() => {
  //     console.log('beforeunload event form')
  //   }),
  // )

  return (
    <Resource
      value={event}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(event) => (
        <>
          <Form
            action={action}
            class="space-y-4"
            onSubmitCompleted$={() => {
              dirty.value = false
              // turned off because the form flashes hideously
              // TODO: test if flashes in production too
              // navigate('/')
            }}
          >
            <h2 class="border-b border-gray-900/10 pb-2 text-xl font-semibold leading-7">
              Edit event
            </h2>
            <fieldset class="" role="group">
              <legend class="text-sm font-semibold leading-6">Column</legend>
              <div class="mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                <div class="flex items-center">
                  <input
                    id="migration"
                    name="event_type"
                    type="radio"
                    checked={event.event_type === 'migration'}
                    value="migration"
                    onChange$={() => (dirty.value = true)}
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    for="migration"
                    class="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    maritime events
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="politics"
                    name="event_type"
                    type="radio"
                    checked={event.event_type === 'politics'}
                    value="politics"
                    onChange$={() => (dirty.value = true)}
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    for="politics"
                    class="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    political events
                  </label>
                </div>
              </div>
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
            <fieldset class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
              <legend
                for="title"
                class="block text-sm font-medium leading-6 col-span-full"
              >
                Date
              </legend>
              <div class="col-span-4">
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
              <Calendar event={event} />
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
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="null"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    checked={event.tag === null}
                    value="null"
                    onChange$={() => (dirty.value = true)}
                  />
                  <label for="monthlyStatistics" class="text-sm font-medium">
                    none
                  </label>
                </div>
              </div>
            </fieldset>
            <div class="flex items-center justify-end gap-x-6 pb-4 border-b border-gray-300">
              <button
                type="button"
                class={`${
                  dirty.value
                    ? 'text-black'
                    : 'text-slate-300 cursor-not-allowed'
                } rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-slate-100 outline outline-1 outline-slate-300`}
                disabled={dirty.value === false}
                onClick$={() => {
                  navigate('/')
                }}
              >
                Close without saving
              </button>
              <button
                type="submit"
                class={`${
                  dirty.value
                    ? 'text-white bg-blue-600'
                    : 'text-slate-400 bg-blue-100 cursor-not-allowed'
                } rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                disabled={dirty.value === false}
              >
                Save
              </button>
              <button
                type="button"
                class={`${
                  !dirty.value
                    ? 'text-black'
                    : 'text-slate-300 cursor-not-allowed'
                } rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-slate-100 outline outline-1 outline-slate-300`}
                disabled={dirty.value === true}
                onClick$={() => {
                  navigate('/')
                }}
              >
                Close
              </button>
            </div>
          </Form>
          <fieldset class="mt-3">
            <legend class="text-sm font-semibold leading-6">Links</legend>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              Links will be listet after the title and open in a new tab.
            </p>
            <Links event={event} />
          </fieldset>
        </>
      )}
    />
  )
})
