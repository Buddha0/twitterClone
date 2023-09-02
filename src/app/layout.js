"use client"
import './globals.css'
import { Inter } from 'next/font/google'

import {
  RecoilRoot
} from 'recoil';




const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><RecoilRoot>{children}</RecoilRoot></body>
    </html>
  )
}
