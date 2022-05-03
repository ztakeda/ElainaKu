let handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    user.afk = + new Date
    user.afkReason = text
    conn.sendHydrated(m.chat,
`*––––––––【 AFK 】––––––––*`,
`   • AWAY FROM KEYBOARD started •

${conn.getName(m.sender)} is now AFK

Reason: ${text ? '' + text : 'undefined'}`, null, null, null, null, null, [
[`𝐌𝐄𝐍𝐔`, `/menu`]
], m)
}
handler.help = ['afk [reason]']
handler.tags = ['main']
handler.command = /^afk$/i

export default handler