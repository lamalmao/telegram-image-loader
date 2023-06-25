import path from 'path';
import bot from './bot/bot.js';
import createIfNotExists from './bot/tools/create-inx.js';

(async () => {
  createIfNotExists(path.resolve('./data'));

  bot.launch();
  console.log('Bot started');
})();
