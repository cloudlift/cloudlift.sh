const queries = require(`./utils/algolia-queries`)
const versions = require('./content/versions.json')

const siteMetadata = {
  title: `Cloud Lift`,
  description: `To do`,
  author: `@cloudlift`,
  siteUrl: `https://www.cloudlift.sh`,
  canonical: `https://www.cloudlift.sh`,
  twitter: `@cloudlift`,
  image: `https://www.cloudlift.sh/images/card.jpg`,
  keywords: [`cloud`, `lift`, `spring`],
}

const arrVars = Object.entries(versions).map(([name, version]) => {
  const vars = Object.assign({}, require(`./data/${version}/variables.json`))
  if (name === 'current') {
    vars.currentPath = `/docs`
    vars.version = version
  } else {
    vars.currentPath = `/docs/${version}`
    vars.version = version
  }
  return {
    version,
    vars,
  }
})

const plugins = [
  {
    resolve: 'gatsby-plugin-webpack-bundle-analyzer',
    options: {
      analyzerPort: 3000,
      production: true,
      openAnalyzer: false,
    },
  },
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-sass`,
  `gatsby-plugin-sitemap`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images/`,
    },
  },
  {
    resolve: `gatsby-plugin-prefetch-google-fonts`,
    options: {
      fonts: [
        {
          family: `Source Sans Pro`,
          subsets: [`latin`],
          variants: [`100`, `400`, `600`, `700`],
        },
        {
          family: `Karla`,
          subsets: [`latin`],
          variants: [`100`, `300`, `400`, `700`],
        },
      ],
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `md`,
      path: `${__dirname}/data/`,
      ignore: [`**/.*`],
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `spring-remark-download`,
        `spring-remark-embed-markdown`,
        `spring-remark-embed-code`,
        `spring-remark-question`,
        {
          resolve: 'spring-remark-embed-video',
          options: {
            width: 800,
            height: 400,
          },
        },
        {
          resolve: `gatsby-remark-images`,
          options: {
            withWebp: true,
            linkImagesToOriginal: false,
            quality: 80,
            maxWidth: 800,
          },
        },
        {
          resolve: 'gatsby-remark-copy-linked-files',
        },
        `gatsby-remark-draw`,
        `gatsby-remark-grid-tables`,
        `gatsby-remark-autolink-headers`,
        `gatsby-remark-code-titles`,
        `gatsby-remark-external-links`,
        {
          resolve: 'gatsby-remark-mermaid',
          options: {
            theme: null,
          },
        },
        {
          resolve: 'spring-remark-variables',
          options: {
            arrVars: arrVars,
          },
        },
        `gatsby-remark-responsive-iframe`,
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: 'language-',
          },
        },
        {
          resolve: 'gatsby-remark-custom-blocks',
          options: {
            blocks: {
              warning: {
                classes: 'admonition warning',
                title: 'optional',
              },
              note: {
                classes: 'admonition note',
                title: 'optional',
              },
              caution: {
                classes: 'admonition caution',
                title: 'optional',
              },
              important: {
                classes: 'admonition important',
                title: 'optional',
              },
              tip: {
                classes: 'admonition tip',
                title: 'optional',
              },
            },
          },
        },
        `spring-remark-code`,
        `spring-remark-callout`,
        `spring-remark-admonition`,
        `spring-remark-tabs`,
      ],
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  `gatsby-plugin-catch-links`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `cloud-lift`,
      short_name: `lift`,
      start_url: `/`,
      background_color: `#6db33f`,
      theme_color: `#6db33f`,
      display: `minimal-ui`,
      icon: `src/images/dataflow-icon.png`,
    },
  },
]

if (process.env.ALGOLIA_ADMIN_KEY_PASSWORD) {
  process.env.ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY_PASSWORD
}

if (process.env.ALGOLIA_ADMIN_KEY) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: `TODO`,
      apiKey: `${process.env.ALGOLIA_ADMIN_KEY}`,
      queries,
      chunkSize: 10000, // default: 1000
    },
  })
}

if (process.env.GOOGLE_TAGMANAGER_ID) {
  plugins.push({
    resolve: `gatsby-plugin-google-tagmanager`,
    options: {
      id: `${process.env.GOOGLE_TAGMANAGER_ID}`,
    },
  })
}

if (process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
  plugins.push({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: `${process.env.GOOGLE_ANALYTICS_TRACKING_ID}`,
    },
  })
}

module.exports = {
  siteMetadata,
  plugins,
}