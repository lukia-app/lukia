import { fireEvent, render, screen } from '@testing-library/react-native';
import Storage from 'expo-sqlite/kv-store';
import App from '../App';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: { getItemSync: jest.fn(), setItemSync: jest.fn() },
}));

const leer = jest.mocked(Storage.getItemSync);
const escribir = jest.mocked(Storage.setItemSync);

async function anotar(monto: string, descripcion: string) {
  await fireEvent.changeText(screen.getByLabelText('Monto en soles'), monto);
  await fireEvent.changeText(screen.getByLabelText('¿En qué gastaste?'), descripcion);
  await fireEvent.press(screen.getByText('Guardar'));
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  leer.mockReturnValue(null);
});

test('anota un gasto, lo muestra y lo guarda', async () => {
  await render(<App />);
  await anotar('8,50', 'Menú');
  expect(screen.getByText('Menú')).toBeTruthy();
  expect(screen.getByText('S/ 8.50')).toBeTruthy();
  expect(escribir).toHaveBeenCalledTimes(1);
});

test('un gasto nuevo no borra los anteriores', async () => {
  const anterior = { centimos: 300, descripcion: 'Pasaje', fecha: 1 };
  leer.mockReturnValue(JSON.stringify([anterior]));
  await render(<App />);
  expect(screen.getByText('Pasaje')).toBeTruthy();
  await anotar('8', 'Menú');
  expect(JSON.parse(escribir.mock.calls[0][1] as string)).toEqual([
    { centimos: 800, descripcion: 'Menú', fecha: expect.any(Number) },
    anterior,
  ]);
});

test.each([
  ['hola', 'Menú', /monto válido/],
  ['8', '  ', /en qué gastaste/],
])('no guarda con monto %p y descripción %p', async (monto, descripcion, mensaje) => {
  await render(<App />);
  await anotar(monto, descripcion);
  expect(screen.getByText(mensaje)).toBeTruthy();
  expect(escribir).not.toHaveBeenCalled();
});

test('si falla el guardado avisa y no muestra el gasto como anotado', async () => {
  escribir.mockImplementation(() => {
    throw new Error('disco lleno');
  });
  await render(<App />);
  await anotar('8', 'Menú');
  expect(screen.getByText(/No se pudo guardar/)).toBeTruthy();
  expect(screen.queryByText('S/ 8.00')).toBeNull();
});

test('si lo guardado está dañado avisa y no deja sobrescribirlo', async () => {
  leer.mockReturnValue('no es json');
  await render(<App />);
  expect(screen.getByText(/No pudimos leer/)).toBeTruthy();
  expect(screen.queryByText('Guardar')).toBeNull();
});
