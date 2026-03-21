import React from 'react';
import Image from 'next/image';

export default React.memo(function Hero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">BeautyFlow — software para clínicas estéticas</h1>
        <p className="mt-4 text-lg text-slate-600">Gerencie agendamentos, clientes e colaboradores com uma solução simples, segura e pensada para clínicas de estética.</p>

        <div className="mt-6 flex items-center gap-4">
          <a href="#pricing" className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold shadow-soft">Experimentar grátis</a>
          <a href="#features" className="text-sm text-slate-700">Ver recursos</a>
        </div>

        <div className="mt-6 text-sm text-slate-500">Usado por clínicas que querem reduzir no-shows e simplificar operações.</div>
      </div>

      <div className="flex justify-center md:justify-end">
        <div className="w-full max-w-xl rounded-xl overflow-hidden shadow-soft">
          <Image src="/images/landing/placeholder.svg" alt="Dashboard preview" width={1000} height={600} priority={false} />
        </div>
      </div>
    </div>
  );
});
