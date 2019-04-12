export const backendUrl = host => {
  switch(host) {
    case "localhost":
      return "http://localhost:4000"
    case "mewna.com":
      return "https://api.mewna.com"
    case "mewna.app":
      return "https://api.mewna.app"
  }
}

export const twitchClientId = "s08k18j061m5sq9zqgblpie4icsph1"
