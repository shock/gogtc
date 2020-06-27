import FormCalc from '../client_server/interfaces/FormCalc'
import { MFormCalc } from '../features/form_calc/models'

const createCalcEndpoint = '/api/form_calcs/create'

export function create(formCalc:MFormCalc): Promise<MFormCalc> {
  const preparedBody = {
    name: formCalc.name,
    json: formCalc.toJsonObject()
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
        return response.json(); // parses JSON response into native JavaScript objects
      else
        throw `received status code ${response.status}`
    }
    postData(createCalcEndpoint, preparedBody).then(
      resp => {
        const formCalc = MFormCalc.fromJsonObject(resp.json)
        formCalc.id = resp.id
        formCalc.name = resp.name
        resolve(formCalc)
      }
    ).catch(error => reject(error))
  })
}

const updateCalcEndpoint = '/api/form_calcs/update'

export function update(formCalc:MFormCalc): Promise<MFormCalc> {
  const preparedBody = {
    name: formCalc.name,
    json: formCalc.toJsonObject()
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
        return response.json(); // parses JSON response into native JavaScript objects
      else
        throw `received status code ${response.status}`
    }
    const endPoint = `${updateCalcEndpoint}/${formCalc.id}`
    request(endPoint, preparedBody).then(
      resp => resolve(formCalc)
    ).catch(error => reject(error))
  })
}
