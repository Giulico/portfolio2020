import React from 'react'
import { connect } from 'redhooks'
import { TweenLite, TimelineLite, Power3, Power4 } from 'gsap'
import FontFaceObserver from 'fontfaceobserver'
import { Container, Ticker, Text, Graphics, depth } from '../../constants'
import { Consumer } from 'gatsby-plugin-transition-link/context/createTransitionContext'

// Utils
import { navigate } from '../../utils/page-transition'
import { proximityFactor } from '../../utils/numbers'
import { timer } from '../../utils/async'

class Menu extends React.Component {
  state = {
    isAnimating: false
  }

  async componentDidMount() {
    const { canvas, menuLinks } = this.props

    // if application was already published
    if (canvas.application) {
      this.items = Array.from(menuLinks, v => ({}))
      this.currIndex = this.findCurrentIndex()
      this.setupItems()
      await this.loadFont()
      this.updateItemsRect()
    }

    // Hover effect
    window.addEventListener('mousemove', this.handleMouseMove, false)
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
      this.setupItems()
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

  prevItemRect = {}

  nextItemRect = {}

  middleAlpha = 0.3

  topPosition = 0

  fontSizeMoltiplicator = 1.75

  get fontSize() {
    const { app } = this.props
    const { isTabletOrMobile, isPortrait } = app
    return isTabletOrMobile && isPortrait
      ? Math.round(window.innerWidth / 6)
      : Math.round(window.innerHeight / 7)
  }

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
    const { width, isTabletOrMobile, isPortrait } = app
    return isTabletOrMobile && isPortrait ? width / 3 : width / 2
  }

  get leftMiddlePosition() {
    const { app } = this.props
    const { width, isTabletOrMobile, isPortrait } = app
    return isTabletOrMobile && isPortrait ? width / 2 : width / 1.4
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

  setupItems = () => {
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

  loadFont() {
    // load font family
    const font = new FontFaceObserver('arek')
    return font.load().then(
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

  findCurrentIndex() {
    const { menuLinks, location } = this.props
    return menuLinks.findIndex(item => item.link === location.pathname)
  }

  addText(menuLink, index) {
    const { app } = this.props
    const { width, height } = app

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
    text.buttonMode = false
    text.alpha = 0
    this.container.addChild(text, indicator)

    // Initial position
    // this.setTextPosition(text, index)
    timer(2500)
      .then(() => this.moveTextToItsPosition(text, index))
      .then(() => this.updateItemsRect())

    // Events
    text.on('click', this.navigate(menuLink.link))
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

  // handleMouseover = e => {
  //   if (this.state.isAnimating) {
  //     return
  //   }
  //   const { menuLinks } = this.props
  //   const target = e.currentTarget
  //   const index = menuLinks.findIndex(item => item.name === target.text)
  //   if (this.isNext(index)) {
  //     this.mouseoverBottomAnimation(target)
  //   } else if (this.isPrev(index)) {
  //     this.mouseoverTopAnimation(target)
  //   }
  // }

  // handleMouseout = e => {
  //   if (this.state.isAnimating) {
  //     return
  //   }
  //   const { menuLinks } = this.props
  //   const target = e.currentTarget
  //   const index = menuLinks.findIndex(item => item.name === target.text)
  //   if (this.isNext(index)) {
  //     this.mouseoutBottomAnimation(target)
  //   } else if (this.isPrev(index)) {
  //     this.mouseoutTopAnimation(target)
  //   }
  // }

  // mouseoverBottomAnimation = target => {
  //   TweenLite.to(target, 0.5, {
  //     y: this.bottomPosition - this.fontSize / 2,
  //     ease: Power3.easeOut
  //   })
  // }

  // mouseoutBottomAnimation = target => {
  //   TweenLite.to(target, 0.5, {
  //     y: this.bottomPosition,
  //     ease: Power3.easeOut
  //   })
  // }

  // mouseoverTopAnimation = target => {
  //   TweenLite.to(target, 0.5, {
  //     y: this.topPosition + this.fontSize / 2,
  //     ease: Power3.easeOut
  //   })
  // }

  // mouseoutTopAnimation = target => {
  //   TweenLite.to(target, 0.5, {
  //     y: this.topPosition,
  //     ease: Power3.easeOut
  //   })
  // }

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
        // era il current?
        if (this.isCurrent(index, prevIndex)) {
          const tl = new TimelineLite({ onComplete: this.updateItemsRect })
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
          const tl = new TimelineLite({ onComplete: this.updateitemsrect })
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
        // era il current?
        if (this.isCurrent(index, prevIndex)) {
          const tl = new TimelineLite({ onComplete: this.updateItemsRect })
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
          const tl = new TimelineLite({ onComplete: this.updateItemsRect })
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
      alpha: 1,
      delay: 0
    })

    // Align the menu items
    this.items.forEach((item, index) => {
      const text = item.text
      if (this.isCurrent(index)) {
        TweenLite.to(text, 0.7, {
          alpha: 1
        })
        TweenLite.to(text.position, 0.7, {
          x: this.leftPosition,
          ease: Power4.easeOut
        })
        TweenLite.to(text.style, 0.5, {
          fontSize: this.fontSize,
          ease: Power4.easeOut
        })
      } else if (this.isPrev(index)) {
        TweenLite.to(text.position, 0.7, {
          y: this.middlePosition - this.fontSize,
          ease: Power4.easeOut
        })
      } else if (this.isNext(index)) {
        TweenLite.to(text.position, 1, {
          y: this.middlePosition + this.fontSize,
          ease: Power4.easeOut
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
          TweenLite.to(text, 0.7, {
            alpha: this.middleAlpha,
            ease: Power4.easeOut
          })
          TweenLite.to(text.position, 1.2, {
            x: this.leftMiddlePosition,
            ease: Power4.easeOut,
            onComplete: () => {
              // Stop drawing the indicator
              this.ticker.stop()
              this.setState({ isAnimating: false })
            }
          })
          TweenLite.to(text.style, 1, {
            fontSize: fontSize * this.fontSizeMoltiplicator,
            ease: Power4.easeOut
          })
        } else if (this.isPrev(index)) {
          TweenLite.to(text.position, 0.7, {
            y: this.topPosition,
            ease: Power4.easeOut
          })
        } else if (this.isNext(index)) {
          TweenLite.to(text.position, 1, {
            y: this.bottomPosition,
            ease: Power4.easeOut
          })
        }
      })
    }
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

  moveTextToItsPosition(text, index) {
    const { app } = this.props
    const { width } = app
    return new Promise(resolve => {
      if (this.isCurrent(index)) {
        text.position.set(width, this.middlePosition)
        text.style.fontSize = this.fontSize * this.fontSizeMoltiplicator
        TweenLite.to(text.position, 1.5, {
          x: this.leftMiddlePosition,
          onComplete: resolve
        })
        TweenLite.to(text, 1.5, {
          alpha: this.middleAlpha
        })
      } else if (this.isNext(index)) {
        text.position.set(
          this.leftPosition,
          this.bottomPosition + text.height / 2
        )
        TweenLite.to(text.position, 1.5, {
          y: this.bottomPosition
        })
        TweenLite.to(text, 1.5, {
          alpha: 1
        })
      } else if (this.isPrev(index)) {
        text.position.set(this.leftPosition, this.topPosition - text.height / 2)
        TweenLite.to(text.position, 1.5, {
          y: this.topPosition
        })
        TweenLite.to(text, 1.5, {
          alpha: 1
        })
      } else {
        text.visible = false
      }
    })
  }

  updateItemsRect = () => {
    this.items.forEach((item, index) => {
      const text = item.text
      if (this.isNext(index)) {
        this.nextItemRect = {
          ref: text,
          x: text.x,
          y: text.y,
          width: text.width,
          height: text.height
        }
      }
      if (this.isPrev(index)) {
        this.prevItemRect = {
          ref: text,
          x: text.x,
          y: text.y,
          width: text.width,
          height: text.height
        }
      }
    })
  }

  handleMouseMove = e => {
    const { x, y } = e
    const { isAnimating } = this.state
    // hai la posizione del mouse e i rect degli items prev e next
    // crea una funzione pura che ritorna da 0 a 1 a seconda della vicinanza
    const prevProximity = proximityFactor({ x, y }, this.prevItemRect)
    const nextProximity = proximityFactor({ x, y }, this.nextItemRect)

    if (!isAnimating && prevProximity !== 0) {
      this.isMouseOnPrevItem = true
      const item = this.prevItemRect.ref
      TweenLite.to(item, 0.3, {
        y: (this.fontSize * prevProximity) / 2
      })
    }
    if (!isAnimating && nextProximity !== 0) {
      const item = this.nextItemRect.ref
      this.isMouseOnNextItem = true
      TweenLite.to(item, 0.3, {
        y: this.bottomPosition - (this.fontSize * nextProximity) / 2
      })
    }
    // Se sei appena uscitom ripristina
    if (!isAnimating && prevProximity === 0 && this.isMouseOnPrevItem) {
      this.isMouseOnPrevItem = false
      const item = this.prevItemRect.ref
      TweenLite.to(item, 0.7, {
        y: this.topPosition,
        ease: Power3.easeOut
      })
    }
    if (!isAnimating && nextProximity === 0 && this.isMouseOnNextItem) {
      this.isMouseOnNextItem = false
      const item = this.nextItemRect.ref
      TweenLite.to(item, 0.7, {
        y: this.bottomPosition,
        ease: Power3.easeOut
      })
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
      this.drawIndicators()
    })
  }
}

const mapStateToProps = state => ({
  app: state.app,
  menu: state.menu,
  canvas: state.canvas
})

export default connect(mapStateToProps)(Menu)
