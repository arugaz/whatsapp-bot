module.exports = {
  apps: [
    {
      name: "whatsappbot",
      script: "./dist/main.js",
      env: {
        NODE_ENV: "production",
      },
      // Restart after memory after hit 1GB
      max_memory_restart: "1000M",
      args: ["--color"],
    },
  ],
};
