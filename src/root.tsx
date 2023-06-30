import {
  component$,
  createContextId,
  useStore,
  useContextProvider,
  useVisibleTask$,
  noSerialize,
} from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
// need to polifill until well supported: https://caniuse.com/mdn-javascript_builtins_array_group
import 'core-js/actual/array/group'

import { RouterHead } from './components/router-head/router-head'
import getAuthToken from './utils/getAuthToken'
import './global.css'

export const CTX = createContextId<{
  user: string
  firebaseAuth: FirebaseApp
  editing: boolean
  eventsRefetcher: number
  articlesRefetcher: number
  publicationsRefetcher: number
}>('root')

// Configure Firebase
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  const store = useStore({
    user: '',
    firebaseAuth: undefined,
    editing: false,
    eventsRefetcher: 0,
    articlesRefetcher: 0,
    publicationsRefetcher: 0,
  })
  useContextProvider(CTX, store)

  // authenticate
  // this is client only
  useVisibleTask$(({ cleanup }) => {
    let fbApp
    // catch app already existing
    // https://stackoverflow.com/a/48686803/712005
    if (!getApps().length) {
      fbApp = initializeApp(firebaseConfig)
    } else {
      fbApp = getApp() // if already initialized, use that one
    }
    const auth = getAuth(fbApp)
    store.firebaseAuth = noSerialize(auth)
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      // console.log('App, onAuthStateChanged, user:', user)
      if (!user) {
        store.user = ''
        return
      }

      store.user = user?.uid
      // TODO: how do this server side without needing separate server?
      // somehow call server$?
      // this call is needed to log in?
      getAuthToken(user)
    })

    cleanup(() => {
      unregisterAuthObserver()
    })
  })

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <script src="https://cdn.jsdelivr.net/npm/@tinymce/tinymce-webcomponent@2/dist/tinymce-webcomponent.min.js"></script>
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
