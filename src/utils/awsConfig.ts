import AWS from 'aws-sdk'
import { AWS_CONFIG } from '../config'

process.env.AWS_SDK_LOAD_CONFIG = '1'
process.env.AWS_CONFIG_FILE = '/Knowledge-Sharing-Platform/src/config/index.ts'

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '8',
    region: '',
})

export const s3 = new AWS.S3()
