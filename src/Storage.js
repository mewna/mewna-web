import Cookies from "universal-cookie"

export class Storage {
  constructor() {
    this.cookies = new Cookies()
    this.listeners = []
  }
  
  // Permanent storage //

  get(key) {
    return this.cookies.get(key)
  }

  set(key, value) {
    const res = this.cookies.set(key, value, { path: "/" })
    return res
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

  getLightTheme() {
    if (
      this.get(this.getLightThemeKey()) === undefined ||
      this.get(this.getLightThemeKey()) === null
    ) {
      this.set(this.getLightThemeKey(), false)
    }
    return this.get(this.getLightThemeKey()) === "true"
  }

  setLightTheme(mode) {
    const res = this.set(this.getLightThemeKey(), !!mode)
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

  setToken(token) {
    const res = this.set(this.getTokenKey(), token)
    this.update()
    return res
  }

  register(x) {
    this.listeners.push(x)
  }

  unregister(x) {
    this.listeners = this.listeners.filter(e => e !== x)
  }

  update() {
    Object.keys(this.listeners).forEach(e => this.listeners[e].updateRender && this.listeners[e].updateRender())
  }
}

const storage = new Storage()
export default storage
