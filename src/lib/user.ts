import User from '../client_server/interfaces/User'
export const currentUser = ():User|undefined => localStorage['currentUser']
export const setCurrentUser = (user:User) => { localStorage['currentUser'] = user }
export const clearCurrentUser = () => { delete localStorage['currentUser'] }