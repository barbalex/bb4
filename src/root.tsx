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
import { initializeApp, getApps, getApp } from 'firebase/app'

import { RouterHead } from './components/router-head/router-head'
import getAuthToken from './utils/getAuthToken'
import './global.css'

export const CTX = createContextId('root')

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
  // TODO: use store for what?
  const store = useStore({ user: undefined, firebaseAuth: undefined })
  useContextProvider(CTX, store)

  useVisibleTask$(({ cleanup }) => {
    // authenticate
    let fbApp
    // catch app already existing
    // https://stackoverflow.com/a/48686803/712005
    if (!getApps().length) {
      fbApp = initializeApp(firebaseConfig)
    } else {
      fbApp = getApp() // if already initialized, use that one
    }
    const auth = getAuth(fbApp)
    console.log('root, visibleTast', { fbApp, auth })
    store.firebaseAuth.value = noSerialize(auth)
    console.log('root, hi')
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      // BEWARE: this is called at least twice
      // https://stackoverflow.com/questions/37673616/firebase-android-onauthstatechanged-called-twice
      if (store.login?.user?.uid) return
      if (!user) return
      // console.log('App, onAuthStateChanged, user:', user)
      store.user.value = noSerialize(user)
      // TODO: how do this server side without needing separate server?
      // somehow call server$?
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
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
