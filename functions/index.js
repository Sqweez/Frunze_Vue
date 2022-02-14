const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();

const {tmpdir} = require('os');
const  { join, dirname } = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');


exports.generateThumbs = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = gcs.bucket(object.bucket);
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

        const workingDir = join(tmpdir(), 'thumbs');
        const tmpFilePath = join(workingDir, 'source.png');

        if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
            console.log('exiting function');
            return false;
        }

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download Source File
        await bucket.file(filePath).download({
            destination: tmpFilePath
        });

        // 3. Resize the images and define an array of upload promises

        const thumbName = `thumb@600_${fileName}`;
        const thumbPath = join(workingDir, thumbName);

        await sharp(tmpFilePath).resize({width: 600}).toFile(thumbPath);

        await bucket.upload(thumbPath, {
            destination: join(bucketDir, thumbName),
            contentType: 'image/jpeg'
        })

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir);
    });