<div align="center">
 
# Whatsapp Bot - Node Js
[![CodeFactor](https://www.codefactor.io/repository/github/arugaz/whatsapp-bot/badge/master)](https://www.codefactor.io/repository/github/arugaz/whatsapp-bot/overview/master)
<details>
 <summary>🥟 Help me!</summary>
 
 [Trakteer](https://trakteer.id/arugabot)
 
</details>
</div>

## Getting Started

This project require NodeJS v12.

### Install
Clone this project

```bash
> git clone https://github.com/ArugaZ/whatsapp-bot.git
> cd whatsapp-bot
```

Install the dependencies:

```bash
> npm install gify-cli -g
> npm install
```

jangan lupa install ffmpeg sama wget 

kalo kelen pake rdp windows , jan lupa download binary penunjang
dibawah ini

<a href="https://drive.google.com/file/d/1SugE8vjfOyyW3VTRqsxlW_GJh6EKQ19X/view?usp=drivesdk"> Download </a>

pindahin folder ffmpeg ke `C:\`
dan file wget.exe ke `system32`

add juga path ffmpeg di environtment variable nya
agar bisa dipanggil di cmd 
path ffmpeg nya yaitu
```batch
C:\ffmpeg\bin

```

### Usage
Run the Whatsapp bot

```bash
> npm start
```

after running it you need to scan the qr

### Information
- Change ownerNumber on settings/setting.json
- Change groupLimit on settings/setting.json
- Change memberLimit on settings/setting.json
- Change prefix on settings/setting.json

- Change all apiKey settings/api.json

---

## Features

| Fitur blm public |Yes|
| ------------- | ------------- |
| pornhub downloads|bantu star sampe 50|
| simi-simi chat bot|bantu star sampe 50|

| Creator |Yes|
| ------------- | ------------- |
| Respond img to sticker|✅|
| Respond img to sticker no bg|✅|
| Respond url to sticker|✅|
| Respond gif to sticker|✅|
| Respond giphy url to sticker|✅|
| Make a meme from photo|✅|
| Quotes maker result pict|✅|

| Islam |Yes|
| ------------- | ------------- |
| List Surah|✅|
| Info Surah|✅|
| Surah|✅|
| Tafsir Alquran|✅|
| Alquran Audio/Voice|✅|

| Searchs |Yes|
| ------------- | ------------- |
| images |✅|

| Random text |Yes|
| ------------- | ------------- |
| Pantun pakboy|✅|
| Fakta Menarik|✅|
| Kata Bijak|✅|

| Random image |Yes|
| ------------- | ------------- |
| Anime |✅|
| Kpop |✅|
| Memes |✅|


| Others |Yes|
| ------------- | ------------- |
| Teks to Sound/Voice|✅|
| Translate teks|✅|
| Get covid info from map|✅|
| Shortlink|✅|

| Groups |Yes|
| ------------- | ------------- |
| Add user|✅|
| Kick user|✅|
| Promote User|✅|
| Demote User|✅|
| Delete bot msg|✅|
| Tagall/mentions all|✅|
| Kick all members|✅|

| Owner bot |Yes|
| ------------- | ------------- |
| Broadcast|✅|
| Leave all group|✅|
| Delete all msgs|✅|
| Banned user|✅|


## To-Do
 - Add Media Downloader
 - Add More Feature
 - More refactoring
 
---

## Troubleshooting
Make sure all the necessary dependencies are installed: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable: 
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

## Thanks to
- [WA-Automate](https://github.com/open-wa/wa-automate-nodejs)
- [YogaSakti](https://github.com/YogaSakti/imageToSticker)
