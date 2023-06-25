import { Context } from 'telegraf';

const handleError = async (ctx: Context, error: string) => {
  ctx
    .reply(`Что-то пошло не так:\n\`${error}\``, {
      parse_mode: 'MarkdownV2'
    })
    .catch(() => null);
};

export default handleError;
