import React, { useCallback, useEffect } from 'react'
import { useStore } from 'redhooks'

// Styles
import style from './index.module.css'

const MenuBurger = () => {
  const { dispatch } = useStore()
  const pointerDownHandler = useCallback(() => {
    dispatch({ type: 'MENU_OPEN' })
  }, [])
  const pointerUpHandler = useCallback(() => {
    dispatch({ type: 'MENU_CLOSE' })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', pointerUpHandler)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mouseup', pointerUpHandler)
      }
    }
  }, [])

  return (
    <button className={style.root} onPointerDown={pointerDownHandler}>
      <span className={style.label}>Menu</span>
    </button>
  )
}

export default MenuBurger
