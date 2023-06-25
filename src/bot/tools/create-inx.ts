import fs from 'fs';

const createIfNotExists = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

export default createIfNotExists;
