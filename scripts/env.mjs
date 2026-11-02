// Muat .env.local lalu .env (variabel yang sudah ada tidak ditimpa).
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file)
  } catch {}
}
