import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import { routeAction$, Form, useNavigate } from '@builder.io/qwik-city'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { CTX } from '../../root'

// TODO:
// signInWithEmailAndPassword has to happen client-side
// so does navigating after it
export const useLogin = routeAction$(async (data) => {
  const { email, password } = data
  console.log('login', { email, password })

  return data
})

export default component$(() => {
  const store = useContext(CTX)
  const firebaseAuth = store.firebaseAuth
  const action = useLogin()
  const navigate = useNavigate()

  const error = useSignal(null)
  const success = useSignal(null)

  useVisibleTask$(() => {
    document.getElementById('email').focus()
  })

  return (
    <>
      <div class="flex min-h-full flex-col justify-center px-6 py-0 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to manage content
          </h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form
            action={action}
            class="space-y-6"
            action="#"
            method="POST"
            onSubmit$={async () => {
              console.log('onSubmit', {
                email: email.value,
                password: password.value,
              })

              let userCredential
              try {
                userCredential = await signInWithEmailAndPassword(
                  firebaseAuth,
                  email.value,
                  password.value,
                )
              } catch (error) {
                console.error('error', error.message)
                error.value = error.message
                return
              }
              console.log('userCredential', userCredential)
              success.value = `${userCredential.user.email} logged in successfully, navigating to events`
              setTimeout(() => navigate('/'), 2000)
            }}
          >
            <div>
              <label
                for="email"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required=""
                  class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  autofocus
                />
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div class="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required=""
                  class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-blue-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Log in
              </button>
              {success.value && (
                <p class="pt-2 text-green-600 font-medium">{success.value}</p>
              )}
              {error.value && (
                <p class="pt-2 text-red-600 font-medium">{`Error loggin in: ${error.value?.message}`}</p>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  )
})