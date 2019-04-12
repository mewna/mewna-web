export class Palette {
  constructor({ dark, med, light, text, hoverBackground }) {
    this.brand = "#db325c"
    this.dark = dark
    this.med = med
    this.light = light
    this.text = text
    this.hoverBackground = hoverBackground
  }
}

export const Dark = new Palette({
  dark: "#26171b",
  med: "#3a1d25",
  light: "#4d202d",
  text: "#f0f0f0",
  hoverBackground: "rgba(0, 0, 0, 0.75)"
})
export const Light = new Palette({
  dark: "#f7abc0",
  med: "#f9ceda",
  light: "#fbe1e8",
  text: "#333333",
  hoverBackground: "rgba(255, 255, 255, 0.75)"
})

// export default light => (light ? Light : Dark)

export default function palette(light) {
  if(light) {
    return Light
  } else {
    return Dark
  }
}
