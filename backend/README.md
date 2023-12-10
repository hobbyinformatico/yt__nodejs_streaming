# Dipendenze

## NVM
```
nvm install 18.16.0

nvm use 18
```

## NPM
- Server
```
npm install express body-parser
```
- Auth
```
npm install sqlite3 moment jsonwebtoken
```
- streaming
```
npm install mime range-parser fluent-ffmpeg
```
- Utilities
```
npm install express
```

# Avvio
```
cd backend
nvm use 18 && node server.js
```

# Tools
- Gestione Sqlite3 (linux, scaricabile anche da sito ufficiale)
```
sudo pacman -S sqlitebrowser

sudo apt-get install sqlitebrowser
```


# KILL sessioni bloccate
```
ps -aux | grep frontend

kill -9 <pid1> <pid2>
```
