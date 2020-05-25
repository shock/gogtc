import { UPDATE_NUM_ENTRY } from '../actions/action_types';
import { merge } from 'lodash';
import { isCompositeComponent } from 'react-dom/test-utils';

const initialState = {
  value: {}
}

const fieldReducer = function(state = initialState, action) {
  let data = {}
  switch (action.type) {
    case UPDATE_NUM_ENTRY:
      console.log("STATE:");
      console.log(state);
      console.log("ACTION:");
      console.log(action);
      switch (action.payload.id) {
        case 'Infantry':
        case 'Distance':
          data = {
            'Distance': state.value['Distance'],
            'Infantry': state.value['Infantry']
          }
          const marchCap = parseInt(state.value['march_cap']);
          let value = parseInt(action.payload.value);
          if( value > marchCap ) { value = marchCap };
          data[action.payload.id] = value;
          const infantry = parseInt(data['Infantry']);
          const distance = parseInt(data['Distance']);
          const tierSum = infantry + distance;
          console.log(`infantry: ${data['Infantry']}`);
          console.log(`distance: ${data['Distance']}`);
          console.log(`tierSum: ${tierSum}`);
          console.log(`marchCap: ${marchCap}`);
          if(tierSum > marchCap) {
            switch (action.payload.id) {
              case 'Infantry':
                data['Distance'] = marchCap - value;
                break;
              case 'Distance':
                data['Infantry'] = marchCap - value;
                break;
            }
          }
          break;
        default:
          data[action.payload.id] = action.payload.value;

      }

      return {
        ...state,
        value: {
          ...state.value,
          ...data
        }
      }
    default:
      return state;
  }
}
export default fieldReducer;