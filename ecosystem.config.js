module.exports = {
  apps: [
    {
      name: "whatsappbot",
      script: "./dist/main.js",
      // Restart after memory hit 1GB
      max_memory_restart: "1G",
      // Env variables
      env: {
        NODE_ENV: "production"
      },
      args: ["--color"]
    }
  ]
}
