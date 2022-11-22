module.exports = {
  apps: [
    {
      name: "whatsapp-bot",
      script: "./dist/main.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      // Restart after memory hit 1GB
      max_memory_restart: "1000M",
    },
  ],
};
