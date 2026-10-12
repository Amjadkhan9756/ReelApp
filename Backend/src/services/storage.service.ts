import fs from 'node:fs';
import path from 'node:path';

interface ImageKitUploadResult {
  url: string;
}

async function uploadFile(file: Buffer, fileName: string): Promise<ImageKitUploadResult> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (privateKey && endpoint) {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(file)]), fileName);
    form.append('fileName', fileName);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`ImageKit upload failed with status ${response.status}`);
    }

    const result: unknown = await response.json();
    if (
      typeof result !== 'object'
      || result === null
      || !('url' in result)
      || typeof result.url !== 'string'
    ) {
      throw new Error('ImageKit upload response did not include a file URL');
    }
    return { url: result.url };
  }

  if (process.env.VERCEL) throw new Error('ImageKit storage is required on Vercel');

  const directory = path.resolve(process.cwd(), 'videos');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, fileName), file);

  return {
    url: `${process.env.API_URL || 'http://localhost:8080'}/videos/${fileName}`,
  };
}

export default { uploadFile };
