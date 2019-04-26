module.exports = {
  presets: [
    "razzle/babel",
    "@babel/preset-react",
    "@babel/preset-env"
  ],
  plugins: [
    [
      "@babel/transform-react-jsx",
      {
        pragmaFrag: "React.Fragment"
      }
    ],
    "emotion",
    "@babel/plugin-proposal-class-properties"
  ]
}
