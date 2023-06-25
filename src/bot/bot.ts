import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import userFolderMiddleware from './tools/user-folder-middleware.js';
import handleError from './tools/handle-error.js';
import genFileName from './tools/gen-filename.js';
import path from 'path';
import downloadImage from './tools/download-image.js';
import AdmZip from 'adm-zip';
import fs from 'fs';

const { TELEGRAM_KEY: apiKey } = dotenv.config().parsed as {
  TELEGRAM_KEY: string;
};

const bot = new Telegraf(apiKey);

bot.use(userFolderMiddleware);

bot.command('load', async ctx => {
  try {
    const date = new Date();
    const userFolder = path.resolve('./data', ctx.from.id.toString());

    //prettier-ignore
    const zip = new AdmZip();
    const files = fs.readdirSync(userFolder);
    await ctx.sendChatAction('typing');

    for (const file of files) {
      zip.addLocalFile(path.join(userFolder, file));
    }

    await ctx.sendChatAction('upload_document');
    const zipBuffer = await zip.toBufferPromise();
    await ctx.replyWithDocument(
      {
        source: zipBuffer,
        //prettier-ignore
        filename: `${ctx.from.id}-${date.getDay()}_${date.getMonth()}|${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.zip`
      },
      {
        caption: 'Архив с изображениями'
      }
    );

    for (const file of files) {
      fs.unlinkSync(path.join(userFolder, file));
    }
  } catch (error: any) {
    console.log(error);
    handleError(ctx, error.message);
  }
});

bot.on(message('photo'), async ctx => {
  try {
    const url = await ctx.telegram.getFileLink(
      ctx.message.photo[ctx.message.photo.length - 1].file_id
    );

    const fileName = genFileName();
    const filePath = path.resolve('./data', ctx.from.id.toString(), fileName);
    await downloadImage(url, filePath);
    await ctx.reply('Изображение скачано', {
      reply_to_message_id: ctx.message.message_id
    });
  } catch (error: any) {
    handleError(ctx, error.message);
  }
});

bot.on(message('document'), async ctx => {
  try {
    if (!ctx.message.document.mime_type?.startsWith('image')) {
      await ctx.reply('Недопустимый файл');
      return;
    }

    const url = await ctx.telegram.getFileLink(ctx.message.document.file_id);
    const fileName = genFileName(ctx.message.document.mime_type.split('/')[1]);
    const filePath = path.resolve('./data', ctx.from.id.toString(), fileName);

    await downloadImage(url, filePath);
    await ctx.reply('Изображение скачано', {
      reply_to_message_id: ctx.message.message_id
    });
  } catch (error: any) {
    handleError(ctx, error.message);
  }
});

export default bot;
