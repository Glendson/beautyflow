"use client";
import Link from 'next/link';
import React from 'react';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
    {children}
  </Link>
);

export default React.memo(function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="24" height="24" rx="6" fill="#2563EB" />
              <path d="M7 12h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-semibold">BeautyFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-700 hover:text-slate-900">Login</Link>
          <Link href="/signup" className="ml-2 inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium shadow-soft hover:bg-blue-600">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
});
