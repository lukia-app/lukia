import { render, screen } from '@testing-library/react-native';
import App from '../App';

test('la pantalla inicial se muestra', async () => {
  await render(<App />);
  expect(screen.getByText(/App.tsx/)).toBeTruthy();
});
