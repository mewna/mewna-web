import regeneratorRuntime from "regenerator-runtime"
import axios from "axios"
import { backendUrl } from "./Const"
import store from "./Storage"
import {backgroundImage} from "./comp/profile/Header";

class Api {
  token() {
    return store.getToken()
  }

  async heartbeat(hostname) {
    try {
      if(hostname && this.token()) {
        const out = await axios.get(`${backendUrl(hostname)}/api/auth/heartbeat`, {
          headers: {
            "Authorization": this.token()
          }
        })
        return out.data
      } else {
        return null
      }
    } catch(e) {
      return null
    }
  }

  async manages(hostname, guild) {
    try {
      if(hostname && this.token()) {
        const out = await axios.get(`${backendUrl(hostname)}/api/auth/guilds/manages/${guild}`, {
          headers: {
            "Authorization": this.token()
          }
        })
        return out.data["manages"]
      } else {
        return false
      }
    } catch(e) {
      return false
    }
  }

  async guildConfig(hostname, guild) {
    try {
      if(hostname && this.token()) {
        const out = await axios.get(`${backendUrl(hostname)}/api/auth/guilds/config/${guild}`, {
          headers: {
            "Authorization": this.token()
          }
        })
        return out.data
      } else {
        return {}
      }
    } catch(e) {
      return {}
    }
  }

  async updateGuildConfig(hostname, guild, data) {
    if(hostname && this.token()) {
      const out = await axios.post(`${backendUrl(hostname)}/api/auth/guilds/config/${guild}`, data, {
        headers: {
          "Authorization": this.token()
        }
      })
      return out.data
    }
  }

  async guildLeaderboard(hostname, guild) {
    try {
      if(hostname) {
        const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/leaderboard`)
        return out.data
      } else {
        return []
      }
    } catch(e) {
      return []
    }
  }

  async guildRewards(hostname, guild) {
    try {
      if(hostname) {
        const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/rewards`)
        return out.data
      } else {
        return []
      }
    } catch(e) {
      return []
    }
  }

  async guildPrefix(hostname, guild) {
    try {
      if(hostname) {
        const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/prefix`)
        return out.data
      } else {
        return {}
      }
    } catch(e) {
      return {}
    }
  }

  async guildWebhooks(hostname, guild) {
    try {
      if(hostname && this.token()) {
        const out = await axios.get(`${backendUrl(hostname)}/api/auth/guilds/webhooks/${guild}`, {
          headers: {
            "Authorization": this.token()
          }
        })
        return out.data
      } else {
        return {}
      }
    } catch(e) {
      return {}
    }
  }

  async deleteGuildWebhook(hostname, guild, webhook) {
    try {
      if(hostname && this.token()) {
        const out = await axios.delete(`${backendUrl(hostname)}/api/auth/guilds/webhooks/${guild}/${webhook}`, {
          headers: {
            "Authorization": this.token()
          }
        })
        return out.data
      } else {
        return {}
      }
    } catch(e) {
      return {}
    }
  }

  async logout(hostname) {
    if(hostname && this.token()) {
      await axios.post(`${backendUrl(hostname)}/api/auth/logout`, {
        headers: {
          "Authorization": this.token()
        }
      })
    }
  }

  async cachedGuild(hostname, id) {
    if(hostname) {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}`)
      return out.data
    } else {
      return {}
    }
  }

  async cachedUser(hostname, id) {
    if(hostname) {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/user/${id}`)
      return out.data
    } else {
      return {}
    }
  }

  async cachedChannels(hostname, id) {
    if(hostname) {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}/channels`)
      return out.data
    } else {
      return []
    }
  }

  async cachedRoles(hostname, id) {
    if(hostname) {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}/roles`)
      return out.data
    } else {
      return []
    }
  }

  clientHostname() {
    if(typeof window !== undefined) {
      return window && window.location && window.location.hostname
    } else {
      return null
    }
  }
}

const api = new Api()

export default api
