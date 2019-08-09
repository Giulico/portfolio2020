/* eslint-disable */
import { Filter } from '../../constants'
import { TweenLite, Expo } from 'gsap'

// Shaders
import mainVert from './shaders/main.vert'
import mainFrag from './shaders/main.frag'

export default class ShaderHandler {
  constructor(container, canvas, videoW, videoH) {
    this.time = 0
    this.saturation = 0.1
    this.displacement = 0.002
    this.amount = 0.3
    this.mousePos = { x: 0, y: 0 }
    this.oldMousePos = { x: 0, y: 0 }
    this.mouseVelocity = 300
    this.newVel = 5
    this.videoContainer = container
    this.canvas = canvas
    this.videoDimension = {
      x: videoW,
      y: videoH
    }

    this.uniforms = {
      mouse: { type: 'v2', value: { x: 0, y: 0 } },
      iTime: { type: 'f', value: this.time },
      iResolution: {
        type: 'v2',
        value: { x: this.videoDimension.x, y: this.videoDimension.y }
      },
      saturation: { type: 'f', value: this.saturation },
      displace: { type: 'f', value: this.displacement },
      amount: { type: 'f', value: this.amount },
      u_mouse: { type: 'v2', value: { x: 0, y: 0 } },
      u_mouse_vel: { type: 'f', value: 0 }
    }

    this.shader = new Filter(mainVert, mainFrag, this.uniforms)
    this.shader.autoFit = true
    this.videoContainer.filters = [this.shader]

    this.canvas.addEventListener(
      'mousemove',
      evt => {
        this.mousePos = {
          x: evt.clientX,
          y: evt.clientY
        }
      },
      false
    )

    this.IU = setInterval(this.update, 26)
  }

  desaturate = () => {
    TweenLite.to(this, 1, { saturation: 0, ease: Expo.easeIn })
  }

  saturate = (val = 1) => {
    const dVal = val || 1
    TweenLite.to(this, 1, { saturation: dVal, ease: Expo.easeIn })
  }

  switchVideo = () =>
    new Promise(resolve => {
      TweenLite.to(this, 0.5, {
        displacement: 1,
        ease: Expo.easeIn,
        onComplete: () => {
          // callback();
          resolve()
          this.normalize(0.5)
        }
      })
    })

  disappear = () => {
    TweenLite.to(this, 0.4, { mouseVelocity: 500, ease: Expo.easeOut })
  }

  appear = () => {
    TweenLite.fromTo(this, 1.5, { mouseVelocity: 500 }, { mouseVelocity: 0 })
  }

  displace = () => {
    TweenLite.to(this, 0.4, { displacement: 1, ease: Expo.easeIn })
  }

  normalize = (vel = 1) => {
    const dVel = vel || 1
    TweenLite.to(this, dVel, { displacement: 0, ease: Expo.easeOut })
  }

  activate = () => {
    TweenLite.to(this, 1, { saturation: 0.2, amount: 1, ease: Expo.easeOut })
  }

  deactivate = () => {
    TweenLite.to(this, 1, { saturation: 1, amount: 0, ease: Expo.easeOut })
  }

  update = () => {
    this.newVel = Math.sqrt(
      (this.oldMousePos.x - this.mousePos.x) *
        (this.oldMousePos.x - this.mousePos.x) +
        (this.oldMousePos.y - this.mousePos.y) *
          (this.oldMousePos.y - this.mousePos.y)
    )
    this.mouseVelocity -= (this.mouseVelocity - this.newVel) / 22

    this.time += 0.1
    this.shader.uniforms.iTime = this.time
    this.shader.uniforms.saturation = this.saturation
    this.shader.uniforms.displace = this.displacement
    this.shader.uniforms.amount = this.amount
    this.shader.uniforms.u_mouse = this.mousePos
    this.shader.uniforms.u_mouse_vel = this.mouseVelocity

    this.oldMousePos = this.mousePos
  }
}
/* eslint-enable */
