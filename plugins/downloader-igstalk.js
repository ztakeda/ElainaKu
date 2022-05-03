import { instagramStalk } from '@bochilteam/scraper'

let handler= async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `Contoh penggunaan: ${usedPrefix}${command} <username>`
    const {
        username,
        name,
        description,
        followersH,
        followingH,
        postsH,
    } = await instagramStalk(args[0])
    m.reply(`
${name} *(${username})*
https://instagram.com/${username.replace(/^@/, '')}
*${followersH}* Pengikut.
*${followingH}* Mengikuti.
*${postsH}* Postingan.   
*Bio:* ${description}
`.trim())
}

handler.help = ['igstalk'].map(v => v + ' <username>')
handler.tags = ['downloader']

handler.command = /^(igstalk)$/i

export default handler