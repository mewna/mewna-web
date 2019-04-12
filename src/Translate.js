import en_US from "./assets/lang/en_US.json";

const table = {
  "en_US": en_US
}

export default (lang, key) => {
  const split = key.split(".");
  try {
    let target = table[lang];
    for(const s of split) {
      target = target[s];
    }
    return target;
  } catch (e) {
    return "[Unknown translation]";
  }
}