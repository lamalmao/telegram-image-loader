import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';

const downloadImage: (url: URL, filePath: string) => Promise<void> = async (
  url,
  filePath
) => {
  const res = await fetch(url);
  const buf = await res.body;
  if (!buf) {
    throw new Error('Nothing found');
  }

  await writeFile(filePath, buf);
};

export default downloadImage;
