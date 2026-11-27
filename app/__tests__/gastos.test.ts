import Storage from 'expo-sqlite/kv-store';
import { cargarGastos, formatearMonto, guardarGastos, leerMonto } from '../gastos';

jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: { getItemSync: jest.fn(), setItemSync: jest.fn() },
}));

const leer = jest.mocked(Storage.getItemSync);

test.each([
  ['8', 800],
  ['8.50', 850],
  ['8,50', 850],
  ['8.5', 850],
  [' 0.05 ', 5],
  ['19.99', 1999],
])('leerMonto acepta %p', (texto, centimos) => {
  expect(leerMonto(texto)).toBe(centimos);
});

test.each(['', 'abc', '0', '0.00', '-5', '1.234', '1,000', '1.2.3', '8.', '1e3'])(
  'leerMonto rechaza %p',
  (texto) => {
    expect(leerMonto(texto)).toBeNull();
  },
);

test('formatearMonto muestra dos decimales', () => {
  expect(formatearMonto(850)).toBe('S/ 8.50');
});

test('sin datos guardados la lista está vacía', () => {
  leer.mockReturnValue(null);
  expect(cargarGastos()).toEqual([]);
});

test('lo que se guarda se puede volver a leer', () => {
  const gastos = [{ centimos: 850, descripcion: 'Menú', fecha: 1 }];
  guardarGastos(gastos);
  leer.mockReturnValue(jest.mocked(Storage.setItemSync).mock.calls[0][1] as string);
  expect(cargarGastos()).toEqual(gastos);
});

test.each(['no es json', '{}', '[null]', '[{}]'])('lanza un error si lo guardado está dañado: %p', (guardado) => {
  leer.mockReturnValue(guardado);
  expect(() => cargarGastos()).toThrow();
});
