const ENV = process.env.APP_ENV || 'production';
const APPS = [
  {
    name: 'APP',
    script: './bin/www.ts'
  },
  {
    name: 'ADMIN',
    script: './admin/bin/www.ts'
  },
  {
    name: `convert`,
    script: './protected/workers/convert.ts',
    count: 8
  },
  {
    name: `update_comments`,
    script: './protected/workers/update_comments.ts',
    count: 4
  },
  {
    name: `create_comments`,
    script: './protected/workers/create_comments.ts'
  },
  {
    name: `create_reposts`,
    script: './protected/workers/create_reposts.ts'
  },
  {
    name: `update_cache`,
    script: './protected/workers/update_cache.ts'
  },
  {
    name: `cron`,
    script: './cron.ts'
  }
];
const apps = [];
for(const app of APPS) {
  const appInfo = {
    name: `${app.name}_${ENV}`,
    script: app.script,
    interpreter: './node_modules/.bin/ts-node',
    interpreter_args: '-r tsconfig-paths/register',
    error_file: `./protected/runtime/logs/${app.name}.error.log`,
    out_file: `./protected/runtime/logs/${app.name}.out.log`,
    merge_logs: true
  };
  if(!app.count) {
    app.count = 1;
  }
  for(let i = 0; i < app.count; i++) {
    const data = Object.assign({}, appInfo);
    if(i > 0) {
      data.name += `_${i}`;
    }
    apps.push(data);
  }
}
module.exports = {
  apps : apps,
  deploy: {
    development: {
      user: "root",
      host: "62.141.50.91",
      ref: "origin/dev",
      repo: "git@bitbucket.org:yantsishkodev/boomcover.git",
      path: "/var/www/axetmedi/data/www/dev.boomcover.com",
      "post-deploy": "yarn install && ts-node cli.ts schema_sync && APP_ENV=development pm2 startOrRestart ecosystem.config.js"
    }
  }
};
