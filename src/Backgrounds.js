import plasma from "./assets/backgrounds/default/plasma.png"
import rainbowTriangles from "./assets/backgrounds/default/rainbow_triangles.png"
import triangles from "./assets/backgrounds/default/triangles.png"

import architecture from "./assets/backgrounds/premium/architecture.png"
import beach from "./assets/backgrounds/premium/beach.png"
import city from "./assets/backgrounds/premium/city.png"
import flowers from "./assets/backgrounds/premium/flowers.png"
import galaxy from "./assets/backgrounds/premium/galaxy.png"
import grid from "./assets/backgrounds/premium/grid.png"
import hearts from "./assets/backgrounds/premium/hearts.png"
import matrix from "./assets/backgrounds/premium/matrix.png"
import stars from "./assets/backgrounds/premium/stars.png"
import tree from "./assets/backgrounds/premium/tree.png"
import waves from "./assets/backgrounds/premium/waves.png"
import writingMap from "./assets/backgrounds/premium/writing-map.png"

const defaultBackgrounds = {
  "/backgrounds/default/plasma": plasma,
  "/backgrounds/default/rainbow_triangles": rainbowTriangles,
  "/backgrounds/default/triangles": triangles,
}
const premiumBackgrounds = {
  "/backgrounds/premium/architecture": architecture,
  "/backgrounds/premium/beach": beach,
  "/backgrounds/premium/city": city,
  "/backgrounds/premium/flowers": flowers,
  "/backgrounds/premium/galaxy": galaxy,
  "/backgrounds/premium/grid": grid,
  "/backgrounds/premium/hearts": hearts,
  "/backgrounds/premium/matrix": matrix,
  "/backgrounds/premium/stars": stars,
  "/backgrounds/premium/tree": tree,
  "/backgrounds/premium/waves": waves,
  "/backgrounds/premium/writing-map": writingMap,
}

export default background => {
  if(defaultBackgrounds[background]) {
    return defaultBackgrounds[background]
  } else if(premiumBackgrounds[background]) {
    return premiumBackgrounds[background]
  } else {
    // TODO: What about user-uploaded backgrounds?
    return null
  }
}
