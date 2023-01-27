# 🔄 Tailwind to CSS (tw-to-css)

Transform Tailwind classes to pure CSS using our plug-and-play package, compatible with both CSR and SSR. The package also includes the option to convert the output to JSON for use with React or other tools.

## Installation

```sh
npm install tw-to-css -E
```

```sh
yarn add tw-to-css -E
```

## Usage

```typescript
import { twi, twj } from "tw-to-css";

// Convert classes to inline CSS
const styleInline = twi(`bg-white mx-auto`);
// Output: margin-left:auto;margin-right:auto;background-color:rgb(255, 255, 255);

// Convert classes to JSON
const styleJSON = twj(`bg-white mx-auto`);
// Output: {marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'rgb(255, 255, 255)'}
```

The first parameter expects the `content`, which can be in `string` or `string[]` format.

### `twi` and `twj` functions take an additional options object that allows you to configure the output.

#### Options:

| Option | Type    | Default | Result                                                        |
| ------ | ------- | ------- | ------------------------------------------------------------- |
| minify | boolean | true    | Compresses the CSS code                                       |
| merge  | boolean | true    | Combines all generated CSS classes into a single style block. |

#### Example:

```typescript
twi("bg-white mx-auto", { minify: false, merge: false });
/*
Output:
.mx-auto {
    margin-left: auto;
    margin-right: auto
}
  .bg-white {
    background-color: rgb(255, 255, 255)
}
*/
```

### You can also configure your own Tailwind config using the tailwindToCSS function:

```typescript
import { tailwindToCSS } from "tw-to-css";

const { twi, twj } = tailwindToCSS({
  config: {
    theme: {
      extend: {
        colors: {
          "custom-color": "#ff0000",
        },
      },
    },
  },
});
```

### Example of usage with React:

```tsx
import * as React from "react";
import { twj } from "tw-to-css";

export default function EmailTemplate() {
  return (
    <html>
      <body style={twj("font-sans text-md bg-white py-4")}>
        <h1 style={twj("text-black text-center p-0 my-2 mx-0")}>Tailwind to CSS!</h1>
        <p style={twj("text-gray-400 text-center")}>Transform Tailwind classes to pure CSS</p>
      </body>
    </html>
  );
}

/*
Output:
<html>
  <body
    style="
      background-color: rgb(255, 255, 255);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
      padding-top: 1rem;
      padding-bottom: 1rem;
    "
  >
    <h1
      style="
        margin: 0.5rem 0px;
        padding: 0px;
        text-align: center;
        color: rgb(0, 0, 0);
      "
    >
      Tailwind to CSS!
    </h1>
    <p style="color: rgb(156, 163, 175); text-align: center">
      Transform Tailwind classes to pure CSS
    </p>
  </body>
</html>
*/
```
