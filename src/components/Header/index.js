import React from 'react'
import { useStore } from 'redhooks'
import cn from 'classnames'

// Style
import style from './Header.module.css'

// Components
import MenuBurger from '../MenuBurger'

const Header = () => {
  const { state } = useStore()
  const { menu } = state

  const classes = cn({
    [style.header]: true,
    [style.menuOpen]: menu.isOpen
  })

  return (
    <header className={classes}>
      <div className={style.brand}>Giulio Collesei</div>
      <div className={style.menu}>
        <span className={style.update}>
          upd 25 july 2019
          <br />
          32 yo
        </span>
        <hr className={style.hr} align="left" />
        <MenuBurger />
      </div>
    </header>
  )
}

export default Header
