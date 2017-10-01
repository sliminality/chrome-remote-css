// @flow
import fs from 'fs';

function base64Encode(path: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(path, (err, data) => {
      if (err) {
        throw new Error(err);
      }
      resolve(data.toString('base64'));
    });
  });
}

export { base64Encode };
