import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import AppBackground from "./component/AppBackground";
import StyledComponentsRegistry from './lib/registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuizMaster",
  description: "This app is used to create and take quizzes online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
        <AppBackground />
        <Navbar />
        {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
