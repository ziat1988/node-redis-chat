### Project use nodejs redis for chat app
- Call api from reactjs with proxy configure in vite.config.js

### Feature:
- use react routing
- redis to store db
- session store user, store session in redis too
- socket-io to chat in reactjs and nodejs
### TODO
- config for production
- Careful with lib use-http Ava: this lib go with cache built-in, when fetching with same url, it will be cached data before. So how to revalidate cache when a new message go in DBB?