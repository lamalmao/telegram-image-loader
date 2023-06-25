import crypto from 'crypto';

const genFileName = (extension: string = 'jpg'): string => {
  return crypto.randomBytes(8).toString('hex').concat(`.${extension}`);
};

export default genFileName;
