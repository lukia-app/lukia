use axum::{Router, routing::get};

async fn health() -> &'static str {
    "ok"
}

fn app() -> Router {
    Router::new().route("/health", get(health))
}

#[tokio::main]
async fn main() {
    // Cloud Run y Koyeb pasan el puerto en PORT
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .unwrap();
    axum::serve(listener, app()).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn health_responde_ok() {
        assert_eq!(health().await, "ok");
        let _ = app(); // la ruta se arma sin errores
    }
}
