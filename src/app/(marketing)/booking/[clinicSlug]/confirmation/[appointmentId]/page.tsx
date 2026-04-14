import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookingConfirmationAction } from "../../../actions";
import { Button, Card } from "@/components/ui";

interface ConfirmationPageProps {
  params: Promise<{
    clinicSlug: string;
    appointmentId: string;
  }>;
}

export async function generateMetadata({ params }: ConfirmationPageProps) {
  return {
    title: `Agendamento Confirmado | BeautyFlow`,
    description: `Seu agendamento foi confirmado com sucesso`,
  };
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { clinicSlug, appointmentId } = await params;

  // Fetch booking confirmation
  const result = await getBookingConfirmationAction(appointmentId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { appointment, service: rawService, employee: rawEmployee, client, clinic: rawClinic } = result.data;
  
  const service = rawService as any;
  const employee = rawEmployee as any;
  const clinic = rawClinic as any;
  
  // Type guards for related entities
  if (!service || typeof service !== 'object' || !('name' in service)) {
    notFound();
  }
  if (!employee || typeof employee !== 'object' || !('name' in employee)) {
    notFound();
  }
  if (!client || typeof client !== 'object') {
    notFound();
  }
  if (!clinic || typeof clinic !== 'object' || !('name' in clinic)) {
    notFound();
  }

  const appointmentDate = new Date(appointment.start_time);
  const appointmentTime = appointmentDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const appointmentDateFormatted = appointmentDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-accent-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success text-white mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Agendamento Confirmado!
          </h1>
          <p className="text-neutral-700">
            Obrigado por escolher nossa clínica. Seu agendamento foi confirmado.
          </p>
        </div>

        {/* Confirmation Details */}
        <Card padding="lg" elevation="sm" className="mb-6 space-y-6">
          {/* Appointment Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 border-b-2 border-primary pb-2">
              Detalhes do Agendamento
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Data</p>
                  <p className="text-lg font-semibold text-neutral-900 capitalize">
                    {appointmentDateFormatted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Horário</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {appointmentTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Duração</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {(service as any)?.duration_minutes ?? '-'} minutos
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Serviço</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {(service as any)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Profissional</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {(employee as any)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Valor</p>
                  <p className="text-lg font-bold text-primary">
                    R$ {((service as any)?.price ?? 0).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-bold text-neutral-900">
              Seus Dados
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600 font-medium">Nome</p>
                <p className="text-neutral-900">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 font-medium">Email</p>
                <p className="text-neutral-900">{client.email}</p>
              </div>
              {client.phone && (
                <div>
                  <p className="text-sm text-neutral-600 font-medium">Telefone</p>
                  <p className="text-neutral-900">{client.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Clinic Info */}
          <div className="space-y-4 border-t pt-6 bg-primary-light rounded-lg p-4">
            <h2 className="text-lg font-bold text-neutral-900">Clínica</h2>
            <p className="text-neutral-900 font-semibold">{(clinic as any)?.name}</p>
            {(clinic as any)?.address && (
              <p className="text-neutral-700 text-sm">{(clinic as any)?.address}</p>
            )}
            {(clinic as any)?.phone && (
              <p className="text-neutral-700 text-sm">
                Telefone: {(clinic as any)?.phone}
              </p>
            )}
          </div>

          {/* Important Note */}
          <div className="bg-warning-light border border-warning rounded-lg p-4">
            <p className="text-sm text-neutral-900">
              ⚠️ <strong>Aviso importante:</strong> Uma confirmação de agendamento
              foi enviada para <strong>{client.email}</strong>. Chegue 10 minutos
              antes do horário agendado.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Link href="/booking" className="flex-1">
            <Button variant="outline" fullWidth>
              Fazer Outro Agendamento
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button fullWidth>
              Ir para Home
            </Button>
          </Link>
        </div>

        {/* Appointment ID */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">
            Número de Confirmação:{" "}
            <span className="font-mono font-semibold text-neutral-900">
              {appointmentId}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
