# IMPORTANTE: Reiniciar el servidor

Las variables de entorno han sido agregadas al archivo `.env.local`. Para que Next.js las cargue correctamente, necesitas:

1. **Detener el servidor** actual (Ctrl+C en la terminal donde está corriendo)
2. **Iniciar el servidor** nuevamente con: `npm run dev`

Esto es necesario porque Next.js solo carga las variables de entorno cuando se inicia el servidor.

## Verificar que funciona:

Después de reiniciar, puedes verificar el estado de Bolt visitando:
- http://localhost:3001/api/debug/bolt
- http://localhost:3001/api/bolt/status

Si las credenciales están correctamente configuradas, deberías ver:
- En la página de Plataformas: Bolt aparecerá como "Conectado"
- Podrás sincronizar datos reales usando el botón "Sincronizar"