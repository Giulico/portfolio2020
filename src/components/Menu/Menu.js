import React from 'react'
import { navigate } from 'gatsby'
import { Container, Text, depth } from '../../constants'
import { connect } from 'redhooks'
import { TweenLite, TimelineLite } from 'gsap'
import FontFaceObserver from 'fontfaceobserver'

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
      const font = new FontFaceObserver('ff-meta-serif-web-pro')
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
    const { canvas: prevCanvas, location: prevLocation } = prevProps
    const { canvas: currCanvas, location: currLocation } = this.props

    // When application has been published
    if (!prevCanvas.application && currCanvas.application) {
      this.setup()
    }

    // Route changed
    if (prevLocation.pathname !== currLocation.pathname) {
      this.onRouteChanged()
    }
  }

  get fontSize() {
    return Math.round(window.innerHeight / 7)
  }

  get middleAlpha() {
    return 0.3
  }

  get topPosition() {
    return 0
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
    const { width } = app
    return width / 2
  }

  get leftMiddlePosition() {
    const { app } = this.props
    const { width } = app
    return width / 1.25
  }

  render() {
    return null
  }

  setup = () => {
    const { canvas, menuLinks } = this.props
    // Create the container and add the Text
    this.container = new Container()
    this.container.zIndex = depth.menu
    menuLinks.forEach((menuLink, index) => {
      this.addText(menuLink, index)
    })
    canvas.application.stage.addChild(this.container)
  }

  findCurrentIndex() {
    const { menuLinks, location } = this.props
    return menuLinks.findIndex(item => item.link === location.pathname)
  }

  addText(menuLink, index) {
    const item = this.items[index]
    const isCurrent = this.isCurrent(index)

    item.text = new Text(menuLink.name, {
      fontFamily: 'Arial',
      fontSize: this.fontSize,
      fill: 0xc5c5c5,
      align: 'left'
    })
    const text = item.text
    text.anchor.set(0, 0.5)
    text.interactive = true
    text.buttonMode = !isCurrent

    // Initial position
    if (isCurrent) {
      text.position.set(this.leftMiddlePosition, this.middlePosition)
      text.style.fontSize = this.fontSize * 1.5
      text.alpha = this.middleAlpha
    } else if (this.isNext(index)) {
      text.position.set(this.leftPosition, this.bottomPosition)
    } else if (this.isPrev(index)) {
      text.position.set(this.leftPosition, this.topPosition)
    } else {
      text.visible = false
    }
    text.on('click', this.navigate(menuLink.link))
    text.on('mouseover', this.handleMouseover)
    text.on('mouseout', this.handleMouseout)
    this.container.addChild(text)
  }

  isCurrent = (index, currIndex = this.currIndex) => currIndex === index

  isNext = index => {
    const { menuLinks } = this.props
    return (
      (this.currIndex === menuLinks.length - 1 && index === 0) ||
      index === this.currIndex + 1
    )
  }

  isPrev = index => {
    const { menuLinks } = this.props
    return (
      (this.currIndex === 0 && index === menuLinks.length - 1) ||
      index === this.currIndex - 1
    )
  }

  navigate = link => () => {
    navigate(link)
  }

  handleMouseover = e => {
    if (this.state.isAnimating) {
      return
    }
    const { menuLinks } = this.props
    const target = e.currentTarget
    const index = menuLinks.findIndex(item => item.name === target.text)
    if (this.isNext(index)) {
      this.onMouseoverBottomItem(target)
    } else if (this.isPrev(index)) {
      this.onMouseoverTopItem(target)
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
      this.onMouseoutBottomItem(target)
    } else if (this.isPrev(index)) {
      this.onMouseoutTopItem(target)
    }
  }

  onMouseoverBottomItem = target => {
    TweenLite.to(target, 0.5, {
      y: this.bottomPosition - this.fontSize / 2
    })
  }

  onMouseoutBottomItem = target => {
    TweenLite.to(target, 0.5, {
      y: this.bottomPosition
    })
  }

  onMouseoverTopItem = target => {
    TweenLite.to(target, 0.5, {
      y: this.topPosition + this.fontSize / 2
    })
  }

  onMouseoutTopItem = target => {
    TweenLite.to(target, 0.5, {
      y: this.topPosition
    })
  }

  onRouteChanged = () => {
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
        const tl = new TimelineLite({ delay: 0.5 }) // Wait the prev current item
        tl.to(text.position, 0.5, {
          y: this.middlePosition
        })
          .to(text.style, 0.5, {
            fontSize: this.fontSize * 1.5
          })
          .add(
            TweenLite.to(text.position, 0.5, {
              x: this.leftMiddlePosition
            }),
            0.5
          )
          .add(
            TweenLite.to(text, 0.5, {
              alpha: this.middleAlpha
            }),
            0.5
          )
      } else if (this.isNext(index)) {
        text.buttonMode = true
        // era il current?
        if (this.isCurrent(index, prevIndex)) {
          const tl = new TimelineLite()
          tl.to(text.position, 0.05, {
            x: this.leftPosition
          })
            .add(
              TweenLite.to(text.style, 0.5, {
                fontSize: this.fontSize
              }),
              0
            )
            .add(
              TweenLite.to(text, 0.5, {
                alpha: 1
              }),
              0
            )
            .to(text.position, 0.5, {
              y: this.bottomPosition
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
          tl.to(text.position, 0.05, {
            x: this.leftPosition
          })
            .add(
              TweenLite.to(text.style, 0.5, {
                fontSize: this.fontSize
              }),
              0
            )
            .add(
              TweenLite.to(text, 0.5, {
                alpha: 1
              }),
              0
            )
            .to(text.position, 0.5, {
              y: this.topPosition
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
}

const mapStateToProps = state => ({
  app: state.app,
  canvas: state.canvas
})

export default connect(mapStateToProps)(Menu)
