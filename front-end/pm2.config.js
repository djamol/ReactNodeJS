module.exports = {
  apps: [
    {
      name: 'my-react-app',
      script: 'npm',
      args: 'start',
      cwd: '/root/reactapp/front-end',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000, 
      },
    },
  ],
};

