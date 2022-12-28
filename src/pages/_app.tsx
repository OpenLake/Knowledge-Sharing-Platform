import { Footer } from '../components/Common/Footer'
import { Navbar } from '../components/Common/Navbar'
import NextNProgress from 'nextjs-progressbar'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/auth'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Toaster />
        <NextNProgress options={{ showSpinner: false }} />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </>
  )
}
