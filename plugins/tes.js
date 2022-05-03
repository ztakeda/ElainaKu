let handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
conn.sendButton(m.chat, '𝐁𝐎𝐓 𝐀𝐊𝐓𝐈𝐅!',   
  'By Elaina_Bot', 
  './media/elaina.jpg',
[
['𝐌𝐄𝐍𝐔', '/menu'],
], m, { asLocation: false })

}
handler.help = ['tes']
handler.tags = ['tes']

handler.command = /tes$/i

export default handler