import { notFound, redirect } from "next/navigation";
import { BookingForm } from "../BookingForm";
import { getClinicDataAction } from "../actions";

interface BookingPageProps {
  params: Promise<{
    clinicSlug: string;
  }>;
}

export async function generateMetadata({ params }: BookingPageProps) {
  const { clinicSlug } = await params;

  return {
    title: `Agendar Consulta | BeautyFlow`,
    description: `Agende sua consulta de forma rápida e fácil no BeautyFlow`,
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { clinicSlug } = await params;

  // Fetch clinic data
  const result = await getClinicDataAction(clinicSlug);

  if (!result.success || !result.data) {
    notFound();
  }

  const { clinic, services, employees } = result.data;

  // Validate that clinic has services
  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Clínica não disponível
          </h1>
          <p className="text-neutral-600">
            Desculpe, esta clínica não possui serviços disponíveis no momento.
          </p>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (appointmentId: string) => {
    redirect(`/booking/${clinicSlug}/confirmation/${appointmentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <BookingForm
          clinic={clinic}
          services={services}
          employees={employees}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    </div>
  );
}
