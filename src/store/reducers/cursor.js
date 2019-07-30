const defaultState = {
  name: 'base',
  fixedPosition: {}
}

// function reducer
const cursor = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'CURSOR_SET_NAME':
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

export default cursor
