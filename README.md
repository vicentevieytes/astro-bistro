# astro-bistro

A web application for managing your restaurant's menu and orders

# Use cases:

-   El cliente va a un restaurante y puede escanear un código QR que lo lleva al menu y puede hacer un pedido desde ahí, cada mesa del restaurante está asociada a un código qr en particular así que el restaurante sabe desde que mesa se hizo el pedido.
-   El administrador del restaurante puede ver los pedidos que van llegando de cada mesa, puede aceptarlos o rechazarlos e ir pasandolos de estado confirmado-> en preparacion -> listo.
-   El administrador pude pasar la comanda a la cocina a partir del pedido del cliente.
-   El cliente puede ver como el estado de su pedido se va actualizando.

# Detalles de implementación:

-   El menu puede ser contenido estático como un pdf o html plano, no hace falta que sea interactivo o modificable ni que los pedidos sean personalizables.

*   No hace falta implementar persistencia, pero esto implica que cada vez que lo levantemos hay que registrar un restaurante, las mesas, generar los qrs, el menu, etc. El profe mencionó que si queremos podemos implementarlo o serializar las estructuras de memoria y guardar un "snapshot" del estado.

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run backend`         | Run backend                                      |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

> > > > > > > bc6f6ee (Initial commit from Astro)
