import User from '../features/users/models/MUser'

const authEndpoint = '/api/auth/login'

export function loginUser(username:string, password:string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    console.log('username :' + username)
    console.log('password :' + password)
    const data = {
      email: username,
      password
    }
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
      return response.json(); // parses JSON response into native JavaScript objects
    }
    postData(authEndpoint, data).then(resp => resolve(resp))
    // setTimeout(() => {
    //   resolve(undefined);
    // }, 500);
  });
}
