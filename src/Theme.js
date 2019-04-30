import palette from "./Palette"

export const BRAND_COLOUR = "#DB325C"

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
