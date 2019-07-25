const defaultState = {
  isOpen: false
}

// function reducer
const menu = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'MENU_OPEN':
      return {
        ...state,
        isOpen: true
      }
    case 'MENU_CLOSE':
      return {
        ...state,
        isOpen: false
      }
    default:
      return state
  }
}

export default menu
