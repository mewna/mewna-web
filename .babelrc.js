module.exports = {
  presets: ["@babel/preset-react", "@babel/preset-env"],
  plugins: [
    "transform-inline-environment-variables",
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
