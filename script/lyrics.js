module.exports.config = {
  name: "lyrics",
  role: 0, 
  description: "Search Lyrics",
  usage: "[title of song]",
  credits: "deku & remod to mirai by Eugene Aguilar",
  cooldown: 0,
  hasPrefix: false
}

module.exports.run = async function({ api, event, args }) {
  const fs = require("fs");
  const axios = require("axios");
  const t = args.join(" ");

  if (!t) return api.sendMessage("[⛔] 𝗠𝗜𝗦𝗦𝗜𝗡𝗚.....", event.threadID, event.messageID);

  try {
    const r = await axios.get('https://lyrist.vercel.app/api/' + t);
    const { image, lyrics, artist, title } = r.data;

    let ly = __dirname + "/../public/image/lyrics.png";
    let suc = (await axios.get(image, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(ly, Buffer.from(suc, "utf-8"));
    let img = fs.createReadStream(ly);

    api.setMessageReaction("🚬", event.messageID, (err) => {}, true);

    return api.sendMessage({
      body: `𝗧𝗜𝗧𝗟𝗘[🧃]:${title}𝗔𝗥𝗧𝗜𝗦𝗧𝗘[🎧]: ${artist}𝗟𝗬𝗥𝗜𝗖𝗦[⚙️]:${lyrics}`,
      attachment: img
    }, event.threadID, () => fs.unlinkSync(ly), event.messageID);
  } catch (a) {
    api.setMessageReaction("😿", event.messageID, (err) => {}, true);

    return api.sendMessage(a.message, event.threadID, event.messageID);
  }
}
