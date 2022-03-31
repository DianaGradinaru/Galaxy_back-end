require("dotenv").config();
const fs = require("fs");

const {
    S3Client,
    PutObjectCommand,
    ListObjectsCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
    region: region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

async function uploadFile(file) {
    const uploadParams = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fs.createReadStream(file.path),
    };
    try {
        return await client.send(new PutObjectCommand(uploadParams));
    } catch (error) {
        console.error(error);
    }
}

async function getFile(fileKey) {
    try {
        const getResult = await client.send(
            new ListObjectsCommand({
                Prefix: fileKey,
                Bucket: bucketName,
            })
        );
        return `https://${bucketName}.s3.amazonaws.com/${getResult.Prefix}`;
    } catch (error) {
        console.log(error);
    }
}
module.exports = { uploadFile, getFile };

// aws sdk v2 below
// const s3 = new _S3({
//     region,
//     accessKeyId,
//     secretAccessKey,
// });

// uploads a file to S3 with aws sdk v2
// function uploadFile(file) {
//     if (file) {
//         const fileStream = fs.createReadStream(file.path);

//         const uploadParams = {
//             Bucket: bucketName,
//             Body: fileStream,
//             Key: file.filename,
//         };

//         return s3.upload(uploadParams).promise();
//     }
// }
// exports.uploadFile = uploadFile;

// downloads file from S3 with aws sdk v2
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;

// deletes file from S3 with aws sdk v2
function deleteObject(fileKey) {
    if (fileKey) {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        return s3.deleteObject(params).promise();
    }
}

exports.deleteObject = deleteObject;
