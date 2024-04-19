module.exports = {
  apps : [{
    name: 'next',
    script: 'server.js', 
    watch: true, 
    env: {
      NEXT_PUBLIC_API_HOST:"https://partyguam.net:8000/api",
      NEXT_PUBLIC_ENV:"production",
      NEXT_PUBLIC_HTTPS:true,
      
      NEXT_PUBLIC_SSL_CA:"/etc/letsencrypt/live/partyguam.net/chain.pem",
      NEXT_PUBLIC_SSL_KEY:"/etc/letsencrypt/live/partyguam.net/privkey.pem",
      NEXT_PUBLIC_SSL_CERT:"/etc/letsencrypt/live/partyguam.net/cert.pem"
    }
  }]
};
