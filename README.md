# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Configure ###

Copy config file and change it.
```bash
cp ./config/config.example.ts ./config/config.ts
```
Install backend dependencies:
```bash
yarn install
```
OR
```bash
npm install
```

Install frontend dependencies:
```bash
bower install
```

NOTE: Remove bower.

#### Canvas configure ####

OS | Command
----- | -----
OS X | `brew install pkg-config cairo libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel giflib-devel`

**El Capitan users:** If you have recently updated to El Capitan and are experiencing trouble when compiling, run the following command: `xcode-select --install`. Read more about the problem [on Stack Overflow](http://stackoverflow.com/a/32929012/148072).

**Fonts:** if you have trouble with font sizes - just remove pango and recompile `npm recompile`

### Runing ###

Start dev application:
```bash
npm run start
```

### Commands ###

Sync schema:
```
ts-node cli.ts sync_schema
```

Run migrations:
```
ts-node cli.ts migrate
```

Update all comments in all groups:
```
ts-node cli.ts update_all_comments
```

Update commentators cache for all groups(with comments update):
```
ts-node cli.ts update_all_cache
```

Remove all messages from message table:
```
ts-node cli.ts remove_all_messages
```

Build js for front-end:
```
gulp
```
