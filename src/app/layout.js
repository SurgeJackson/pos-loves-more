import {AppProvider} from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Inter } from 'next/font/google'
import './globals.css'
import {Toaster} from "react-hot-toast";
import SWRProvider from '@/components/SWRProvider';
import {PreloadResources} from '@/app/preload-resources';

const roboto = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'POS LOVES MORE',
  description: 'Терминал обработки заказов POS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* <PreloadResources /> */}
      <body className={""}>
        <main className="max-w-4xl mx-auto p-2 flex flex-col">
          <AppProvider>
            <SWRProvider>
              <Toaster />
              <Header />
              {children}
            </SWRProvider>
          </AppProvider>
        </main>
      </body>
    </html>
  )
}
