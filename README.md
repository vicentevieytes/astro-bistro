# astro-bistro

A web application for managing your restaurant's menu and orders

# Buildear la imagen Docker

```bash
docker build -t astro-bistro
```

# Iniciar la aplicación con docker compose

```bash
docker compose up
```

Esto iniciara:
- El frontend del consumidor en el puerto 4321
- El frontend del restaurante en el puerto 4322
- El backend en el puerto 5001
- La base de datos en el puerto 5432

# Instalacion local:

Instalar dependencias:

```bash
npm install
cd frontend-consumidor
npm install
cd ../frontend-restaurante
npm install
```

Desde la raiz del repositorio iniciar la base de datos con docker compose (o cargar el dump backend/verLaCartaBackup.sql en una instancia local de postgres):

```bash
docker compose up db
```

Copiar el archivo `backend/.env.sample` a `.env`, modificar las variables de entorno si es necesario.

```bash
cp backend/.env.sample backend/.env
cp frontend-consumidor/.env.sample frontend-consumidor/.env
cp frontend-restaurante/.env.sample frontend-restaurante/.env
```

Iniciar los servidores en terminales distintas:

```bash
npm run consumidorFE
npm run restauranteFE
npm run backend
```

Para enviar comandos a la base de datos instalar `psql` y ejecutar:

```bash
 psql postgresql://postgres:postgres@localhost:3333/astro-bistro
```

o

```bash
psql -h localhost -p 3333 -U postgres -d astro-bistro
```

e ingresar la contraseña `postgres`.

Para detener la base de datos:

```bash
docker compose down
```

# Use cases:

-   El cliente va a un restaurante y puede escanear un código QR que lo lleva al menu y puede hacer un pedido desde ahí, cada mesa del restaurante está asociada a un código qr en particular así que el restaurante sabe desde que mesa se hizo el pedido.
-   El administrador del restaurante puede ver los pedidos que van llegando de cada mesa, puede aceptarlos o rechazarlos e ir pasandolos de estado confirmado-> en preparacion -> listo.
-   El administrador pude pasar la comanda a la cocina a partir del pedido del cliente.
-   El cliente puede ver como el estado de su pedido se va actualizando.

# Detalles de implementación:

-   El menu puede ser contenido estático como un pdf o html plano, no hace falta que sea interactivo o modificable ni que los pedidos sean personalizables.

*   No hace falta implementar persistencia, pero esto implica que cada vez que lo levantemos hay que registrar un restaurante, las mesas, generar los qrs, el menu, etc. El profe mencionó que si queremos podemos implementarlo o serializar las estructuras de memoria y guardar un "snapshot" del estado.
