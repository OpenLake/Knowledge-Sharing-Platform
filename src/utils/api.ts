import axios from 'axios'

// let urls = {
//     test: `http://localhost:3000`,
//     development: `http://localhost:3000`,
//     production: `https://knowledge-sharing-platform.vercel.app`,
// }

export const api = axios.create({
    baseURL: `https://knowledge-sharing-platform.vercel.app`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})
