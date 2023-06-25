import { Context } from 'telegraf';
import handleError from './handle-error.js';
import fs from 'fs';
import path from 'path';

const userFolderMiddleware = async (ctx: Context, next: CallableFunction) => {
  try {
    if (ctx.from && ctx.from.id && !ctx.from.is_bot) {
      const folder = path.resolve('./data', ctx.from.id.toString());

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
    }
  } catch (error: any) {
    handleError(ctx, error.message);
  } finally {
    next();
  }
};

export default userFolderMiddleware;
