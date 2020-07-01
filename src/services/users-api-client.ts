import User, { LoginUser, CreateUser } from '../client_server/interfaces/User'
const authEndpoint = '/api/auth/login'

export function loginUser(loginUser:LoginUser): Promise<User> {
  return new Promise((resolve, reject) => {
    console.log('email :' + loginUser.email)
    console.log('password :' + loginUser.password)
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      if( response.status === 200 )
        return response.json(); // parses JSON response into native JavaScript objects
      else
        throw `received status code ${response.status}`
    }
    postData(authEndpoint, loginUser).then(
      resp => {
        console.log('loginUser resp: ', resp)
        resolve(resp.user)
      }
    ).catch(error => reject(error))
  });
}

const logoutEndpoint = '/api/auth/logout'

export function logoutUser() {
  return new Promise((resolve, reject) => {
    async function getData(url:string) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      if( response.status === 200 )
        return response
      else {
        const json = await response.json()
        throw `received status code ${response.status}\n`+json
      }
    }
    getData(logoutEndpoint).then(
      resp => {
        console.log('logoutUser resp: ', resp)
        resolve(resp)
      }
    ).catch(error => reject(error))
  });
}

const createUserEndpoint = '/api/users/add'

export function createUser(createUser:CreateUser): Promise<CreateUser> {
  console.log('here too')
  return new Promise((resolve, reject) => {
    console.log('email :' + createUser.email)
    console.log('password :' + createUser.password)
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      if( response.status === 201 )
        return response.json() // parses JSON response into native JavaScript objects
      else {
        const json = await response.json()
        throw `received status code ${response.status}\n`+json
      }
    }
    postData(createUserEndpoint, {user: createUser}).then(
      resp => {
        console.log('createUser resp: ', resp)
        resolve(resp)
      }
    ).catch(error => reject(error))
  });
}
