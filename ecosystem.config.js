module.exports = {
  apps: [
    {
      name: "siteshots",
      script: "./app.js",
      node_args: ["--inspect"],
      instances: "1",
      // autorestart: true,
      cron_restart: '0 * * * *',
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
