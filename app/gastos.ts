import Storage from 'expo-sqlite/kv-store';

export type Gasto = { centimos: number; descripcion: string; fecha: number };

const CLAVE = 'gastos';

/** Devuelve céntimos enteros, o null si el texto no es un monto válido. */
export function leerMonto(texto: string): number | null {
  const partes = /^(\d{1,6})(?:[.,](\d{1,2}))?$/.exec(texto.trim());
  if (!partes) return null;
  const centimos = Number(partes[1]) * 100 + Number((partes[2] ?? '').padEnd(2, '0'));
  return centimos > 0 ? centimos : null;
}

export function formatearMonto(centimos: number): string {
  return `S/ ${(centimos / 100).toFixed(2)}`;
}

function esGasto(g: Partial<Gasto> | null): g is Gasto {
  return (
    Number.isSafeInteger(g?.centimos) &&
    typeof g?.descripcion === 'string' &&
    Number.isFinite(g.fecha)
  );
}

/** Lanza un error si lo guardado está dañado, para que nadie lo sobrescriba. */
export function cargarGastos(): Gasto[] {
  const guardado = Storage.getItemSync(CLAVE);
  if (guardado === null) return [];
  const gastos: unknown = JSON.parse(guardado);
  if (!Array.isArray(gastos) || !gastos.every(esGasto)) throw new Error('La lista de gastos guardada no es válida');
  return gastos;
}

// shortcut: reescribe la lista entera en cada gasto, cambiar cuando los datos pasen al servidor
export function guardarGastos(gastos: Gasto[]): void {
  Storage.setItemSync(CLAVE, JSON.stringify(gastos));
}
