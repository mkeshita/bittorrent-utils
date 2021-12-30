# BitTorrent Utilities

Convenient and private assistant for BTT farming </br>
Community - [Telegram](https://t.me/bittorrent_utils)

## Quick overview

### Features

* **Transfer IN-APP BTT**: transfer IN-APP BTT between wallets
* **Automatic transfer of IN-APP BTT**: collect IN-APP BTT automatically from any amount of wallets and avoid losing them while downloading with µTorrent/BitTorrent
* **Automatic removal of torrents**: space-dependent and/or amount-dependent automatic removal of torrents
* **Peers filter**: exclude peers that use no-BTT clients
* **BitTorrent & μTorrent automatic configuration**: configure all your BitTorrent or μTorrent clients from one place 
* **Cross-platform**: windows and linux compatible
* **Private**: local transactions signing, all private actions take place only on your pc

### Сonsole output sample

![](screenshots/0.png?raw=true)

## Quick Start

### Windows

* Install Node.js if not installed already. Recommended version is [v13.14.0](https://nodejs.org/download/release/v13.14.0/)
 
  > **NOTE:** Node.js v13.14.0 is used for compatibility with Windows 7 only, in other cases you can try newer versions of Node.js

* [Download](https://github.com/UkrainianHulk/bittorrent-utils/archive/refs/heads/main.zip) and unzip script or use git:

  ```
  git clone https://github.com/UkrainianHulk/bittorrent-utils
  ```
 
* Edit `bittorrent-utils/config/user.js`

* Run `bittorrent-utils/START.bat`

### Linux

* Install Node.js and Git if not installed already: 
 
    ```
    apt update && apt install nodejs git
    ```

* Clone this repository:
 
    ```
    git clone https://github.com/UkrainianHulk/bittorrent-utils
    ```

* Edit configuration file:
 
    ```
    nano bittorrent-utils/config/user.js
    ```

* Navigate to script directory and run:
 
    ```
    cd bittorrent-utils && npm start
    ```

## Setup

### Scenarios

There are two scenarios for using the script:

1. Local script instance for each client
   * all script features can be set up
2. Remote script instance for multiple clients
   * peers filter won't work

Сonsidering these options, you can choose the one that suits you or even combine them. For example, you can configure local scripts to block peers and torrents removal, while remote script can be configured for centralized configuration management and in-app BTT collection.

### Settings

The script provides two config files:

1. User config file location: `bittorrent-utils/config/user.js`
    * the settings from this file overwrite the default settings from the `default.js` file
    * edit this file to configure your instance of script
2. Default config file location: `bittorrent-utils/config/default.js`
    * a file with the default settings and their description
    * avoid editing this file in favor of editing `user.js` file

## FAQ

> **Q: How to send desired amount of in-app BTT to others?**
>
> **A:** Run `bittorrent-utils/MANUAL_TRANSFER.bat` and follow the instructions

> **Q: How to get my public key (speed address)?**
>
> **A:** Navigate in the browser http://127.0.0.1:[BITTORRENT_SPEED_PORT]/api/public_key

> **Q: My speed wallet shows wrong balance!**
>
> **A:** Navigate in the browser http://127.0.0.1:[BITTORRENT_SPEED_PORT]/api/refresh_balance

> **Q: Where can i find bittorrent speed port?**
>
> **A:** C:\Users\User\AppData\Local\BitTorrentHelper\port (example path) or in browser URL bar
> 
>  ![](screenshots/10.png?raw=true)

> **Q: What is the address of the withdrawal gateway?**
>
> **A:** [TTZu7wpHa9tnQjFUDrsjgPfXE7fck7yYs5](https://tronscan.org/#/address/TTZu7wpHa9tnQjFUDrsjgPfXE7fck7yYs5)

## Support

* You can ask for help or discuss the application in our community group in [Telegram](https://t.me/bittorrent_utils)
* If you found a bug, please open a [new issue](https://github.com/UkrainianHulk/bittorrent-utils/issues/new)

## Donations

* BTT/TRX/USDT (TRX20) TTijwYsndktUJbCHuW5oNPBWoWrJ5RV1iW
* BTT (in-app) BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk=

## [License](https://github.com/UkrainianHulk/bittorrent-utils/blob/main/LICENSE)
Copyright © 2021 Yaroslav Sorochan