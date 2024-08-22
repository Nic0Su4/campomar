
# Documentación de la Base de Datos

## Estructura General
La base de datos está diseñada para gestionar la información relacionada con empleados, platos, y pedidos en un sistema de gestión de un restaurante. A continuación, se describe en detalle la estructura de la base de datos.

### Tablas Principales

#### 1. Tabla `TipoEmpleado`
- **Propósito**: Almacena los diferentes tipos de empleados.
- **Campos**:
  - `TipoEmpleadoID` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único del tipo de empleado.
  - `Descripcion` (VARCHAR(50)): Descripción del tipo de empleado.

#### 2. Tabla `Empleados`
- **Propósito**: Registra la información de los empleados.
- **Campos**:
  - `EmpleadoID` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único del empleado.
  - `Nombre` (VARCHAR(100)): Nombre del empleado.
  - `TipoEmpleadoID` (INT, FOREIGN KEY): Referencia al tipo de empleado.
  - `Password` (VARCHAR(255)): Contraseña cifrada del empleado.
- **Relaciones**:
  - FK: `TipoEmpleadoID` referencia a la tabla `TipoEmpleado`.

#### 3. Tabla `Platos`
- **Propósito**: Almacena los diferentes platos ofrecidos.
- **Campos**:
  - `PlatoID` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único del plato.
  - `Descripcion` (VARCHAR(255)): Descripción del plato.
  - `Precio` (DECIMAL(10, 2)): Precio del plato.

#### 4. Tabla `Pedidos`
- **Propósito**: Registra los pedidos realizados.
- **Campos**:
  - `PedidoID` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único del pedido.
  - `EmpleadoID` (INT, FOREIGN KEY): Referencia al empleado que realizó el pedido.
  - `PlatoID` (INT, FOREIGN KEY): Referencia al plato solicitado.
  - `Cantidad` (INT): Cantidad de platos solicitados.
  - `PrecioTotal` (DECIMAL(10, 2)): Precio total del pedido.
- **Relaciones**:
  - FK: `EmpleadoID` referencia a la tabla `Empleados`.
  - FK: `PlatoID` referencia a la tabla `Platos`.

### Índices
- **Índice `idx_EmpleadoID`**: Crea un índice en el campo `EmpleadoID` de la tabla `Pedidos`.
- **Índice `idx_PlatoID`**: Crea un índice en el campo `PlatoID` de la tabla `Pedidos`.

### Restricciones de Integridad
- **Restricción `chk_Cantidad`**: Asegura que la cantidad de platos pedidos sea mayor que cero.
- **Restricción `chk_Nombre`**: Asegura que el nombre del empleado no esté vacío.

### Procedimientos Almacenados
La base de datos incluye varios procedimientos almacenados que permiten insertar, eliminar, editar y leer datos en las tablas `TipoEmpleado`, `Empleados`, `Platos`, y `Pedidos`.

### Triggers
Los triggers en la base de datos permiten mantener un registro de auditoría de las operaciones realizadas en las tablas `Empleados` y `Pedidos`.

### Tabla de Auditoría
- **Propósito**: Registra las operaciones de inserción, actualización y eliminación realizadas en la base de datos.
- **Campos**:
  - `AuditoriaID` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único de la auditoría.
  - `Operacion` (VARCHAR(10)): Tipo de operación (INSERT, UPDATE, DELETE).
  - `TablaAfectada` (VARCHAR(50)): Nombre de la tabla afectada.
  - `IDAfectado` (INT): Identificador del registro afectado.
  - `Fecha` (TIMESTAMP): Fecha y hora de la operación.
  - `Usuario` (VARCHAR(50)): Usuario que realizó la operación.
