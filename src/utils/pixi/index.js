import { Container, Graphics, Point } from '../../constants'

/*
 *  PixiJS Background Cover/Contain Script
 *  Returns PixiJS Container
 *  ARGS:
 *  bgSize: Object with x and y representing the width and height of background. Example: {x:1280,y:720}
 *  inputSprite: Pixi Sprite containing a loaded image or other asset.  Make sure you preload assets into this sprite.
 *  type: String, either "cover" or "contain".
 *  forceSize: Optional object containing the width and height of the source sprite, example:  {x:1280,y:720}
 */
export function pixiBackground(bgSize, inputSprite, type, forceSize) {
  const sprite = inputSprite
  const bgContainer = new Container()
  const mask = new Graphics()
    .beginFill(0x8bc5ff)
    .drawRect(0, 0, bgSize.x, bgSize.y)
    .endFill()

  bgContainer.mask = mask
  bgContainer.addChild(mask)
  bgContainer.addChild(sprite)

  // debugger;
  let sp = {
    x: sprite.width,
    y: sprite.height
  }
  if (forceSize) {
    sp = forceSize
  }
  const winratio = bgSize.x / bgSize.y
  const spratio = sp.x / sp.y
  const pos = new Point(0, 0)
  let scale = 1
  if (type === 'cover' ? winratio > spratio : winratio < spratio) {
    // photo is wider than background
    scale = bgSize.x / sp.x
    pos.y = -(sp.y * scale - bgSize.y) / 2
  } else {
    // photo is taller than background
    scale = bgSize.y / sp.y
    pos.x = -(sp.x * scale - bgSize.x) / 2
  }

  sprite.scale = new Point(scale, scale)
  sprite.position = pos

  return bgContainer
}
