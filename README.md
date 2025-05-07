# GrocedOut

## Firebase emulator setup

### Prerequisites

```ini
VITE_FIREBASE_API_KEY='***'
VITE_FIREBASE_AUTH_DOMAIN='***'
VITE_FIREBASE_PROJECT_ID='***'
VITE_FIREBASE_STORAGE_BUCKET='***'
VITE_FIREBASE_MESSAGING_SENDER_ID='***'
VITE_FIREBASE_APP_ID='***'

VITE_FIREBASE_AUTH_EMULATOR_URL='http://localhost:9099'
VITE_FIREBASE_FIRESTORE_EMULATOR_HOST='localhost'
VITE_FIREBASE_FIRESTORE_EMULATOR_PORT='8080'

VITE_ALLOWED_EMAILS='xxx@gmail.com,yyy@gmail.com'
```

```sh
npm install -g firebase-tools
```

### Automatic setup

To get the firebase emulator started up and seeded with base data:

```sh
npm run emulator:seed
```

### Manual setup

```sh
firebase emulators:start
```

If there's no `firebase.json` file, first:

```sh
firebase init emulators
# select:
# - auth
# - firestore

```

### Export data

**/!\ This will override the currently saved data /!\\**

If you want to export the data living in the emulator at a given point in use, run:

```sh
npm run emulator:export
```