import React from 'react';
import Link from 'next/link';

export default React.memo(function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold">BeautyFlow</h3>
          <p className="mt-2 text-sm text-slate-600">Software de gestão para clínicas estéticas — agendamentos, clientes e equipe.</p>
        </div>

        <div>
          <h4 className="font-medium">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#pricing">Pricing</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium">Contact</h4>
          <p className="mt-3 text-sm text-slate-600">hello@beautyflow.example</p>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 py-4 text-sm text-slate-500">© {new Date().getFullYear()} BeautyFlow — Todos os direitos reservados</div>
      </div>
    </footer>
  );
});
