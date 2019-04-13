import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faCogs,
  faNewspaper,
  faUser,
  faTrophy,
  faTrash
} from "@fortawesome/free-solid-svg-icons"

export default () => {
  library.add(faCogs, faNewspaper, faUser, faTrophy, faTrash)
}