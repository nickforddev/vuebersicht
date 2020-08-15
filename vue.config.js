// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /node_modules\/axios/,
          resolve: { aliasFields: ['axios'] },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
          DARKSKY_API_KEY: JSON.stringify(process.env.DARKSKY_API_KEY),
        },
      }),
    ],
  },
}
