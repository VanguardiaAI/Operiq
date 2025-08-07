# Bolt API Integration

## Configuración

Para usar la API de Bolt, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```
BOLT_CLIENT_ID=tu_client_id
BOLT_CLIENT_SECRET=tu_client_secret
```

## Endpoints Disponibles

### 1. Test de Conexión
**POST** `/api/bolt/test`

Prueba la conexión con la API de Bolt.

```json
{
  "company_ids": [123, 456]
}
```

### 2. Obtener Compañías
**GET** `/api/bolt/companies`

Obtiene la lista de IDs de compañías a las que tienes acceso.

### 3. Obtener Órdenes
**POST** `/api/bolt/orders`

Obtiene las órdenes de una compañía en un rango de fechas.

```json
{
  "company_id": 123,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "limit": 100,
  "offset": 0
}
```

**GET** `/api/bolt/orders?company_id=123&start_date=2024-01-01&end_date=2024-01-31&limit=100&offset=0`

### 4. Obtener Conductores
**POST** `/api/bolt/drivers`

Obtiene los conductores de una compañía.

```json
{
  "company_id": 123,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "portal_status": "active",
  "search": "John",
  "limit": 100,
  "offset": 0
}
```

### 5. Obtener Vehículos
**POST** `/api/bolt/vehicles`

Obtiene los vehículos de una compañía.

```json
{
  "company_id": 123,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "portal_status": "active",
  "search": "Toyota",
  "limit": 100,
  "offset": 0
}
```

### 6. Obtener Logs de Estado
**POST** `/api/bolt/state-logs`

Obtiene los logs de estado de los conductores.

```json
{
  "company_id": 123,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "limit": 100,
  "offset": 0
}
```

## Ejemplo de Uso con JavaScript

```javascript
// Obtener compañías
const companiesResponse = await fetch('/api/bolt/companies');
const { data: { company_ids } } = await companiesResponse.json();

// Obtener órdenes
const ordersResponse = await fetch('/api/bolt/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    company_id: company_ids[0],
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    limit: 100,
    offset: 0
  })
});

const { data: ordersData } = await ordersResponse.json();
console.log(`Total orders: ${ordersData.total}`);
console.log(`Company name: ${ordersData.companyName}`);
console.log('Orders:', ordersData.orders);
```

## Manejo de Errores

Todos los endpoints devuelven errores en el siguiente formato:

```json
{
  "error": "Mensaje de error"
}
```

### Códigos de Error Comunes

- **400**: Parámetros inválidos o faltantes
- **503**: API de Bolt no configurada (faltan credenciales)
- **500**: Error interno del servidor

### Errores Específicos de Bolt

- **498805**: La fecha de inicio es anterior a la fecha permitida
- **498806**: El rango de fechas es demasiado largo
- **498807**: La compañía no fue encontrada
- **498809**: La compañía no está activa
- **498810**: No tienes acceso a esta compañía