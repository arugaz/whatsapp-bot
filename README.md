<div align="center">
  <img width="192" title="Whatsapp-Bot-Multi-Device-Profile" src="https://github.com/ArugaZ.png"/>
</div>

<div align="center">
    <img title="Whatsapp-Bot-Multi-Device" src="https://img.shields.io/badge/Whatsapp%20Bot%20Multi%20Device-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge">
</div>

---

<div align="center">  
  <a href="https://github.com/ArugaZ">
    <img title="Whatsapp-Bot-Multi-Device-Author" src="https://img.shields.io/badge/AUTHOR-ARUGAZ-orange.svg?style=for-the-badge&logo=github"></a>
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
    <img title="Whatsapp-Bot-Multi-Device-License" src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?color=%23b5ead7&style=flat-square"/>
  </a>
  <a href="https://hits.seeyoufarm.com">
    <img title="Whatsapp-Bot-Multi-Device-Hits" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FArugaZ%2Fwhatsapp-bot&count_bg=%23c7ceea&title_bg=%23555555&icon=probot.svg&icon_color=%23c7ceea&title=Hits&edge_flat=true"/>
  </a>
</div>
<div align="center">
  <details>
    <summary>🥟 Help me!</summary>
    <p><a href="https://ko-fi.com/arugaz">Ko-Fi</a></p>
    <p><a href="https://trakteer.id/arugaz/tip">Trakteer</a></p>
  </details>

  <p>Don't forget to click ⭐️ and fork this repository</p>

  <p>Need help? please create <a href="https://github.com/arugaz/whatsapp-bot/issues">issues</a> or chat me on <a href="https://wa.me/6285163651710" target="_blank">whatsapp</a></p>
</div>

---

## Getting Started

This project require

- NodeJS v16 or greater [Install](https://nodejs.org/dist/)
- FFMPEG [Install](https://ffmpeg.org/download.html)

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

**whatsapp-bot** is available under the Apache-2.0 license. See the [LICENSE](LICENSE) file for more info.

</section>

---

<div align="center">
  <h2>Join the community to build Whatsapp-Bot together!</h2>

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

</div>
