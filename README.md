<div align="center">
  <img title="Whatsapp-Bot-Multi-Device-Profile" src="https://github.com/ArugaZ.png?size=192"/>
</div>

<div align="center">
  <a href="#">
    <img title="Whatsapp-Bot-Multi-Device" src="https://img.shields.io/badge/Whatsapp%20Bot%20Multi%20Device-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge">
  </a>
</div>
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

## Getting Started

This project require

- NodeJS v16 or greater [Install](https://nodejs.org/dist/)
- Yarn Classic Stable [Install](https://classic.yarnpkg.com/lang/en/docs/install/#alternatives-stable)
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
yarn install
```

### Setup

`Setup prisma`

Create .env file based on .env.example, copy the mongo database URL into .env file

```bash
yarn prisma db push
```

`Build a project`

[Why build into javascript?](https://pm2.io/docs/runtime/integration/transpilers/)

```bash
yarn build
```

`If you want generate more languages`

It will generate languages based on list [database/languages.json](database/languages.json). You can remove the languages you don't want to use (it will store the object into memory), except ([English (en)](languages/en.json) and [Indonesian (id)](languages/id.json)) because its already generate by default.

```bash
yarn generateLang
```

</section>

## Usage

<section>

`Run the Whatsapp bot`

```bash
yarn start
```

`With pm2`

If you haven't installed pm2, I suggest using npm to [install](https://pm2.keymetrics.io/docs/usage/quick-start/#installation) it.

```bash
yarn start:pm2
```

after running it you need to scan the qr

</section>

<div align="center">
  <h2>
    Join the community to build Whatsapp-Bot together!
  </h2>
  <a href="https://github.com/ArugaZ/whatsapp-bot/graphs/contributors">
    <img title="Whatsapp-Bot-Multi-Device-Contributors" src="https://contrib.rocks/image?repo=arugaz/whatsapp-bot&columns=8&anon=1"/>
  </a>
</div>

## License

[Apache-2.0](LICENSE)
