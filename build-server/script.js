const { exec } = require('child_process');
const { readdirSync, createReadStream, lstatSync } = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

const client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAQLVQQRQQFSCFPIUZ',
        secretAccessKey: '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'
    }
});

const PROJECT_ID = process.env.PROJECT_ID;

const initialization = async () => {
    
    console.log("Build creation is initiated");
    
    const workspace = path.join(__dirname, 'workspace');
    const process = exec(`cd ${workspace} && npm ci && npm run build`);
    
    process.stdout.on('data', (data) => {
        console.log(data);
    });
    
    process.stderr.on('data', (data) => {
        console.log(data);
    })
    
    process.on('close', async () => {
        
        console.log("Build completed successfully");
        const distFoldPath = path.join(workspace, 'dist');
        const distFoldFiles = readdirSync(distFoldPath, { recursive: true });
        
        for (const file of distFoldFiles) {
            const filePath = path.join(distFoldPath, file);
            if (lstatSync(filePath).isDirectory()) {
                continue;
            } else {
                console.log("Uploading File:", file);
                const command = new PutObjectCommand({
                    Bucket: 'deployment-service-bucket',
                    Key: `public/${PROJECT_ID}/${file}`,
                    Body: createReadStream(filePath),
                    ContentType: mime.lookup(filePath)
                });
                await client.send(command);
                console.log("Upload complete:", file);
            }
        }
    })
}

initialization();