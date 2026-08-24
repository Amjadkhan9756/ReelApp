const fs = require('fs');
const path = require('path');

async function uploadFile(file, fileName) {
    if (process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
        const form = new FormData();
        form.append('file', new Blob([file]), fileName);
        form.append('fileName', fileName);
        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`
            },
            body: form
        });
        if (!response.ok) throw new Error(`ImageKit upload failed with status ${response.status}`);
        const result = await response.json();
        return { url: result.url };
    }
    if (process.env.VERCEL) throw new Error('ImageKit storage is required on Vercel');
    const dir = path.join(__dirname, '../../videos');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, file);
    return { url: `${process.env.API_URL || 'http://localhost:8080'}/videos/${fileName}` };
}

module.exports = {
    uploadFile
};