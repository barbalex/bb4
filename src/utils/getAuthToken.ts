const getAuthToken = async (user) => {
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'
  const hostToUse = isLocalhost ? 'blue-borders.ch' : hostnameWithoutWww

  let res
  try {
    const response = await fetch(
      `https://auth.${hostToUse}/add-hasura-claims/${user?.uid}`,
    )
    res = await response.json()
  } catch (error) {
    console.log('error from getting claims from auth.blue-borders.ch:', error)
  }
  //console.log('getAuthToken, res:', res)
  if (res?.status === 200) {
    let token
    try {
      token = await user.getIdToken(true)
    } catch (error) {
      console.log('error from calling getting id token:', error)
    }
    // set token to localStorage so authLink picks it up on next db call
    // see: https://www.apollographql.com/docs/react/networking/authentication/#header
    // see: https://github.com/apollographql/subscriptions-transport-ws/issues/171#issuecomment-348492358
    // see: https://github.com/apollographql/subscriptions-transport-ws/issues/171#issuecomment-406859244
    window.localStorage.setItem('token', token)
  }
  return true
}

export default getAuthToken
