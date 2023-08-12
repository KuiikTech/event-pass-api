module.exports = {
  apps: [
    {
      name: 'event-pass-api',
      script: 'main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV:'#{NODE_ENV}#',
        npm_package_version: '#{npm_package_version}#',
        HOST:'#{HOST}#',
        PORT:'#{PORT}#',
        API_NAME:'#{API_NAME}#',
        API_DESCRIPTION:'#{API_DESCRIPTION}#',
        API_PREFIX:'#{API_PREFIX}#',
        JWT_SECRET_KEY:'#{JWT_SECRET_KEY}#',
        JWT_EXPIRATION_TIME:'#{JWT_EXPIRATION_TIME}#',
        MONGO_URI:'#{MONGO_URI}#'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      pid_file: 'logs/app.pid'
    }
  ]
};
