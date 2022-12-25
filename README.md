<p align="center">
<img src="https://avatars2.githubusercontent.com/u/53950128?s=460&u=09f530e3326f710c4e0f9106f094eeea5429f86d&v=4" width="128" height="128"/>
</p>
<p align="center">
<a href="#"><img title="Whatsapp-Bot" src="https://img.shields.io/badge/Whatsapp Bot-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge"></a>
</p>
<p align="center">
<a href="https://github.com/ArugaZ"><img title="Author" src="https://img.shields.io/badge/AUTHOR-ARUGAZ-orange.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://github.com/arugaz/followers"><img title="Followers" src="https://img.shields.io/github/followers/arugaz?color=blue&style=flat-square"></a>
<a href="https://github.com/arugaz/whatsapp-bot/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/arugaz/whatsapp-bot?color=red&style=flat-square"></a>
<a href="https://github.com/arugaz/whatsapp-bot/network/members"><img title="Forks" src="https://img.shields.io/github/forks/arugaz/whatsapp-bot?color=red&style=flat-square"></a>
<a href="https://github.com/arugaz/whatsapp-bot/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/arugaz/whatsapp-bot?label=Watchers&color=blue&style=flat-square"></a>
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FArugaZ%2Fwhatsapp-bot&count_bg=%2379C83D&title_bg=%23555555&icon=probot.svg&icon_color=%2300FF6D&title=hits&edge_flat=false"/></a>
</p>
<div align="center">
<details>
 <summary>🥟 Help me!</summary>

[Trakteer](https://trakteer.id/arugaz)

</details>

ini semua gratis, jangan pelit ⭐️ ya :D

<p align="center"><a href="https://instagram.com/ini.arga/" target="_blank">Chat me on Insta</a>.</p>
</div>

## Getting Started

This project require NodeJS v14 or greater

### Install

Clone this project

```bash
> git clone -b md https://github.com/ArugaZ/whatsapp-bot.git
> cd whatsapp-bot
```

Install the dependencies:

```bash
> yarn install
```

### Setup

`Setup prisma`

Create .env file based on .env.example, create mongo atlas account and copy the database link into .env file

```bash
> yarn prisma db push
```

`Build a project`

Why build into javascript? because when you use typescript transpile it will slow down the app.

```bash
> yarn build
```

`If you want generate more languages`

It will generate languages based on list [database/languages.json](database/languages.json). You can remove the languages you don't want to use (it will store the object into memory), except ([English (en)](languages/en.json) and [Indonesian (id)](languages/id.json)) because its already generate by default.

```bash
> yarn generateLang
```

### Usage

`Run the Whatsapp bot`

```bash
> yarn start # node .
```

`With pm2`

If you haven't installed pm2

```bash
> yarn global add pm2 # install pm2 globally
```

```bash
> yarn pm2 # pm2 start ecosystem.config.js
```

after running it you need to scan the qr
