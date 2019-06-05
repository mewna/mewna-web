import Cookies from "universal-cookie"
import { debounce } from "throttle-debounce"

export class Storage {
  constructor() {
    this.cookies = new Cookies()
    this.listeners = []
    // We debounce the update function mainly just so that we can avoid loops
    this.update = debounce(500, false, () => this.updateRender())
  }
  
  // Permanent storage //

  get(key) {
    return this.cookies.get(key)
  }

  set(key, value, host) {
    let finalHost = ""
    if(host) {
      finalHost = host
    } else {
      finalHost = typeof window !== "undefined" ? window.location.hostname : null
    }
    return this.cookies.set(key, value, { path: "/", domain: finalHost })
  }

  // Listeners //

  addListener(callback) {
    return this.cookies.addChangeListener(callback)
  }

  removeListener(callback) {
    return this.cookies.removeChangeListener(callback)
  }

  // Utility methods //

  getLightThemeKey() {
    return "light"
  }

  getLightTheme(host) {
    if (
      this.get(this.getLightThemeKey()) === undefined ||
      this.get(this.getLightThemeKey()) === null
    ) {
      this.set(this.getLightThemeKey(), false, host)
    }
    return this.get(this.getLightThemeKey()) === "true"
  }

  setLightTheme(mode, host) {
    const res = this.set(this.getLightThemeKey(), !!mode, host)
    this.update()
    return res
  }

  getTokenKey() {
    return "token"
  }

  getToken() {
    const token = this.get(this.getTokenKey())
    // memes
    if(token === "null") {
      return null
    } else {
      return token
    }
  }

  setToken(token, host) {
    const res = this.set(this.getTokenKey(), token, host)
    this.update()
    return res
  }

  register(x) {
    this.listeners.push(x)
  }

  unregister(x) {
    this.listeners = this.listeners.filter(e => e !== x)
  }

  updateRender() {
    Object.keys(this.listeners).forEach(e => this.listeners[e] && this.listeners[e].updateRender && this.listeners[e].updateRender())
  }

  _setStore(store) {
    this.cookies = store
  }
}

const storage = new Storage()
export default storage
