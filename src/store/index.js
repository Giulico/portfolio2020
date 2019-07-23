import { createStore } from 'redhooks'
import reducer from './reducers'

const store = createStore(reducer, {})

export default store
