import * as logger from './logger-service'
import * as users from './users-api-client'
import * as formCalcs from './calcs-api-client'

export default {
  logger,
  api: {
    users,
    formCalcs
  },
}
