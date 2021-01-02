const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @type import('webpack').Configuration */
module.exports = {
  devtool: 'source-map',
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          projectReferences: true,
          configFile: require.resolve('./tsconfig.json'),
          compilerOptions: {
            // build still catches these. avoid them during bunding time for a nicer dev experience.
            noUnusedLocals: false,
            noUnusedParameters: false,
          },
        },
      },
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: __dirname + '/dist' // path to director where assets folder is located
                }
            },
              "css-loader",
              "sass-loader"
            ]
          },
          {
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json','.scss','.css'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
  devServer: {
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': 'http://localhost:3000',
    },
  }, // workaround webpack-dev-server#2943
};
