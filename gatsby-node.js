const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')
//
const JsxstylePlugin = require('jsxstyle-webpack-plugin')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const templates = result.data.allMarkdownRemark.edges

    templates.forEach(edge => {
      const id = edge.node.id
      const slug =
        edge.node.fields.slug === '/homepage/' ? '/' : edge.node.fields.slug
      const template = String(edge.node.frontmatter.templateKey)
      createPage({
        path: slug,
        component: path.resolve(`src/templates/${template}.js`),
        // additional data can be passed via context
        context: {
          id,
          template
        }
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}

// Fix to: React-Hot-Loader: react-🔥-dom patch is not detected. React 16.6+ features may not work.
// Issue: https://github.com/gatsbyjs/gatsby/issues/11934
exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  // console.log('============')
  // console.log(stage)
  // console.log('============')
  // if (stage === 'develop-html' || stage === 'build-html') {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     'pixi.js': path.resolve(__dirname, 'src', 'server', 'pixijs')
  //   }
  // }
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom'
    }
  }
}
