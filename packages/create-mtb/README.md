# create-mtb

CLI tool to scaffold new mtb Web Components projects.

## Usage

```bash
# Using npm
npm create mtb my-app

# Or with npx
npx create-mtb my-app

# Then
cd my-app
npm install
npm start
```

## What's Included

The generated project includes:

- Pre-configured Parcel setup with @mtb-framework/parcel-transformer
- Example Web Components (.mtb files)
- Basic HTML entry point
- Development server with hot reloading

## Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── mtb-button.mtb
│   │   ├── mtb-card.mtb
│   │   └── mtb-header.mtb
│   ├── index.js
│   └── index.html
├── .parcelrc
└── package.json
```

## License

MIT
