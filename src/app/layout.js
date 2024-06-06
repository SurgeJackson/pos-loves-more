import {AppProvider} from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Roboto } from 'next/font/google'
import './globals.css'
import {Toaster} from "react-hot-toast";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'POS LOVES MORE',
  description: 'Терминал обработки заказов POS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-2 flex flex-col">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
          </AppProvider>
        </main>
      </body>
    </html>
  )
}
