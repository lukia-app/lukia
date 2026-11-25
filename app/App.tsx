import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { cargarGastos, formatearMonto, guardarGastos, leerMonto, type Gasto } from './gastos';

const formatoFecha = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function cargaInicial(): Gasto[] | null {
  try {
    return cargarGastos();
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Fuera de Gastos para que escribir en el formulario no vuelva a dibujar la lista
const clave = (gasto: Gasto) => String(gasto.fecha);
const listaVacia = () => <Text style={styles.suave}>Todavía no anotaste gastos.</Text>;
const fila = ({ item }: { item: Gasto }) => (
  <View style={styles.fila}>
    <View style={styles.detalle}>
      <Text style={styles.texto}>{item.descripcion}</Text>
      <Text style={styles.suave}>{formatoFecha.format(item.fecha)}</Text>
    </View>
    <Text style={styles.monto}>{formatearMonto(item.centimos)}</Text>
  </View>
);

function Gastos() {
  const [gastos, setGastos] = useState(cargaInicial);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  if (gastos === null) {
    return (
      <Text role="alert" style={styles.error}>
        No pudimos leer tus gastos guardados. No borramos nada: cierra la app y vuelve a abrirla. Si sigue igual, escríbenos.
      </Text>
    );
  }

  const guardar = () => {
    const centimos = leerMonto(monto);
    if (centimos === null) return setError('Escribe un monto válido, por ejemplo 8.50');
    const texto = descripcion.trim();
    if (!texto) return setError('Escribe en qué gastaste');
    const nuevos = [{ centimos, descripcion: texto, fecha: Date.now() }, ...gastos];
    try {
      guardarGastos(nuevos);
    } catch (e) {
      console.error(e);
      return setError('No se pudo guardar el gasto. Inténtalo otra vez.');
    }
    setGastos(nuevos);
    setMonto('');
    setDescripcion('');
    setError('');
    Keyboard.dismiss();
  };

  return (
    <>
      <Text style={styles.etiqueta}>Monto en soles</Text>
      <TextInput
        accessibilityLabel="Monto en soles"
        style={styles.campo}
        value={monto}
        onChangeText={(t) => {
          setMonto(t);
          setError('');
        }}
        keyboardType="decimal-pad"
        maxLength={9}
      />
      <Text style={styles.etiqueta}>¿En qué gastaste?</Text>
      <TextInput
        accessibilityLabel="¿En qué gastaste?"
        style={styles.campo}
        value={descripcion}
        onChangeText={(t) => {
          setDescripcion(t);
          setError('');
        }}
        onSubmitEditing={guardar}
        maxLength={80}
      />
      {error ? (
        <Text role="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Pressable role="button" onPress={guardar} style={styles.boton}>
        <Text style={styles.textoBoton}>Guardar</Text>
      </Pressable>
      <FlatList
        style={styles.lista}
        data={gastos}
        keyExtractor={clave}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={listaVacia}
        renderItem={fila}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla}>
        <Text role="heading" style={styles.titulo}>LukIA</Text>
        <Gastos />
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  titulo: { fontSize: 32, fontWeight: '700', color: '#0B6B4F', marginVertical: 16 },
  etiqueta: { fontSize: 16, color: '#1F2937', marginBottom: 4 },
  campo: {
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#111827',
    marginBottom: 12,
  },
  error: { fontSize: 16, color: '#B91C1C', marginBottom: 12 },
  boton: { backgroundColor: '#0B6B4F', borderRadius: 8, padding: 14, alignItems: 'center' },
  textoBoton: { fontSize: 18, fontWeight: '600', color: '#fff' },
  lista: { flex: 1, marginTop: 20 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detalle: { flex: 1 },
  texto: { fontSize: 18, color: '#111827' },
  suave: { fontSize: 14, color: '#4B5563' },
  monto: { fontSize: 18, fontWeight: '600', color: '#111827' },
});
