import { xpRange } from '../lib/levelling.js'
let handler = async (m, { conn, usedPrefix, text, command }) => {
    let name = await conn.getName(m.sender)
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    conn.sendButton(m.chat, 
    '*––––––『 PROFILE 』––––––*', 
`🧑🏻‍🏫 Name: ${name}
🎳 Limit: ${limit}
🎗️ Role: ${role}
🎖️ Level: ${level} ﹙${exp - min} / ${xp}﹚
☕ Total Xp: ${exp}
〽️ Prefix: *${usedPrefix}*
––––––––––––––––––––––––
💁🏻‍♂ Tip :
⮕ To level up:
${usedPrefix}levelup
`.trim(), './media/profile.jpg', [
[`𝐥𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝`, `${usedPrefix}leaderboard`],
[`𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲`, `${usedPrefix}inventory`]
], m, {asLocation: true})
}

handler.help = ['profile']
handler.tags = ['info']
handler.command = /^(profile|pf|userprofile|up)$/i

export default handler