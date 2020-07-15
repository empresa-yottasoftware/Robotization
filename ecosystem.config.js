module.exports = {
  apps : [{
    name: 'robotization',
    script: './routes/index.js',
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
