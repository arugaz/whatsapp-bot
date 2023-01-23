<div align="center">
  
  <img width="192" title="Whatsapp-Bot-Multi-Device-Profile" src="https://github.com/ArugaZ.png"/>

</div>

<div align="center">

  <img title="Whatsapp-Bot-Multi-Device" src="https://img.shields.io/badge/Whatsapp%20Bot%20Multi%20Device-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge">

</div>

---

<div align="center">  
  <a href="https://github.com/ArugaZ">
    <img title="ArugaZ" src="https://img.shields.io/badge/AUTHOR-ARUGAZ-orange.svg?style=for-the-badge&logo=github"></a>
</div>
<div align="center">
  <a href="https://www.codefactor.io/repository/github/arugaz/whatsapp-bot/overview/master">
    <img title="Whatsapp-Bot-Multi-Device-CodeFactor" src="https://img.shields.io/codefactor/grade/github/ArugaZ/whatsapp-bot/master?color=blue&label=CodeFactor&style=flat-square">
  </a>
  <a href="https://github.com/arugaz/whatsapp-bot/issues">
    <img title="Whatsapp-Bot-Multi-Device-Issues" src="https://img.shields.io/github/issues-raw/arugaz/whatsapp-bot?label=Issues&color=%23ff9aa2&style=flat-square" />
  </a>
</div>
<div align="center">
  <a href="https://github.com/arugaz/followers">
    <img title="Whatsapp-Bot-Multi-Device-Followers" src="https://img.shields.io/github/followers/arugaz?label=Folls&color=%23ff9aa2&style=flat-square">
  </a>
  <a href="https://github.com/arugaz/whatsapp-bot/stargazers/">
    <img title="Stars" src="https://img.shields.io/github/stars/arugaz/whatsapp-bot?label=Stars&color=%23ffb7b2&style=flat-square">
  </a>
  <a href="https://github.com/arugaz/whatsapp-bot/network/members">
    <img title="Whatsapp-Bot-Multi-Device-Forks" src="https://img.shields.io/github/forks/arugaz/whatsapp-bot?label=Forks&color=%23ffdac1&style=flat-square">
  </a>
  <a href="https://github.com/arugaz/whatsapp-bot/watchers">
    <img title="Whatsapp-Bot-Multi-Device-Watching" src="https://img.shields.io/github/watchers/arugaz/whatsapp-bot?label=Watchers&color=%23e2f0cb&style=flat-square">
  </a>
  <a href="https://github.com/arugaz/whatsapp-bot/blob/master/LICENSE">
    <img title="Whatsapp-Bot-Multi-Device-License" src="https://img.shields.io/badge/License-GPL_3.0_or_later-blue.svg?color=%23b5ead7&style=flat-square"/>
  </a>
  <a href="https://hits.seeyoufarm.com">
    <img title="Whatsapp-Bot-Multi-Device-Hits" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FArugaZ%2Fwhatsapp-bot&count_bg=%23c7ceea&title_bg=%23555555&icon=probot.svg&icon_color=%23c7ceea&title=Hits&edge_flat=true"/>
  </a>
</div>
<div align="center">
  <p>Don't forget to click ⭐️ and fork this repository</p>
</div>

---

<p align="center"> This whatsapp bot project (now) use 
  <a href="https://github.com/adiwajshing/Baileys">Baileys Multi-Device.</a>
</p>

<p align="center">
  <img title="Whatsapp-Bot-Typescript" src="https://img.shields.io/badge/Typescript-031b36?style=for-the-badge&logo=typescript&logoColor=3178C6"></img>
  <img title="Whatsapp-Bot-Prisma" src="https://img.shields.io/badge/prisma-29245c?style=for-the-badge&logo=prisma&logoColor=F7DF1E"></img>
  <img title="Whatsapp-Bot-Mongo" src="https://img.shields.io/badge/mongoDB-033604?style=for-the-badge&logo=mongodb&logoColor=47A248"></img>
</p>

---

<p align="center">
  <a href="https://github.com/arugaz/whatsapp-bot"><b>whatsapp-bot</b></a> out-of-the-box support on...
</p>

<p align="center">
  <img title="Whatsapp-Bot-Termux" src="https://img.shields.io/badge/Termux-302c2c?style=for-the-badge&logo=iterm2&logoColor=000000"></img>
  <img title="Whatsapp-Bot-Server" src="https://img.shields.io/badge/self hosting-3d1513?style=for-the-badge&logo=serverless&logoColor=FD5750"></img>
  <img title="Whatsapp-Bot-Railway" src="https://img.shields.io/badge/railway-362b2b?style=for-the-badge&logo=railway&logoColor=0B0D0E"></img>
</p>
<p align="center">
  <img title="Whatsapp-Bot-Heroku" src="https://img.shields.io/badge/heroku-9d7acc?style=for-the-badge&logo=heroku&logoColor=430098"></img>
  <img title="Whatsapp-Bot-Koyeb" src="https://img.shields.io/badge/koyeb-362b2b?style=for-the-badge&logo=koyeb&logoColor=121212"></img>
  <img title="Whatsapp-Bot-Replit" src="https://img.shields.io/badge/replit-3b1903?style=for-the-badge&logo=replit&logoColor=F26207"></img>
</p>

<p align="center">Need help? please create an <a href="https://github.com/arugaz/whatsapp-bot/issues">issues</a></p>

---

## Getting Started

This project require

- [NodeJS](https://nodejs.org/en/download/) [v16 or greater](https://nodejs.org/dist/)
- [FFMPEG](https://ffmpeg.org/download.html)

## Install

<section>

### Clone this project

```bash
git clone https://github.com/ArugaZ/whatsapp-bot.git
cd whatsapp-bot
```

### Install the dependencies:

```bash
npm install
```

### Setup

`Setup prisma`

Create .env file based on .env.example, copy the mongo database URL into .env file

```bash
npx prisma db push
```

`Build a project`

[Why build into javascript?](https://pm2.io/docs/runtime/integration/transpilers/)

```bash
npm run build
```

`If you want generate more languages`

It will generate languages based on list [database/languages.json](database/languages.json). You can remove the languages you don't want to use (it will store the object into memory), except ([English (en)](languages/en.json) and [Indonesian (id)](languages/id.json)) because its already generate by default.

```bash
# try this:
npm run generateLang
# if get incompatible error, try run:
npm run generateLangV2
```

</section>

## Usage

<section>

`Run the Whatsapp bot`

```bash
npm start
```

`With pm2`

If you haven't installed pm2.

```bash
npm install -g pm2
```

Run with pm2

```bash
npm run start:pm2
```

Other tips with pm2:

> This will start your application when the server is restarted or rebooted.

```bash
# if you are on a unix
pm2 startup #create a startup script
pm2 save #save the current app

# if you are on windows
npm install pm2-windows-startup -g #install helper dependency
pm2-startup install #create a startup script
pm2 save #save the current app
```

after running it you need to scan the qr

</section>

## Contributing

<section>

If you've ever wanted to contribute to open source, now is your chance!

Please refer to our [Contribution Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

</section>

## License

<section>

since **whatsapp-bot** use [baileys](https://github.com/adiwajshing/Baileys) is now available under the GPL-3.0 license. See the [LICENSE](LICENSE) file for more info.

</section>

---

<div align="center">
  <h2>Join the community to build Whatsapp-Bot together!</h2>

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TobyG74"><img src="https://avatars.githubusercontent.com/u/32604979?v=4?s=100" width="100px;" alt="Tobi Saputra"/><br /><sub><b>Tobi Saputra</b></sub></a><br /><a href="https://github.com/arugaz/whatsapp-bot/commits?author=TobyG74" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arugaz"><img src="https://avatars.githubusercontent.com/u/53950128?v=4?s=100" width="100px;" alt="ArugaZ"/><br /><sub><b>ArugaZ</b></sub></a><br /><a href="https://github.com/arugaz/whatsapp-bot/commits?author=arugaz" title="Code">💻</a> <a href="#ideas-arugaz" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://youtube.com/GuckTubeYT"><img src="https://avatars.githubusercontent.com/u/56192597?v=4?s=100" width="100px;" alt="Muhammad Kevin"/><br /><sub><b>Muhammad Kevin</b></sub></a><br /><a href="https://github.com/arugaz/whatsapp-bot/commits?author=GuckTubeYT" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LSystemus-2"><img src="https://avatars.githubusercontent.com/u/90476449?v=4?s=100" width="100px;" alt="LSystemus-2"/><br /><sub><b>LSystemus-2</b></sub></a><br /><a href="https://github.com/arugaz/whatsapp-bot/issues?q=author%3ALSystemus-2" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Issa2001"><img src="https://avatars.githubusercontent.com/u/89695452?v=4?s=100" width="100px;" alt="一茶"/><br /><sub><b>一茶</b></sub></a><br /><a href="#ideas-Issa2001" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

</div>
