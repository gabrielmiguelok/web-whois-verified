### Introducción

¿Necesitas verificar la información WHOIS de un dominio de forma **rápida y sencilla**? Este script en Node.js te permite **pegar cualquier URL** y obtener datos cruciales, como **país de registro** y **fechas de creación, actualización y expiración** del dominio. Además, está cuidadosamente diseñado conforme a **23 principios de ingeniería de software** que garantizan escalabilidad, mantenibilidad y claridad en el código.

### ¿Por Qué Importan los 23 Principios?

1. **KISS**: Mantenemos la solución simple para evitar complejidad innecesaria.
2. **DRY**: No duplicamos código; cada lógica está en un lugar único.
3. **SoC y SRP**: Separación de responsabilidades; cada clase y función tiene su única tarea.
4. **OCP, LSP, ISP, DIP**: Estructura orientada a la extensión, evitando modificar lo que ya funciona, manteniendo clases intercambiables y sin dependencias fuertes.
5. **Dependency Injection**: Aunque este script es pequeño, se inyectan dependencias (p. ej., la clase `WhoisService`) sin atarla directamente.
6. **Alta Cohesión & Bajo Acoplamiento**: Cada componente hace su labor sin mezclarse con otras capas.
7. **Encapsulación & Principio de Menor Sorpresa**: Exponemos solo lo necesario, con comportamiento predecible.
8. **Composición Sobre Herencia**: Preferimos objetos y composición frente a grandes jerarquías de herencia.
9. **Clean Code & Auto-documentado**: Nombres descriptivos, código fácil de leer.
10. **Refactorización Continua**: Estructura pensada para ser fácilmente mejorada en el futuro.
11. **SSOT (Single Source of Truth)**: Toda la lógica está en un único script.
12. **Fail Fast**: Validamos URLs y errores de WHOIS rápidamente.
13. **Menor Privilegio & Ley de Deméter**: Mínima exposición de detalles internos y comunicación con dependencias.
14. **Gestión de Excepciones**: Manejamos errores y devolvemos mensajes claros.

## Características

- **Consulta rápida**: Ingresa cualquier URL, el script la interpreta y extrae su dominio para la consulta.
- **Resultados en colores**: Muestra la respuesta WHOIS y los campos parseados en la terminal con formato resaltado.
- **Sin dependencias adicionales**: Usa módulos nativos de Node.js (`child_process`, `readline`) y el comando `whois` instalado en tu sistema operativo.
- **Interactivo**: Tras mostrar los resultados, te pregunta si deseas realizar otra consulta; al presionar Enter sin poner nada, finaliza.

## Requisitos

1. **Node.js** instalado.
2. El comando `whois` en tu sistema operativo:
    - Ubuntu/Debian: `sudo apt-get install whois`
    - Windows: Puedes usar WSL o buscar una herramienta `whois` compatible.

## Instalación

1. Clona este repositorio o descarga el archivo `whois_processor.js` en tu carpeta de proyecto.
2. Asegúrate de que Node.js y `whois` estén instalados.

## Uso

1. Abre una terminal en la carpeta donde tengas el archivo `whois.js`.
2. Ejecuta:
    
    ```bash
    node whois.js
    ```
    
3. Ingresa la URL que quieras consultar cuando aparezca el prompt en pantalla (acepta direcciones con o sin protocolo `http://` o `https://`, y también con o sin `www.`).
4. Verás la información WHOIS mostrada en colores y las fechas parseadas (siempre y cuando el registro WHOIS contenga esos datos).
5. Si deseas seguir consultando otros dominios, escribe una nueva URL y presiona Enter. Para salir, presiona Enter sin introducir nada.

## Ejemplo de Ejecución

```bash
$ node whois.js
Bienvenido al sistema de consultas WHOIS.
Por favor, ingresa la URL (o presiona Enter en vacío para salir):

URL: google.com
Consultando WHOIS para google.com...

=========================================
       WHOIS - Información Completa
=========================================

   ... (WHOIS Data) ...

-----------------------------------------
País Registrante: US
Fecha de Creación: 1997-09-15
Fecha de Actualización: 2022-09-20
Fecha de Expiración: 2028-09-14
=========================================

¿Deseas consultar otra URL?
Si es así, escríbela a continuación. De lo contrario, presiona Enter en vacío para salir.

```

## Personalización

- Si deseas procesar varios dominios de forma automática (por ejemplo, desde un archivo CSV), puedes ajustar el código en la función `main()` para leer múltiples entradas y llamar a `whoisService.getWhoisData()` secuencialmente o en paralelo.
- Para usar servicios WHOIS de terceros (APIs con claves, etc.), reemplaza la lógica del método `getWhoisRaw()` en la clase `WhoisService`.

## Contribuciones

¡Las contribuciones son bienvenidas! Siente la libertad de hacer un **fork** de este repositorio, crear una rama y enviarnos tus *pull requests* o abrir *issues* para reportar problemas o proponer mejoras.
