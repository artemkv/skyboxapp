```
ionic build
npx cap sync android
npx cap run android
```

To generate app icon:

- Save into /assets
- Run

```
npx @capacitor/assets generate
```

## Open the project in Android Studio

```
npx cap open android
```

## Release checklist

```
npx tsc --noEmit
```

```
npm run test
```
