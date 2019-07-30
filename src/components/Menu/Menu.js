import React from 'react'
import { connect } from 'redhooks'
import { TweenLite, TimelineLite, Power3 } from 'gsap'
import FontFaceObserver from 'fontfaceobserver'
import { Container, Ticker, Text, Graphics, depth } from '../../constants'
import { Consumer } from 'gatsby-plugin-transition-link/context/createTransitionContext'

// Utils
import { navigate } from '../../utils/page-transition'

class Menu extends React.Component {
  state = {
    isAnimating: false
  }

  componentDidMount() {
    const { canvas, menuLinks } = this.props

    // if application was already published
    if (canvas.application) {
      this.items = Array.from(menuLinks, v => ({}))
      this.currIndex = this.findCurrentIndex()
      this.setup()
      // load font family
      const font = new FontFaceObserver('arek')
      font.load().then(
        font => {
          this.items.forEach(item => {
            item.text.style.fontFamily = font.family
          })
        },
        () => {
          console.log('Font is not available')
        }
      )
    }
  }

  componentDidUpdate(prevProps) {
    const {
      app: prevApp,
      canvas: prevCanvas,
      menu: prevMenu,
      location: prevLocation
    } = prevProps
    const {
      app: currApp,
      canvas: currCanvas,
      menu: currMenu,
      location: currLocation
    } = this.props

    // When application has been published
    if (!prevCanvas.application && currCanvas.application) {
      this.setup()
    }

    // Route changed
    if (prevLocation.pathname !== currLocation.pathname) {
      this.changeItemsOrder()
    }

    // Menu Burger has been triggered
    if (prevMenu.isOpen !== currMenu.isOpen) {
      if (currMenu.isOpen) {
        this.openMenu()
        this.selectedItem = 1 // 0 based, so the middle item
        window.addEventListener('mousemove', this.handlePointerDrag, false)
      } else {
        this.closeMenu()
        window.removeEventListener('mousemove', this.handlePointerDrag)
      }
    }

    // Debounced events
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = window.setTimeout(() => {
      // If App Resize
      if (
        currApp.width !== prevApp.width ||
        currApp.height !== prevApp.height
      ) {
        this.handleResize()
      }
    }, 300)
  }

  background = {
    alpha: 0
  }

  indicator = {
    alpha: 0,
    bgColor: 0xcfcfcf,
    color: 0x83ccf2,
    y: this.middlePosition - this.fontSize / 2
  }

  fontSizeMoltiplicator = 1.75

  get fontSize() {
    return Math.round(window.innerHeight / 7)
  }

  middleAlpha = 0.3

  topPosition = 0

  get middlePosition() {
    const { app } = this.props
    const { height } = app
    return height / 4
  }

  get bottomPosition() {
    const { app } = this.props
    const { height } = app
    return height
  }

  get leftPosition() {
    const { app } = this.props
    const { width } = app
    return width / 2
  }

  get leftMiddlePosition() {
    const { app } = this.props
    const { width } = app
    return width / 1.4
  }

  render() {
    return (
      <Consumer>
        {({ ...context }) => {
          this.context = context
        }}
      </Consumer>
    )
  }

  setup = () => {
    const { canvas, menuLinks } = this.props

    // Create the container and add the Text
    this.container = new Container()
    this.container.zIndex = depth.menu

    this.menuBackground = new Graphics()
    this.container.addChild(this.menuBackground)

    menuLinks.forEach((menuLink, index) => {
      this.addText(menuLink, index)
    })
    canvas.application.stage.addChild(this.container)
    // Ticker
    this.ticker = new Ticker()
    this.ticker.add(this.drawIndicators)
  }

  findCurrentIndex() {
    const { menuLinks, location } = this.props
    return menuLinks.findIndex(item => item.link === location.pathname)
  }

  addText(menuLink, index) {
    const { app } = this.props
    const { width, height } = app
    const isCurrent = this.isCurrent(index)

    this.items[index].text = new Text(menuLink.name, {
      fontFamily: 'Arial',
      fontSize: this.fontSize,
      fill: 0xcfcfcf,
      align: 'left'
    })
    this.items[index].indicator = new Graphics()

    const text = this.items[index].text
    const indicator = this.items[index].indicator
    const { bgColor, color, y, alpha } = this.indicator
    indicator
      .clear()
      // Transparent space
      .beginFill(bgColor, 1)
      .drawRect(0, 0, width, height)
      .endFill()
      // White space
      .beginFill(color, alpha)
      .drawRect(0, y, width, this.fontSize)

    indicator.mask = text

    text.anchor.set(0, 0.5)
    text.interactive = true
    text.buttonMode = !isCurrent

    // Initial position
    this.setTextPosition(text, index)

    this.container.addChild(text, indicator)

    // Events
    text.on('click', this.navigate(menuLink.link))
    text.on('mouseover', this.handleMouseover)
    text.on('mouseout', this.handleMouseout)
  }

  isCurrent = (index, currIndex = this.currIndex) => currIndex === index

  isNext = (index, currIndex = this.currIndex) => {
    const { menuLinks } = this.props
    return (
      (currIndex === menuLinks.length - 1 && index === 0) ||
      index === currIndex + 1
    )
  }

  isPrev = (index, currIndex = this.currIndex) => {
    const { menuLinks } = this.props
    return (
      (currIndex === 0 && index === menuLinks.length - 1) ||
      index === currIndex - 1
    )
  }

  navigate = to => () => {
    navigate({
      to,
      exit: {
        trigger: ({ exit, node }) => console.log(exit, node),
        length: 1
      },
      context: this.context
    })
  }

  handleMouseover = e => {
    if (this.state.isAnimating) {
      return
    }
    const { menuLinks } = this.props
    const target = e.currentTarget
    const index = menuLinks.findIndex(item => item.name === target.text)
    if (this.isNext(index)) {
      this.mouseoverBottomAnimation(target)
    } else if (this.isPrev(index)) {
      this.mouseoverTopAnimation(target)
    }
  }

  handleMouseout = e => {
    if (this.state.isAnimating) {
      return
    }
    const { menuLinks } = this.props
    const target = e.currentTarget
    const index = menuLinks.findIndex(item => item.name === target.text)
    if (this.isNext(index)) {
      this.mouseoutBottomAnimation(target)
    } else if (this.isPrev(index)) {
      this.mouseoutTopAnimation(target)
    }
  }

  mouseoverBottomAnimation = target => {
    TweenLite.to(target, 0.5, {
      y: this.bottomPosition - this.fontSize / 2,
      ease: Power3.easeOut
    })
  }

  mouseoutBottomAnimation = target => {
    TweenLite.to(target, 0.5, {
      y: this.bottomPosition,
      ease: Power3.easeOut
    })
  }

  mouseoverTopAnimation = target => {
    TweenLite.to(target, 0.5, {
      y: this.topPosition + this.fontSize / 2,
      ease: Power3.easeOut
    })
  }

  mouseoutTopAnimation = target => {
    TweenLite.to(target, 0.5, {
      y: this.topPosition,
      ease: Power3.easeOut
    })
  }

  changeItemsOrder = () => {
    // Add new event listeners after 1 second
    const prevIndex = this.currIndex
    this.currIndex = this.findCurrentIndex()

    // isAnimating
    this.setState(
      {
        isAnimating: true
      },
      () => {
        window.setTimeout(() => {
          this.setState({
            isAnimating: false
          })
        }, 1000)
      }
    )

    this.items.forEach((item, index) => {
      const text = item.text

      // Animations
      if (this.isCurrent(index)) {
        text.buttonMode = false
        const tl = new TimelineLite({ delay: 0.2 }) // Wait the prev current item
        tl.to(text.position, 0.5, {
          y: this.middlePosition,
          ease: Power3.easeIn
        })
          .to(text.style, 0.5, {
            fontSize: this.fontSize * this.fontSizeMoltiplicator,
            ease: Power3.easeOut
          })
          .add(
            TweenLite.to(text.position, 1, {
              x: this.leftMiddlePosition,
              ease: Power3.easeInOut
            }),
            0.1
          )
          .add(
            TweenLite.to(text, 0.5, {
              alpha: this.middleAlpha,
              ease: Power3.easeOut
            }),
            0.5
          )
      } else if (this.isNext(index)) {
        text.buttonMode = true
        // era il current?
        if (this.isCurrent(index, prevIndex)) {
          const tl = new TimelineLite()
          tl.to(text.position, 0.5, {
            x: this.leftPosition,
            ease: Power3.easeIn
          })
            .add(
              TweenLite.to(text.style, 0.5, {
                fontSize: this.fontSize,
                ease: Power3.easeIn
              }),
              0
            )
            .add(
              TweenLite.to(text, 0.5, {
                alpha: 1,
                ease: Power3.easeIn
              }),
              0
            )
            .to(text.position, 0.5, {
              y: this.bottomPosition,
              ease: Power3.easeOut
            })
        } else {
          const tl = new TimelineLite()
          tl.to(text.position, 0.5, {
            y: this.fontSize / -2
          })
            .set(text.position, {
              y: this.bottomPosition + this.fontSize / 2
            })
            .to(text.position, 0.5, {
              y: this.bottomPosition
            })
        }
      } else if (this.isPrev(index)) {
        text.buttonMode = true
        // era il current?
        if (this.isCurrent(index, prevIndex)) {
          const tl = new TimelineLite()
          tl.to(text.position, 0.5, {
            x: this.leftPosition,
            ease: Power3.easeIn
          })
            .add(
              TweenLite.to(text.style, 0.5, {
                fontSize: this.fontSize,
                ease: Power3.easeIn
              }),
              0
            )
            .add(
              TweenLite.to(text, 0.5, {
                alpha: 1,
                ease: Power3.easeIn
              }),
              0
            )
            .to(text.position, 0.5, {
              y: this.topPosition,
              ease: Power3.easeOut
            })
        } else {
          const tl = new TimelineLite()
          tl.to(text.position, 0.5, {
            y: this.bottomPosition + this.fontSize / 2
          })
            .set(text.position, {
              y: this.fontSize / -2
            })
            .to(text.position, 0.5, {
              y: this.topPosition
            })
        }
      } else {
        text.visible = false
      }
    })
  }

  openMenu() {
    // set isAnimating
    this.setState({ isAnimating: true })

    // Start drawing the indicators
    this.ticker.start()
    TweenLite.to([this.indicator, this.background], 0.5, {
      alpha: 1
    })

    // Align the menu items
    this.items.forEach((item, index) => {
      const text = item.text
      if (this.isCurrent(index)) {
        TweenLite.to(text, 0.5, {
          alpha: 1
        })
        TweenLite.to(text.position, 0.5, {
          x: this.leftPosition
        })
        TweenLite.to(text.style, 0.3, {
          fontSize: this.fontSize
        })
      } else if (this.isPrev(index)) {
        TweenLite.to(text.position, 0.5, {
          y: this.middlePosition - this.fontSize
        })
      } else if (this.isNext(index)) {
        TweenLite.to(text.position, 0.5, {
          y: this.middlePosition + this.fontSize
        })
      }
    })
  }

  closeMenu() {
    const fontSize = this.fontSize
    // Indicator
    TweenLite.to(this.indicator, 0.5, {
      alpha: 0
    })
    TweenLite.set(this.indicator, {
      y: this.middlePosition - fontSize / 2,
      delay: 0.5
    })
    // Backgroud
    TweenLite.to(this.background, 0.5, {
      alpha: 0
    })
    if (this.selectedItem !== 1) {
      // Find the items
      const firstItem = this.items.reduce((prev, curr) => {
        return curr.text.y < prev.text.y ? curr : prev
      }, this.items[0])
      const firstItemIndex = this.items.findIndex(
        item => item.text.text === firstItem.text.text
      )
      const secondItemIndex =
        firstItemIndex + 1 > this.items.length - 1 ? 0 : firstItemIndex + 1

      const thirdItemIndex =
        secondItemIndex + 1 > this.items.length - 1 ? 0 : secondItemIndex + 1
      const thirdItem = this.items[thirdItemIndex]

      // Fist item selected
      if (this.selectedItem === 0) {
        const pathname = this.props.menuLinks.find(
          menuLink => menuLink.name === firstItem.text.text
        ).link
        this.navigate(pathname)()
      }
      // Last item selected
      if (this.selectedItem === 2) {
        const pathname = this.props.menuLinks.find(
          menuLink => menuLink.name === thirdItem.text.text
        ).link
        this.navigate(pathname)()
      }
    } else {
      // Close the menu
      this.items.forEach((item, index) => {
        const text = item.text
        if (this.isCurrent(index)) {
          TweenLite.to(text, 0.5, {
            alpha: this.middleAlpha
          })
          TweenLite.to(text.position, 0.5, {
            x: this.leftMiddlePosition,
            onComplete: () => {
              // Stop drawing the indicator
              this.ticker.stop()
              this.setState({ isAnimating: false })
            }
          })
          TweenLite.to(text.style, 0.5, {
            fontSize: fontSize * this.fontSizeMoltiplicator
          })
        } else if (this.isPrev(index)) {
          TweenLite.to(text.position, 0.5, {
            y: this.topPosition
          })
        } else if (this.isNext(index)) {
          TweenLite.to(text.position, 0.5, {
            y: this.bottomPosition
          })
        }
      })
    }

    // if (this.selectedItem === 0) {
    //   const tlThirdItem = new TimelineLite()
    //   tlThirdItem
    //     .to(thirdItem.text, 0.5, {
    //       y: this.bottomPosition + fontSize
    //     })
    //     .set(thirdItem.text, {
    //       y: this.topPosition - fontSize
    //     })
    //     .to(thirdItem.text, 0.5, {
    //       y: this.topPosition
    //     })
    //   TweenLite.to(secondItem.text, 0.5, {
    //     y: this.bottomPosition,
    //     delay: 0.1
    //   })
    //   const tlFirstItem = new TimelineLite({
    //     onComplete: () => {
    //       // const pathname = this.props.menuLinks.find(
    //       //   menuLink => menuLink.name === firstItem.text.text
    //       // ).link
    //       // this.navigate(pathname)()
    //     }
    //   })
    //   tlFirstItem
    //     .to(firstItem.text, 0.5, {
    //       y: this.middlePosition,
    //       delay: 0.2
    //     })
    //     .to(firstItem.text, 0.5, {
    //       alpha: this.middleAlpha,
    //       x: this.leftMiddlePosition
    //     })
    //     .add(
    //       TweenLite.to(firstItem.text.style, 0.5, {
    //         fontSize: fontSize * this.fontSizeMoltiplicator
    //       }),
    //       0.5
    //     )
    // } else if (this.selectedItem === 2) {
    //   console.log('metti l"ultima in centro')
    // } else {
    // Menu items
    // }
  }

  drawIndicators = () => {
    const { app } = this.props
    const { width, height } = app
    const { alpha, bgColor, color, y } = this.indicator
    this.items.forEach((item, index) => {
      const indicator = item.indicator
      indicator
        .clear()
        // Transparent space
        .beginFill(bgColor, 1)
        .drawRect(0, 0, width, height)
        .endFill()
        // White space
        .beginFill(color, alpha)
        .drawRect(0, y, width, this.fontSize)
    })
    // Draw background
    this.menuBackground
      .clear()
      .beginFill(0xffffff, this.background.alpha)
      .drawRect(0, 0, width, height)
      .endFill()
  }

  setTextPosition(text, index) {
    if (this.isCurrent(index)) {
      text.position.set(this.leftMiddlePosition, this.middlePosition)
      text.style.fontSize = this.fontSize * this.fontSizeMoltiplicator
      text.alpha = this.middleAlpha
    } else if (this.isNext(index)) {
      text.position.set(this.leftPosition, this.bottomPosition)
      text.alpha = 1
    } else if (this.isPrev(index)) {
      text.position.set(this.leftPosition, this.topPosition)
      text.alpha = 1
    } else {
      text.visible = false
    }
  }

  handlePointerDrag = e => {
    const y = e.y
    const middlePosition = this.middlePosition
    const fontSize = this.fontSize
    if (y <= middlePosition - fontSize / 2 && this.selectedItem !== 0) {
      this.selectedItem = 0
      TweenLite.to(this.indicator, 1, {
        y: middlePosition - fontSize * 1.5,
        ease: Power3.easeOut
      })
    } else if (
      y > middlePosition - fontSize / 2 &&
      y <= middlePosition + fontSize / 2 &&
      this.selectedItem !== 1
    ) {
      this.selectedItem = 1
      TweenLite.to(this.indicator, 1, {
        y: middlePosition - fontSize / 2,
        ease: Power3.easeOut
      })
    } else if (y > middlePosition + fontSize / 2 && this.selectedItem !== 2) {
      this.selectedItem = 2
      TweenLite.to(this.indicator, 1, {
        y: middlePosition + fontSize / 2,
        ease: Power3.easeOut
      })
    }
  }

  handleResize = () => {
    this.items.forEach((item, index) => {
      const text = item.text
      this.setTextPosition(text, index)
    })
  }
}

const mapStateToProps = state => ({
  app: state.app,
  menu: state.menu,
  canvas: state.canvas
})

export default connect(mapStateToProps)(Menu)
