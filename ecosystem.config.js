const env = process.env.NODE_ENV || 'development'
const script = env === 'production' ? './dist/main.prod.js' : './dist/main.dev.js'

module.exports = {
  apps: [
    {
      name: 'sketch',
      script,
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      restart_delay: 3000,
      node_args: '--nouse-idle-notification --max-old-space-size=8192',
    },
  ],
}
