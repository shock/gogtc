import * as logger from './logger-service';
import * as todos from './todos-api-client';
import * as users from './users-api-client';

export default {
  logger,
  api: {
    todos,
    users
  },
};
