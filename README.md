# LukIA

Finanzas personales con IA para universitarios.

- `app/`: la app del celular (React Native + Expo + TypeScript)
- `server/`: el servidor (Rust + Axum)

## Probar en tu computadora

```bash
cd app && npm install && npm test && npx expo start
cd server && cargo test && cargo run   # luego abre http://localhost:8080/health
```

## Reglas del equipo

- `dev` es donde se junta el trabajo de todos. `main` es la versión estable que va a Play Store.
- Cada uno trabaja en su propia rama (por ejemplo `pantalla-gastos`) creada desde `dev`, y abre un pull request hacia `dev`.
- Cuando `dev` funciona bien, se abre un pull request de `dev` a `main`.
- Nadie sube directo a `dev` ni a `main`: un pull request entra solo si las pruebas automáticas (CI) pasan y otro compañero lo aprueba.
- Las claves (DeepSeek, base de datos) van en GitHub Secrets o en `.env`, nunca en el código.
