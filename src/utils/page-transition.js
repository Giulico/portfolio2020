import { triggerTransition } from 'gatsby-plugin-transition-link/utils/triggerTransition'

export const navigate = ({ to, enter, exit, linkState = {}, context }) => {
  const event = {
    persist() {},
    preventDefault() {}
  }

  triggerTransition({
    event,
    to,
    exit: {
      trigger: ({ exit, node }) => console.log(exit, node),
      length: 1
    },
    linkState,
    ...context
  })
}
