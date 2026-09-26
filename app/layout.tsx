import type { Metadata } from 'next';
import { yearsOfExperience } from '@/lib/data';
import './globals.css';

export const metadata: Metadata = {
  title: 'Subhamay Dhara — Software Engineer',
  description: `Software Engineer with ${yearsOfExperience}+ years building enterprise Salesforce solutions, full-stack apps, and integration systems at a global engineering company. Salesforce LWC, Apex, Node.js, REST APIs.`,
  keywords: ['Subhamay Dhara', 'Software Engineer', 'Salesforce Developer', 'LWC', 'Apex', 'Full Stack Developer', 'Maharashtra, India'],
  authors: [{ name: 'Subhamay Dhara' }],
  creator: 'Subhamay Dhara',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subhamaydhara.dev',
    title: 'Subhamay Dhara — Software Engineer',
    description: 'Software Engineer specializing in Salesforce, full-stack engineering, and enterprise integrations.',
    siteName: 'Subhamay Dhara',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subhamay Dhara — Software Engineer',
    description: 'Software Engineer specializing in Salesforce, full-stack engineering, and enterprise integrations.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
