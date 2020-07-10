import User from '../client_server/interfaces/User'

export const currentUser = ():User|undefined => {
  try {
    return JSON.parse(localStorage['currentUser'])
  } catch {
    return undefined
  }
}

export const setCurrentUser = (user:User) => {
  localStorage['currentUser'] = JSON.stringify(user)
}

export const clearCurrentUser = () => { localStorage.removeItem('currentUser') }