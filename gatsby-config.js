var proxy = require('http-proxy-middleware')

module.exports = {
  siteMetadata: {
    title: 'Giulio Collesei',
    description: 'Portfolio of Giulio Collesei',
    menuLinks: [
      {
        name: 'Home',
        link: '/'
      },
      {
        name: 'Resume',
        link: '/resume'
      },
      {
        name: 'Projects',
        link: '/projects'
      }
    ]
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-transition-link',
      options: {
        layout: require.resolve(`./src/components/Layout`)
      }
    },
    'gatsby-plugin-glslify',
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [
          require('postcss-for'),
          require('postcss-preset-env')({
            stage: 0,
            features: {
              'nesting-rules': true
            },
            importFrom: [
              'src/styles/base/custom-media.css',
              'src/styles/base/variables.css'
            ]
          })
        ]
      }
    },
    // {
    //   // keep as first gatsby-source-filesystem plugin for gatsby image support
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     path: `${__dirname}/static/img`,
    //     name: 'uploads'
    //   }
    // },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048
            }
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static'
            }
          }
        ]
      }
    }
    // {
    //   resolve: 'gatsby-plugin-netlify-cms',
    //   options: {
    //     modulePath: `${__dirname}/src/cms/cms.js`
    //   }
    // },
    // 'gatsby-plugin-netlify' // make sure to keep it last in the array
  ]

  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  // developMiddleware: app => {
  //   app.use(
  //     '/.netlify/functions/',
  //     proxy({
  //       target: 'http://localhost:9000',
  //       pathRewrite: {
  //         '/.netlify/functions/': ''
  //       }
  //     })
  //   )
  // }
}
