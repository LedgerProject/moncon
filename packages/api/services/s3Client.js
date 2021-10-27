import aws from "aws-sdk";

// Create an Amazon S3 service client object.
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
export { s3 };