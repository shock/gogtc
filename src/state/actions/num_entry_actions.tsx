import { UPDATE_NUM_ENTRY } from './action_types';

export const updateNumEntry = (id, value) => dispatch => {
  console.log(`updateNumEntry called with id: ${id}, value: ${value}`)
  let payload = {
    id: id,
    value: value
  };
  dispatch(
    {
      type: UPDATE_NUM_ENTRY,
      payload: payload
    }
  )
}