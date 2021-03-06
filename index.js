var pm2 = require('pm2');

pm2.connect(function() {
  pm2.start({
    script    : './bin/www',         // Script to be run
    exec_mode : 'cluster',        // Allow your app to be clustered
    instances : 8,                // Optional: Scale your app by 4
    max_memory_restart : '4000M'   // Optional: Restart your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();
  });
});