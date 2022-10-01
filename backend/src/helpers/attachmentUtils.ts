import * as SDK_AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import Axios from 'axios'
import { BEGIN_CERT, END_CERT } from '../types/types'


// // TODO: Implement the fileStogare logic

const AWS = AWSXRay.captureAWS(SDK_AWS);

/**
 * Helper Utilities
 */
export class TodoUtils {
    /**
     * 
     * @param s3 AWS S3
     * @param bucketName S3 bucket name
     * @param urlExpiration Url expiration time
     */
    constructor(
        private readonly s3: AWS.S3 = new AWS.S3({signatureVersion: 'v4'}),
        readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration: string = process.env.SIGNED_URL_EXPIRATION
    ){}
    
    /**
     * Get presigned url from S3
     * @param todoId todoId string generated using uuid v4
     * @returns String url
     */
    generateSignedUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject',
        {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
    }

    /**
     * Get public certificate using axios
     * @param url Public certificate endpoint 
     * @returns Public certificate
     */
   async getPublicCert(url: string): Promise<string> {
    const crt: string = await
        Axios.get(url)
        .then((res)=>{
        const cert: string =  res.data as string
        console.log('Certificate generated')
        return cert
        })
        .catch((err) => {
        console.log('Certificate generation failed', err)
        return ''
        })
    
    /**
     * Verify that the certificate is correctly formatted
     */
    if (crt.startsWith(BEGIN_CERT) && crt.endsWith(END_CERT))
        return crt
    
    throw new Error('Certificate failed validation')
   }
}