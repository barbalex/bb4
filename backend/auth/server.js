'use strict'
// see: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

const Hapi = require('@hapi/hapi')
// see: https://firebase.google.com/docs/auth/admin/manage-users
const admin = require('firebase-admin')

const serviceAccount = require('./config.js')

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 7000,
})

let firebaseInitializationError = null
// Initialize the Firebase admin SDK with your service account credentials
if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch (e) {
    firebaseInitializationError = e
  }
}

async function start() {
  server.route({
    method: '*',
    path: '/',
    handler: () => {
      return `Hello from the auth api`
    },
  })

  server.route({
    method: 'GET',
    path: '/add-hasura-claims/{uid}',
    handler: async (req, h) => {
      // Throw 500 if firebase is not configured
      if (!serviceAccount) {
        return h.response('Firebase not configured').code(500)
      }
      // Check for errors initializing firebase SDK
      if (firebaseInitializationError) {
        console.log('firebaseInitializationError:', firebaseInitializationError)
        return h
          .response(
            `firebase initalization error: ${firebaseInitializationError.message}`,
          )
          .code(500)
      }

      const uid = req.params?.uid

      const hasuraVariables = {
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': 'bb_user',
          'x-hasura-allowed-roles': ['bb_user'],
        },
      }

      return (
        admin
          .auth()
          // TODO: problem if uid is unknown?
          .setCustomUserClaims(uid, hasuraVariables)
          .then(() => {
            return h.response('user role and id set').code(200)
          })
          .catch((adminError) => {
            //console.log('Error creating custom token:', adminError)
            console.log(
              'Error creating custom token, adminError.errorInfo:',
              adminError?.errorInfo,
            )
            if (adminError.errorInfo.code === 'auth/user-not-found') {
              return h.response('user role and is set').code(200)
            }
            return h
              .response(`Error creating custom token: ${adminError.message}`)
              .code(500)
          })
      )
    },
  })
  await server.start()
  console.log(
    `${new Date().toISOString()}, auth-server running at:`,
    server.info.uri,
  )
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

start()
