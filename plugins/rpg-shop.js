const items = {
    buy: {
        limit: {
            exp: 999
        },
        potion: {
            money: 1250,
        },
        trash: {
            money: 4,
        }
    },
    sell: {
        potion: {
            money: 1250,
        },
        trash: {
            money: 4
        }
    }
}

let handler = async (m, { command, usedPrefix, args }) => {
    let user = global.db.data.users[m.sender]
    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    
    let text = ''
    let footer = ''
    let image = ''
    let buttons = ''
    text = (command.toLowerCase() == 'buy' ?
(`
*––––––––『 BUY 』––––––––*
`.trim()) : 
(`
*––––––––『 SELL 』––––––––*
`.trim())
)
    footer = (command.toLowerCase() == 'buy' ?
(`
🔖 ɪᴛᴇᴍs ʟɪsᴛ :
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `⮕ 1 ${global.rpg.emoticon(v)}${v} ﹫ ${listItems[v][paymentMethod]} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
–––––––––––––––––––––––––
💁🏻‍♂ Tip :
⮕ To buy items:
${usedPrefix}${command} [item] [quantity]
★ Example:
${usedPrefix}${command} potion 10
`.trim()) : 
(`
🔖 Items list :
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `⮕ 1 ${global.rpg.emoticon(v)}${v} ﹫ ${listItems[v][paymentMethod]} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
–––––––––––––––––––––––––
💁🏻‍♂ Tip :
⮕ To sell items:
${usedPrefix}${command} [item] [quantity]
★ Example:
${usedPrefix}${command} potion 10
`.trim())
)
    image = (command.toLowerCase() == 'buy' ?
('./media/buy.jpg') : 
('./media/sell.jpg')
)
    buttons = (command.toLowerCase() == 'buy' ?
([
[`𝐛𝐮𝐲  𝐥𝐢𝐦𝐢𝐭 `, `${usedPrefix}buy limit`],
[`𝐛𝐮𝐲  𝐩𝐨𝐭𝐢𝐨𝐧 `, `${usedPrefix}buy potion`]
]) : 
([
[`𝐬𝐞𝐥𝐥 𝐩𝐨𝐭𝐢𝐨𝐧 `, `${usedPrefix}sell potion`],
[`𝐬𝐞𝐥𝐥 𝐭𝐫𝐚𝐬𝐡 `, `${usedPrefix}sell trash`]
])
)
    const item = (args[0] || '').toLowerCase()
    const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    if (!listItems[item]) return conn.sendButton(m.chat, text, footer, image, buttons, m, {asLocation: true})
    if (command.toLowerCase() == 'buy') {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) return conn.sendButton(m.chat,
`*–『 INSUFFICIENT CREDIT 』–*`, 
`You need extra *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* ${global.rpg.emoticon(paymentMethod)}${paymentMethod} to buy *${total}* ${global.rpg.emoticon(item)}${item}.
You've *${user[paymentMethod]}* ${global.rpg.emoticon(paymentMethod)}${paymentMethod} in bag.
–––––––––––––––––––––––––
💁🏻‍♂ Tip :
Open crates & colllect rewards.
⮕ To open crates:
.open crate
⮕ To colllect rewards:
.adventure | .daily | .monthly
`.trim(), './media/lowcredit.jpg', [
[`Ask to all`, `${usedPrefix}tagall somebody please send *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* ${global.rpg.emoticon(paymentMethod)}${paymentMethod} to me.
⮕ To transfer ${paymentMethod}:
${usedPrefix}transfer ${paymentMethod} ${(listItems[item][paymentMethod] * total) - user[paymentMethod]} @${conn.getName(m.sender)}`]
], m, {asLocation: true})
        user[paymentMethod] -= listItems[item][paymentMethod] * total
        user[item] += total
        return conn.sendButton(m.chat,
`*––––––『 BOUGHT 』––––––*`,
`You *bought ${total} ${global.rpg.emoticon(item)}${item}*.
`.trim(), `./media/bought.jpg`, [
[`𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲`, `${usedPrefix}inventory`]
], m, {asLocation: true})
    } else {
        if (user[item] < total) return m.reply(`You don't have enough *${global.rpg.emoticon(item)}${item}* to sell, you only have ${user[item]} items`)
        user[item] -= total
        user.money += listItems[item].money * total
        return conn.sendButton(m.chat,
`*–––––––『 SOLD 』–––––––*`,
`You *sold ${total} ${global.rpg.emoticon(item)}${item}*.
`.trim(), `./media/sold.jpg`, [
[`𝐢𝐧𝐯𝐞𝐧𝐭𝐨𝐫𝐲`, `${usedPrefix}inventory`]
], m, {asLocation: true})
    }
}

handler.help = ['buy', 'sell'].map(v => v + ' [item] [count]')
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i

handler.disabled = false

export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}