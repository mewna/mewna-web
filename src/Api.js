import regeneratorRuntime from "regenerator-runtime"
import Axios from "axios"
import { backendUrl, twitchClientId } from "./Const"
import msgpack from "msgpack-lite"
import storage from "./Storage"

const _atob = typeof atob !== "undefined" ? atob : str => {
  return Buffer.from(str, 'base64').toString('binary')
}

const axios = Axios.create({
  responseType: 'arraybuffer',
  transformResponse: [
    data => {
      try {
        const out = msgpack.decode(Buffer.from(data))
        return out
      } catch(e) {
        console.error(e)
        return [-1]
      }
    }
  ],
  transformRequest: [
    (data, _headers) => msgpack.encode(data)
  ],
  headers: {
    "Accept": "application/x.vnd.mewna+b",
    "Content-Type": "application/x.vnd.mewna+b",
  }
})

class Api {
  /////////////
  // HELPERS //
  /////////////

  token() {
    return storage.getToken()
  }

  userId() {
    return this.token() ? _atob(this.token().split(".")[0]) : null
  }

  clientHostname() {
    if(typeof window !== undefined) {
      return window && window.location && window.location.hostname
    } else {
      return null
    }
  }

  async authRequest(func) {
    try {
      if(this.token()) {
        const headers = {
          "Authorization": this.token()
        }
        return await func(headers)
      } else {
        return null
      }
    } catch(e) {
      return null
    }
  }

  async request(func) {
    try {
      return await func()
    } catch(e) {
      return null
    }
  }

  //////////////////////
  // BASIC AUTH STUFF //
  //////////////////////

  async heartbeat(hostname) {
    return await this.authRequest(async headers => {
      try {
        const out = await axios.get(`${backendUrl(hostname)}/api/auth/heartbeat`, {headers: headers})
        return out.data
      } catch(e) {
        storage.setToken(null)
      }
    })
  }

  async logout(hostname) {
    return await this.authRequest(async headers => {
      const out = await axios.post(`${backendUrl(hostname)}/api/auth/logout`, {headers: headers})
      return out.data
    })
  }

  //////////////////////
  // GUILD MANAGEMENT //
  //////////////////////

  async manages(hostname, guild) {
    return await this.authRequest(async headers => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/manages`, {headers: headers})
      return out.data["manages"]
    })
  }

  async guildConfig(hostname, guild) {
    return await this.authRequest(async headers => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/config`, {headers: headers})
      return out.data
    })
  }

  async updateGuildConfig(hostname, guild, data) {
    return await this.authRequest(async headers => {
      const out = await axios.post(`${backendUrl(hostname)}/api/guild/${guild}/config`, data, {headers: headers})
      return out.data
    })
  }

  async updateGuildInfo(hostname, guild, data) {
    return await this.authRequest(async headers => {
      const out = await axios.post(`${backendUrl(hostname)}/api/guild/${guild}/info`, data, {headers: headers})
        return out.data
    })
  }

  async guildWebhooks(hostname, guild) {
    return await this.authRequest(async headers => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/webhooks`, {headers: headers})
      return out.data
    })
  }

  async deleteGuildWebhook(hostname, guild, webhook) {
    return await this.authRequest(async headers => {
      const out = await axios.delete(`${backendUrl(hostname)}/api/guild/${guild}/webhooks/${webhook}`, {headers: headers})
      return out.data
    })
  }

  ////////////////
  // GUILD DATA //
  ////////////////

  async guildLeaderboard(hostname, guild) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/leaderboard`)
      return out.data
    })
  }

  async guildRewards(hostname, guild) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/rewards`)
      return out.data
    })
  }

  async guildPrefix(hostname, guild) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/prefix`)
      return out.data
    })
  }

  async guildInfo(hostname, guild) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/guild/${guild}/info`)
      return out.data
    })
  }

  //////////////
  // ACCOUNTS //
  //////////////

  async getUser(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/user/${id}`)
      return out.data
    })
  }

  async updateUser(hostname, id, data) {
    return await this.authRequest(async headers => {
      const out = await axios.post(`${backendUrl(hostname)}/api/user/${id}`, data, {headers: headers})
      return out.data
    })
  }

  async getGuilds(hostname) {
    return await this.authRequest(async headers => {
      const out = await axios.get(`${backendUrl(hostname)}/api/auth/guilds/managed`, {headers: headers})
      return out.data
    })
  }

  async getUnmanagedGuilds(hostname) {
    return await this.authRequest(async headers => {
      const out = await axios.get(`${backendUrl(hostname)}/api/auth/guilds/unmanaged`, {headers: headers})
      return out.data
    })
  }

  ///////////
  // POSTS //
  ///////////

  async createPost(hostname, id, data) {
    return await this.authRequest(async headers => {
      const out = await axios.post(`${backendUrl(hostname)}/api/post/${id}/create`, data, {headers: headers})
      return out.data
    })
  }

  async getPost(hostname, id, post) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/post/${id}/${post}`)
      return out.data
    })
  }

  async getAuthor(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/post/author/${id}`)
      return out.data
    })
  }

  async deletePost(hostname, id, post) {
    return await this.authRequest(async headers => {
      const out = await axios.delete(`${backendUrl(hostname)}/api/post/${id}/${post}`, {headers: headers})
      return out.data
    })
  }

  async editPost(hostname, id, post, data) {
    return await this.authRequest(async headers => {
      const out = await axios.put(`${backendUrl(hostname)}/api/post/${id}/${post}`, data, {headers: headers})
      return out.data
    })
  }

  async getPosts(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/post/${id}/posts`)
      return out.data
    })
  }

  ///////////////////
  // DISCORD CACHE //
  ///////////////////

  async cachedGuild(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}`)
      return out.data
    })
  }

  async cachedUser(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/user/${id}`)
      return out.data
    })
  }

  async cachedChannels(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}/channels`)
      return out.data
    })
  }

  async cachedRoles(hostname, id) {
    return await this.request(async () => {
      const out = await axios.get(`${backendUrl(hostname)}/api/cache/guild/${id}/roles`)
      return out.data
    })
  }

  ////////////
  // Twitch //
  ////////////

  async twitchName(name) {
    return await this.request(async () => {
      const out = await axios.get(`https://api.twitch.tv/helix/users?login=${name}`, {
        headers: {
          "Client-ID": twitchClientId,
        }
      })
      return out.data
    })
  }

  async twitchId(id) {
    return await this.request(async () => {
      const out = await axios.get(`https://api.twitch.tv/helix/users?id=${e.id}`, {
        headers: {
          "Client-ID": twitchClientId,
        }
      })
      return out.data
    })
  }
}

const api = new Api()

export default api
