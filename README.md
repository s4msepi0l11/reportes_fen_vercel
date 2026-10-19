# Monitor FEN en Vercel

## Despliegue
1. Importa esta carpeta como proyecto Vercel (Framework Preset: Other; Root Directory: carpeta raíz del proyecto).
2. En Settings > Environment Variables, crea `POWER_AUTOMATE_URL` con la URL HTTP completa y firmada de Power Automate. No agregues prefijos `NEXT_PUBLIC_` ni `VITE_`.
3. Haz Deploy o Redeploy tras cambiar la variable.
4. Prueba el formulario en la URL HTTPS publicada. `index.html` usa `/api/report` y la función `api/report.js` envía el JSON a Power Automate.

## Importante: seguridad
La variable oculta la URL firmada, pero **NO protege la ruta `/api/report`**. En este proyecto de prueba cualquier visitante con acceso al sitio puede enviar solicitudes y datos al flujo. No lo publiques para capturar DNI/nombres reales sin autenticación corporativa, controles de autorización, protección contra abuso y aprobación de la política de datos de tu organización. Vercel puede procesar información fuera del entorno Microsoft 365; valida la autorización para ello.

Regenera la URL firmada de Power Automate antes de usarla, porque la anterior fue compartida en la conversación. El flujo debe tener `Agregar una fila a una tabla` antes de `Respuesta`, y `Respuesta` debe devolver `{ "success": true }` únicamente tras guardar correctamente.
