import { join } from 'path'
import { promises } from 'fs'

const tfinventory = {
  others: {
    money: true,
  },
  tfitems: {
    potion: true,
    trash: true,
    wood: true,
    rock: true,
    string: true,
    emerald: true,
    diamond: true,
    gold: true,
    iron: true,
  },
  tfcrates: {
    common: true,
    uncommon: true,
    mythic: true,
    legendary: true,
    pet: true,
  },
  tfpets: {
    horse: 10,
    cat: 10,
    fox: 10,
    dog: 10,
  }
}
const items = [
    'money', 'potion', 'trash', 'wood',
    'rock', 'string', 'petFood', 'emerald',
    'diamond', 'gold', 'iron', 'common',
    'uncommon', 'mythic', 'legendary', 'pet',
]
let confirmation = {}
async function handler(m, { conn, args, usedPrefix, command, __dirname }) {
    if (confirmation[m.sender]) return m.reply('Kamu sedang melakukan transfer!')
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let user = global.db.data.users[m.sender]
    const tfitems = Object.keys(tfinventory.tfitems).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v]}`).filter(v => v).join('\n').trim()
    const tfcrates = Object.keys(tfinventory.tfcrates).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v]}`).filter(v => v).join('\n').trim()
    const tfpets = Object.keys(tfinventory.tfpets).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v] >= inventory.pets[v] ? 'Max Levels' : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim()
    const item = items.filter(v => v in user && typeof user[v] == 'number')
    let lol = `🧑🏻‍🏫 user: *${conn.getName(m.sender)}*

🔖 Transferable list :
${Object.keys(tfinventory.others).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v]}`).filter(v => v).join('\n')}${tfitems ? `
${tfitems}` : ''}${tfcrates ? `
${tfcrates}` : ''}${tfpets ? `
${tfpets}` : ''}
–––––––––––––––––––––––––
💁🏻‍♂ Tip :
⮕ Transfer money|item|crate to user:
${usedPrefix}${command} [name] [quantity] @user
★ Example:
${usedPrefix}${command} money 999 @${_package.name}
`.trim()
    const type = (args[0] || '').toLowerCase()
    if (!item.includes(type)) return conn.sendButton(m.chat, '*–––––『 TRANSFER 』–––––*', lol, './media/transfer.jpg', [
[`Tf potion`, `${usedPrefix}${command} potion 1 @+6285704347763`],
[`Tf trash`, `${usedPrefix}${command} trash 1 @+6285704347763`],
], m, {asLocation: true})
    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
    if (!(who in global.db.data.users)) return m.reply(`User ${who} not in database`)
    if (user[type] * 1 < count) return conn.sendButton(m.chat, `*–『 INSUFFICIENT CREDIT』–*`, `You need extras *${count - user[type]}* ${rpg.emoticon(type)}${type}${special(type)} to transfer.
You/'ve *${user[type]}* ${rpg.emoticon(type)}${type}${special(type)} in bag.
–––––––––––––––––––––––––
💁🏻‍♂ Tip :
Open crates & collect rewards.
⮕ To open crates:
.open crate
⮕ To collect rewards:
.adventure | .daily | .monthly
`.trim(), './media/lowcredit.jpg',
[
[`Ask to all`, `${usedPrefix}tagall somebody please send *${count - user[type]}* ${rpg.emoticon(type)}${type}${special(type)} to me.
⮕ To transfer ${type}${special(type)}:
${usedPrefix}transfer ${type}${special(type)} ${count - user[type]} @${conn.getName(m.sender)}`]
], m, { asLocation: true })
    let confirm = `
Are you sure you want to transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}*

Timeout: *30 sᴇᴄ*
`.trim()
    conn.sendButton(m.chat, '*––––『 TRANSFERRING 』––––*', confirm, './media/transferring.jpg', [
['Yes', 'y'],
['No', 'n']
], m, {
    mentions: [who],
    asLocation: true})
    confirmation[m.sender] = {
        sender: m.sender,
        to: who,
        message: m,
        type,
        count,
        timeout: setTimeout(() => (m.reply('Timeout'), delete confirmation[m.sender]), 30 * 1000)
    }
}

handler.before = async (m, { conn }) => {
    if (m.isBaileys) return
    if (!(m.sender in confirmation)) return
    if (!m.text) return
    let { timeout, sender, message, to, type, count } = confirmation[m.sender]
    if (m.id === message.id) return
    let user = global.db.data.users[sender]
    let _user = global.db.data.users[to]
    if (/no?/g.test(m.text.toLowerCase())) {
        clearTimeout(timeout)
        delete confirmation[sender]
        return conn.sendButton(m.chat, `*–––––『 CANCELLED 』–––––*`, `Transfer cancelled of *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, './media/cancelled.jpg',
[
[`𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲`, `/inventory`]
], m, { mentions: [to], asLocation: true })
    }
    if (/y(es)?/g.test(m.text.toLowerCase())) {
        let previous = user[type] * 1
        let _previous = _user[type] * 1
        user[type] -= count * 1
        _user[type] += count * 1
        if (previous > user[type] * 1 && _previous < _user[type] * 1) conn.sendButton(m.chat, `*––––『 TRANSFERRED 』––––*`, `succesfully transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} ᴛᴏ *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, './media/transferred.jpg',
[
[`𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲`, `/inventory`]
], m, { mentions: [to], asLocation: true })
        else {
            user[type] = previous
            _user[type] = _previous
            m.reply(`Failed to transfer *${count}* ${rpg.emoticon(type)}${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [to] })
        }
        clearTimeout(timeout)
        delete confirmation[sender]
    }
}

handler.help = ['transfer', 'tf'].map(v => v + ' [type] [jumlah] [@tag]')
handler.tags = ['rpg']
handler.command = /^(transfer|tf)$/i

handler.disabled = false

export default handler

function special(type) {
    let b = type.toLowerCase()
    let special = (['common', 'uncommon', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : '')
    return special
}

function isNumber(x) {
    return !isNaN(x)
}
