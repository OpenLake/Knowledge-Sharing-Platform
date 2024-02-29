import { Client, Storage } from "appwrite";

const client = new Client();

client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('65ca771866bb9870c919')
    // .setKey('your-appwrite-api-key');

export default client;
export const storage = new Storage(client)
