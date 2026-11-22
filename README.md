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

- Nadie sube directo a `main`: se trabaja en una rama y se abre un pull request.
- El pull request entra solo si las pruebas automáticas (CI) pasan y otro compañero lo aprueba.
- Las claves (DeepSeek, base de datos) van en GitHub Secrets o en `.env`, nunca en el código.
