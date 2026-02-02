import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import AppBackground from "./component/AppBackground";
import StyledComponentsRegistry from './lib/registry';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- ENHANCED SEO METADATA ---
export const metadata = {
  title: {
    default: "Quizक्रिडा | Professional AI Quiz Engine",
    template: "%s | Quizक्रिडा"
  },
  description: "Transform AI conversations into interactive, timed practice sessions. The ultimate monochrome quiz platform for active learning.",
  keywords: ["Quiz", "AI Quiz Generator", "Active Learning", "Exam Prep", "Zolvi Style", "Quizक्रिडा"],
  authors: [{ name: "Quizक्रिडा Team" }],
  creator: "Quizक्रिडा",
  themeColor: "#000000", // Ensures mobile browser bars are black
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "Quizक्रिडा - Online Quiz Platform",
    description: "Generate and master any topic with our AI-driven quiz engine.",
    url: "https://your-domain.com",
    siteName: "Quizक्रिडा",
    images: [
      {
        url: "/og-image.png", // Make sure to add this to your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizक्रिडा | AI Quiz Engine",
    description: "Stop reading. Start playing.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Basic Favicon logic can go here */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-white selection:text-black`}
      >
        <StyledComponentsRegistry>
          {/* AppBackground handles the monochrome noise/particles if you have them */}
          <AppBackground />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>

          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              style: {
                borderRadius: '0px',
                background: '#000',
                color: '#fff',
                border: '1px solid #222',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              },
            }}
          />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}