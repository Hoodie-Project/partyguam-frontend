module.exports = {
  apps : [{
    name: 'front',
    cwd: '/Users/macmini/partyguam/partyguam-frontend',
    args: 'start',
    script: './node_modules/next/dist/bin/next',
    watch: ['./node_modules/next/dist/bin/next']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'pnpm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
