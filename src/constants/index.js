const PIXI = require('pixi.js')

module.exports = {
  // PIXI.js
  Application: PIXI.Application,
  autoDetectRenderer: PIXI.autoDetectRenderer,
  Loader: PIXI.Loader,
  Container: PIXI.Container,
  Sprite: PIXI.Sprite,
  Text: PIXI.Text,
  Texture: PIXI.Texture,
  Ticker: PIXI.Ticker,
  Filter: PIXI.Filter,
  filters: PIXI.filters,
  Graphics: PIXI.Graphics,
  Point: PIXI.Point,
  Rectangle: PIXI.Rectangle,
  Circle: PIXI.Circle,
  depth: {
    displacedBackground: 1,
    menu: 10,
    cursor: 20
  },
  // Env
  DEFAULT_LANGUAGE: 'it',
  ENV: process.env.NODE_ENV,
  API: {
    LABELS: '/labels',
    PRODUCTS: '/products',
    HP: '/hp'
  }
}
