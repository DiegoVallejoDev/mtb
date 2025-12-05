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

## Supported File Extensions

mtb supports multiple file extensions for single-file components:

| Extension | Description | IDE Support |
|-----------|-------------|-------------|
| `*.mtb` | Original mtb extension | Requires custom plugin |
| `*.component.html` | Angular-style naming | Native HTML support |
| `*.mtb.html` | mtb-branded HTML | Native HTML support |

**Tip**: Rename your `.mtb` files to `.component.html` or `.mtb.html` for better IDE support.

## Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── mtb-button.mtb    (can also use .component.html or .mtb.html)
│   │   ├── mtb-card.mtb
│   │   └── mtb-header.mtb
│   ├── index.js
│   └── index.html
├── .parcelrc
└── package.json
```

## License

MIT
