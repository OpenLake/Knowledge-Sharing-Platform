import AWS from 'aws-sdk'
import { AWS_CONFIG } from '../config'

process.env.AWS_SDK_LOAD_CONFIG = '1'
process.env.AWS_CONFIG_FILE = '/Knowledge-Sharing-Platform/src/config/index.ts'

AWS.config.update({
    accessKeyId: 'AKIA3FLD3K3RPXVRMDOK',
    secretAccessKey: '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',
    region: 'eu-north-1',
})

export const s3 = new AWS.S3()
