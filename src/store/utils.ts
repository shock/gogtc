import { composeWithDevTools } from 'redux-devtools-extension'
// TODO: NOTE: Enabling tracing has a performance penalty
export const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 })


// Original code from `typesafe-action` sandbox vvv

// import { compose } from 'redux'

// export const composeEnhancers =
//   (process.env.NODE_ENV === 'development' &&
//     window &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose
