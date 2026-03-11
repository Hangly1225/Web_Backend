const { spawnSync } = require('node:child_process');

const run = (cmd, args, required = true) => {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (res.status !== 0 && required) {
    process.exit(res.status ?? 1);
  }
  return res.status ?? 1;
};

// Try prisma generate first, but do not hard fail in restricted environments.
run('npx', ['prisma', 'generate'], false);
run('npx', ['nest', 'build'], true);