# Electron AutoTheme

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FZephraCloud%2FElectron-AutoTheme.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FZephraCloud%2FElectron-AutoTheme?ref=badge_shield)

The specified function is triggered at sunset and sunrise.

## Example

```ts
import { AutoTheme } from "electron-autotheme";

function setWindowTheme(useDark: boolean) {
    /* ... */
}

new AutoTheme(setWindowTheme);

// With electron-store
const store = new Store();

new AutoTheme(setWindowTheme, store);
```

## Electron Store

If you want to use electron-store to store the last location (for 48 hours), you can pass it as the second argument.

**Example**

```json
{
    "electron-autotheme": {
        "location": {
            "latitude": 0,
            "longitude": 0
        },
        "date": "2020-01-01T00:00:00.000Z"
    }
}
```

## Licenses

[kelektiv/node-cron - MIT](https://github.com/kelektiv/node-cron/blob/master/LICENSE)\
[IonicaBizau/node-ipinfo - MIT](https://github.com/IonicaBizau/node-ipinfo/blob/master/LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FZephraCloud%2FElectron-AutoTheme.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FZephraCloud%2FElectron-AutoTheme?ref=badge_large)
