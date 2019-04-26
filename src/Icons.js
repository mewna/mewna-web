import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faCogs,
  faNewspaper,
  faUser,
  faTrophy,
  faTrash,
  faMedal,
  faHeart
} from "@fortawesome/free-solid-svg-icons"
import {
  faHeart as farHeart
} from "@fortawesome/free-regular-svg-icons"

export default () => {
  library.add(faCogs, faNewspaper, faUser, faTrophy, faTrash, faMedal, faHeart, farHeart)
}
