import axios from 'axios'

let urls = {
    test: `http://localhost:3000`,
    development: `http://localhost:3000`,
    production: `https://knowledge-sharing-platform.vercel.app`
}

export const api = axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})