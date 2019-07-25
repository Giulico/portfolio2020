import React from 'react'
import Helmet from 'react-helmet'
import useSiteMetadata from '../SiteMetadata'
import Provider from 'redhooks'

// Styles
import '../../styles/app.css'
import style from './Layout.module.css'

// Store
import store from '../../store'

// Components
import App from '../App'
import Canvas from '../Canvas'
import Frame from '../Frame'
import Menu from '../Menu'
import MenuBurger from '../MenuBurger'

const Layout = ({ children, location, pageContext }) => {
  const { title, description, menuLinks } = useSiteMetadata()
  return (
    <Provider store={store}>
      <Helmet title={title}>
        <html lang="en" />
        <meta name="description" content={description} />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/img/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/img/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/img/favicon-16x16.png"
          sizes="16x16"
        />

        <link
          rel="mask-icon"
          href="/img/safari-pinned-tab.svg"
          color="#ff4400"
        />
        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta property="og:image" content="/img/og-image.jpg" />
      </Helmet>
      <Canvas />
      <Frame />
      <Menu menuLinks={menuLinks} location={location} />
      <header className={style.header}>
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
      <main className={style.main}>
        <App>{children}</App>
      </main>
    </Provider>
  )
}

export default Layout
