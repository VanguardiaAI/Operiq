# Operiq Dashboard

Un panel de control moderno para monitoreo de métricas y detección de fraudes en flotas de vehículos.

## 🚀 Características

- ✅ **Autenticación segura** con NextAuth y MongoDB
- 📊 **Dashboard interactivo** con métricas en tiempo real
- 📈 **Visualización de datos** con gráficos de línea, barras y circular
- 🚨 **Sistema de alertas de fraude** con detección por IA
- 🎨 **Interfaz moderna** con shadcn/ui y Tailwind CSS
- 📱 **Diseño responsive** para todos los dispositivos

## 📋 Requisitos Previos

- Node.js 18+ 
- MongoDB Atlas cuenta (gratuita)
- npm o yarn

## 🛠️ Instalación

1. **Clonar o navegar al proyecto**
```bash
cd operiq-dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar MongoDB Atlas**
   - Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crear un nuevo cluster (gratis)
   - Crear una base de datos llamada "operiq"
   - Obtener la cadena de conexión (connection string)

4. **Configurar variables de entorno**
   
   Editar el archivo `.env.local` con tu información:
```env
# MongoDB - Reemplaza con tu connection string
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/operiq?retryWrites=true&w=majority

# NextAuth - Genera una clave secreta segura
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-una-clave-secreta-aqui

# Admin credentials
ADMIN_EMAIL=admin@operiq.com
ADMIN_PASSWORD=Admin123!
```

Para generar una clave secreta segura:
```bash
openssl rand -base64 32
```

## 🚀 Ejecutar el Proyecto

1. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

2. **Crear el usuario administrador**
   
   Visita en tu navegador:
   ```
   http://localhost:3000/api/seed
   ```
   
   Esto creará el usuario admin con las credenciales configuradas.

3. **Acceder al dashboard**
   - Ve a `http://localhost:3000`
   - Inicia sesión con:
     - Email: `admin@operiq.com`
     - Contraseña: `Admin123!` (o la que hayas configurado)

## 📁 Estructura del Proyecto

```
operiq-dashboard/
├── app/
│   ├── api/           # Endpoints de la API
│   ├── dashboard/     # Páginas del dashboard
│   ├── login/         # Página de login
│   └── layout.tsx     # Layout principal
├── components/
│   ├── dashboard/     # Componentes del dashboard
│   ├── providers/     # Providers de contexto
│   └── ui/            # Componentes de shadcn/ui
├── lib/
│   ├── auth.ts        # Configuración de NextAuth
│   ├── mongodb.ts     # Conexión a MongoDB
│   └── utils.ts       # Utilidades
├── models/
│   └── User.ts        # Modelo de usuario
└── middleware.ts      # Middleware de autenticación
```

## 🎨 Personalización

### Colores y Tema
Los colores se pueden personalizar en `app/globals.css` modificando las variables CSS.

### Agregar nuevas páginas
1. Crear un nuevo archivo en `app/dashboard/[nombre]/page.tsx`
2. Agregar el enlace en `components/dashboard/sidebar.tsx`

### Modificar métricas
Editar `app/dashboard/page.tsx` para cambiar los datos mostrados.

## 🔒 Seguridad

- Las contraseñas se encriptan con bcrypt
- Las sesiones usan JWT
- Las rutas del dashboard están protegidas con middleware
- MongoDB connection string debe mantenerse privada

## 📱 Características del Dashboard

- **Métricas principales**: Ingresos, gastos, flota, conductores
- **Gráficos interactivos**: Rendimiento financiero, distribución por plataforma
- **Alertas de fraude**: Sistema de detección con notificaciones
- **Navegación lateral**: Acceso rápido a todas las secciones
- **Modo oscuro**: Soporte para tema oscuro (próximamente)

## 🚀 Despliegue

Para desplegar en producción:

1. **Vercel** (recomendado):
```bash
npm install -g vercel
vercel
```

2. **Build para producción**:
```bash
npm run build
npm start
```

## 📝 Licencia

Este proyecto es privado y confidencial para Operiq.

## 🤝 Soporte

Para soporte o preguntas, contactar al equipo de desarrollo.