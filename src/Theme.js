import palette from "./Palette"
import storage from "./Storage"

export default light => ({
  colors: {
    light: palette(light).light,
    med: palette(light).med,
    dark: palette(light).dark,
    brand: palette(light).brand,
    text: palette(light).text,
    hoverBackground: palette(light).hoverBackground
  }
})
