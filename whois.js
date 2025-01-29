// whois_processor.js

/**
 * Este script permite ingresar URLs para obtener datos de WHOIS,
 * demostrando un diseño basado en 23 principios de ingeniería de software:
 * KISS, DRY, SoC, SRP, OCP, LSP, ISP, DIP, Inyección de Dependencias,
 * Alta Cohesión & Bajo Acoplamiento, Encapsulación, Principio de Menor Sorpresa,
 * Composición sobre Herencia, Clean Code, Auto-documentado, Refactorización Continua,
 * SSOT, Fail Fast, Menor Privilegio, Ley de Deméter y Gestión de Excepciones.
 */

const readline = require('readline');
const { exec } = require('child_process');

/**
 * @class WhoisService
 * Encargado de realizar llamadas WHOIS y parsear la respuesta.
 */
class WhoisService {
  /**
   * Realiza la llamada WHOIS a un dominio dado.
   * @param {string} hostname El dominio (hostname) a consultar.
   * @returns {Promise<{error: string|null, data: string|null}>}
   */
  async getWhoisRaw(hostname) {
    return new Promise((resolve) => {
      exec(`whois ${hostname}`, (error, stdout, stderr) => {
        if (error) {
          return resolve({ error: `Error al ejecutar WHOIS: ${error.message}`, data: null });
        }
        if (!stdout) {
          return resolve({ error: 'WHOIS no devolvió datos.', data: null });
        }
        return resolve({ error: null, data: stdout });
      });
    });
  }

  /**
   * Busca y extrae la fecha (formato AAAA-MM-DD o AAAA/MM/DD) y la convierte a AAAA-MM-DD.
   * @param {string} line
   * @returns {string|null}
   */
  extractDate(line) {
    let match = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];

    match = line.match(/(\d{4}\/\d{2}\/\d{2})/);
    if (match) {
      return match[1].replace(/\//g, '-');
    }
    return null;
  }

  /**
   * Convierte un string de fecha a objeto Date (valida su correcta conversión).
   * @param {string} str
   * @returns {Date|null}
   */
  toDate(str) {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Parsea la salida WHOIS para extraer:
   *   - País del registrante
   *   - Fechas de creación, actualización y expiración
   * @param {string} rawData
   * @returns {{
   *   registrantCountry: string|null,
   *   creationDate: Date|null,
   *   updatedDate: Date|null,
   *   expiryDate: Date|null
   * }}
   */
  parseWhoisOutput(rawData) {
    let registrantCountry = null;
    let creationDate = null;
    let updatedDate = null;
    let expiryDate = null;

    const lines = rawData.split('\n').map(line => line.trim());

    for (const line of lines) {
      // Buscar país
      if (/registrant country:/i.test(line) || /^country:/i.test(line)) {
        const parts = line.split(':').map(p => p.trim());
        if (parts[1]) {
          registrantCountry = parts[1];
        }
      }

      // Fechas de creación
      if (/created on:/i.test(line) || /creation date:/i.test(line) || /registered on:/i.test(line)) {
        const dateStr = this.extractDate(line);
        if (dateStr) creationDate = dateStr;
      }

      // Fechas de actualización
      if (/updated on:/i.test(line) || /last updated on:/i.test(line) || /updated date:/i.test(line)) {
        const dateStr = this.extractDate(line);
        if (dateStr) updatedDate = dateStr;
      }

      // Fechas de expiración
      if (/expiration date:/i.test(line) || /expires on:/i.test(line) || /expiry date:/i.test(line)) {
        const dateStr = this.extractDate(line);
        if (dateStr) expiryDate = dateStr;
      }
    }

    return {
      registrantCountry,
      creationDate: this.toDate(creationDate),
      updatedDate: this.toDate(updatedDate),
      expiryDate: this.toDate(expiryDate)
    };
  }

  /**
   * Realiza la operación completa: ejecuta WHOIS, luego parsea el resultado.
   * @param {string} hostname
   * @returns {Promise<{error: string|null, data: { raw: string, parsed: any }}>}
   */
  async getWhoisData(hostname) {
    const { error, data } = await this.getWhoisRaw(hostname);
    if (error) {
      return { error, data: null };
    }
    const parsed = this.parseWhoisOutput(data);
    return { error: null, data: { raw: data, parsed } };
  }
}

/**
 * getCleanHostname
 * Obtiene el dominio (hostname) limpio de una URL dada.
 * Elimina subdominio "www." y maneja la ausencia del protocolo.
 *
 * @param {string} urlInput
 * @returns {string|null}
 */
function getCleanHostname(urlInput) {
  if (!urlInput) return null;

  let tempUrl = urlInput.trim();
  if (!/^https?:\/\//i.test(tempUrl)) {
    tempUrl = 'http://' + tempUrl;
  }

  try {
    const parsedUrl = new URL(tempUrl);
    let hostname = parsedUrl.hostname.toLowerCase();
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch {
    return null;
  }
}

/**
 * printWhoisData
 * Imprime con colores la data cruda y los campos parseados (país, fechas).
 *
 * @param {string} rawData
 * @param {{
 *   registrantCountry: string|null,
 *   creationDate: Date|null,
 *   updatedDate: Date|null,
 *   expiryDate: Date|null
 * }} parseData
 */
function printWhoisData(rawData, parseData) {
  const { registrantCountry, creationDate, updatedDate, expiryDate } = parseData;

  console.log('\x1b[1m\x1b[34m=========================================\x1b[0m');
  console.log('\x1b[1m\x1b[34m       WHOIS - Información Completa      \x1b[0m');
  console.log('\x1b[1m\x1b[34m=========================================\x1b[0m\n');

  // WHOIS crudo (color cian)
  console.log('\x1b[36m' + rawData + '\x1b[0m');

  console.log('\x1b[1m\x1b[34m-----------------------------------------\x1b[0m');

  // Datos parseados (color verde)
  console.log('\x1b[1m\x1b[32mPaís Registrante:\x1b[0m', registrantCountry || 'N/A');
  console.log('\x1b[1m\x1b[32mFecha de Creación:\x1b[0m', creationDate ? creationDate.toISOString().split('T')[0] : 'N/A');
  console.log('\x1b[1m\x1b[32mFecha de Actualización:\x1b[0m', updatedDate ? updatedDate.toISOString().split('T')[0] : 'N/A');
  console.log('\x1b[1m\x1b[32mFecha de Expiración:\x1b[0m', expiryDate ? expiryDate.toISOString().split('T')[0] : 'N/A');

  console.log('\x1b[1m\x1b[34m=========================================\x1b[0m');
}

/**
 * main
 * Función principal para el ciclo de consulta al usuario.
 */
async function main() {
  const whoisService = new WhoisService();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask(question) {
    return new Promise(resolve => {
      rl.question(question, (answer) => resolve(answer.trim()));
    });
  }

  console.log('\x1b[1mBienvenido al sistema de consultas WHOIS.\x1b[0m');
  console.log('Por favor, ingresa la URL (o presiona Enter en vacío para salir):\n');

  while (true) {
    const urlInput = await ask('URL: ');
    if (!urlInput) {
      console.log('Saliendo del programa...');
      break;
    }

    const hostname = getCleanHostname(urlInput);
    if (!hostname) {
      console.log('\x1b[31mURL inválida. Por favor intenta nuevamente.\x1b[0m');
      continue;
    }

    console.log(`Consultando WHOIS para \x1b[33m${hostname}\x1b[0m...\n`);

    const { error, data } = await whoisService.getWhoisData(hostname);
    if (error) {
      console.log('\x1b[31m' + error + '\x1b[0m');
    } else {
      printWhoisData(data.raw, data.parsed);
    }

    console.log('\n¿Deseas consultar otra URL?');
    console.log('Si es así, escríbela a continuación. De lo contrario, presiona Enter en vacío para salir.\n');
  }

  rl.close();
}

// Ejecución de la función principal
main();
