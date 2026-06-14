import Link from 'next/link';

import { Header } from '@/components/layout/Header';

import { Footer } from '@/components/layout/Footer';

import { CompareBar } from '@/components/layout/CompareBar';



export default function PublicLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <>

      <Header />

      <main className="flex-1">{children}</main>

      <Footer />

      <CompareBar />

    </>

  );

}



export { Link };

