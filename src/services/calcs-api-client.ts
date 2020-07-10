import { MFormCalc } from '../features/form_calc/models'

//////////////////////////////////////////
// CREATE FormCalc
// POST - /api/form_calcs/create
const createCalcEndpoint = '/api/form_calcs/create'

export function create(formCalc:MFormCalc): Promise<{formCalc: MFormCalc, oldId: string}> {
  const preparedBody = {
    name: formCalc.name,
    json: formCalc.toJsonObject(),
    preset: formCalc.preset
  }
  return new Promise((resolve, reject) => {
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if( response.status === 201 )
        return response.json() // parses JSON response into native JavaScript objects
      else
        throw `received status code ${response.status}`
    }
    postData(createCalcEndpoint, preparedBody).then(
      resp => {
        const formCalc = MFormCalc.fromJsonObject(resp.json)
        const oldId = formCalc.id
        formCalc.id = resp.id
        formCalc.name = resp.name
        resolve({formCalc, oldId})
      }
    ).catch(error => reject(error))
  })
}

//////////////////////////////////////////
// UPDATE FormCalc
// PUT - /api/form_calcs/update/:id
const updateCalcEndpoint = '/api/form_calcs/update'

export function update(formCalc:MFormCalc): Promise<MFormCalc> {
  const preparedBody = {
    name: formCalc.name,
    json: formCalc.toJsonObject(),
    preset: formCalc.preset
  }
  return new Promise((resolve, reject) => {
    async function request(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if( response.status === 200 )
        return response.json() // parses JSON response into native JavaScript objects
      else {
        const json = await response.json()
        throw `received status code ${response.status}\n`+json
      }

    }
    const endPoint = `${updateCalcEndpoint}/${formCalc.id}`
    request(endPoint, preparedBody).then(
      resp => resolve(formCalc)
    ).catch(error => reject(error))
  })
}

//////////////////////////////////////////
// DELETE FormCalc
// DELETE - /api/form_calcs/delete/:id
const deleteCalcEndpoint = '/api/form_calcs/delete'

export function _delete(formCalc:MFormCalc): Promise<MFormCalc> {
  return new Promise((resolve, reject) => {
    async function request(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if( response.status === 200 )
        return null // parses JSON response into native JavaScript objects
      else {
        const json = await response.json()
        throw `received status code ${response.status}\n`+json
      }

    }
    const endPoint = `${deleteCalcEndpoint}/${formCalc.id}`
    request(endPoint).then(
      resp => resolve(formCalc)
    ).catch(error => reject(error))
  })
}

const getUserCalcsEndpoint = '/api/form_calcs/user'

export function getUserCalcs(): Promise<[MFormCalc]> {
  return new Promise((resolve, reject) => {
    // Default options are marked with *
    async function request(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: { 'Content-Type': 'application/json' }
      })
      if( response.status === 200 )
        return response.json() // parses JSON response into native JavaScript objects
      else {
        const json = await response.json()
        throw `received status code ${response.status}\n`+json
      }
    }
    request(getUserCalcsEndpoint).then(
      resp => resolve(resp.formCalcs.map((dbObj:any) => {
        const formCalc = MFormCalc.fromJsonObject(dbObj.json)
        formCalc.id = dbObj.id
        formCalc.name = dbObj.name
        formCalc.persisted = true
        formCalc.preset = dbObj.preset
        return formCalc
      }))
    ).catch(error => reject(error))
  })
}
