# astro-bistro
A web application for managing your restaurant's menu and orders

# Use cases:
- El cliente va a un restaurante y puede escanear un código QR que lo lleva al menu y puede hacer un pedido desde ahí, cada mesa del restaurante está asociada a un código qr en particular así que el restaurante sabe desde que mesa se hizo el pedido.
- El administrador del restaurante puede ver los pedidos que van llegando de cada mesa, puede aceptarlos o rechazarlos e ir pasandolos de estado confirmado-> en preparacion -> listo.
- El administrador pude pasar la comanda a la cocina a partir del pedido del cliente.
- El cliente puede ver como el estado de su pedido se va actualizando.

# Detalles de implementación:
* El menu puede ser contenido estático como un pdf o html plano, no hace falta que sea interactivo o modificable ni que los pedidos sean personalizables.
- No hace falta implementar persistencia, pero esto implica que cada vez que lo levantemos hay que registrar un restaurante, las mesas, generar los qrs, el menu, etc. El profe mencionó que si queremos podemos implementarlo o serializar las estructuras de memoria y guardar un "snapshot" del estado.
