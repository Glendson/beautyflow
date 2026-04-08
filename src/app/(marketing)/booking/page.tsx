import Link from "next/link";
import { getClinicsAction } from "./clinic-actions";
import { Card, Button } from "@/components/ui";

export async function generateMetadata() {
  return {
    title: `Agendar Consulta | BeautyFlow`,
    description: `Encontre e agende consultas em clínicas de estética`,
  };
}

export default async function BookingHomePage() {
  const result = await getClinicsAction();
  const clinics = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary via-primary-dark to-primary-darker text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agende suas Consultas
          </h1>
          <p className="text-xl text-primary-light max-w-2xl mx-auto">
            Escolha uma clínica e reserve seu horário de forma rápida e segura
          </p>
        </div>
      </div>

      {/* Clinics List */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {clinics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">
              Nenhuma clínica disponível no momento
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              Clínicas Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <Link
                  key={clinic.id}
                  href={`/booking/${clinic.slug}`}
                  className="group"
                >
                  <Card
                    elevation="sm"
                    className="h-full hover:elevation-md transition-all hover:shadow-lg cursor-pointer"
                  >
                    <div className="p-6">
                      {/* Clinic Icon/Avatar */}
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                        {clinic.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Clinic Name */}
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition">
                        {clinic.name}
                      </h3>

                      {/* Clinic Info */}
                      <div className="space-y-2 text-sm text-neutral-700 mb-4">
                        {clinic.address && (
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-1">📍</span>
                            <span>{clinic.address}</span>
                          </div>
                        )}

                        {clinic.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-primary">📞</span>
                            <span>{clinic.phone}</span>
                          </div>
                        )}

                        {clinic.email && (
                          <div className="flex items-start gap-2">
                            <span className="text-primary">✉️</span>
                            <span>{clinic.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {clinic.description && (
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {clinic.description}
                        </p>
                      )}

                      {/* CTA Button */}
                      <Button
                        fullWidth
                        className="mt-auto group-hover:bg-primary-dark transition"
                      >
                        Agendar Agora →
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white py-16 px-4 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Escolha a Clínica",
                description:
                  "Selecione a clínica mais conveniente para você",
              },
              {
                number: "2",
                title: "Escolha o Serviço",
                description: "Selecione o serviço desejado e o profissional",
              },
              {
                number: "3",
                title: "Agende o Horário",
                description:
                  "Escolha o melhor horário e confirme seu agendamento",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
