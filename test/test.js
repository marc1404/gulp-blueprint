var child_process = require('child_process');

child_process.execSync('gulp', { cwd: './test/non-elixir' });
child_process.execSync('gulp', { cwd: './test/elixir' });