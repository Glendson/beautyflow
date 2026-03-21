import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';

export const revalidate = 60 * 60 * 24; // static-like with periodic revalidate

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans text-slate-900">
      <Header />
      <section className="container mx-auto px-6 py-16">
        <Hero />
      </section>
      <Footer />
    </main>
  );
}
