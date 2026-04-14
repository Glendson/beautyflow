"use client";

import { useState } from "react";
import { Service } from "@/domain/service/Service";
import { Employee } from "@/domain/employee/Employee";
import { Clinic } from "@/domain/clinic/Clinic";
import { FormInput, FormSelect } from "@/components/forms";
import { Button, Card } from "@/components/ui";
import {
  getAvailableSlotsAction,
  createBookingAction,
  getBookingConfirmationAction,
} from "@/app/(marketing)/booking/actions";

type Step = "service" | "professional" | "date" | "client" | "confirm";

interface BookingState {
  serviceId?: string;
  employeeId?: string;
  date?: string;
  time?: string | null;
  name?: string;
  email?: string;
  phone?: string;
}

interface BookingFormProps {
  clinic: Clinic;
  services: Service[];
  employees: Employee[];
  onBookingComplete: (appointmentId: string) => void;
}

export function BookingForm({
  clinic,
  services,
  employees,
  onBookingComplete,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [state, setState] = useState<BookingState>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get service details
  const selectedService = state.serviceId
    ? services.find((s) => s.id === state.serviceId)
    : null;

  // Get employee details
  const selectedEmployee = state.employeeId
    ? employees.find((e) => e.id === state.employeeId)
    : null;

  // Filter employees by selected service
  const availableEmployees = state.serviceId
    ? employees.filter((e) => {
        // Check if employee can perform this service
        // This assumes employee_services table exists
        return true; // Simplified for now
      })
    : employees;

  // Handle date change
  const handleDateChange = async (date: string) => {
    setState((prev) => ({ ...prev, date, time: undefined }));

    if (state.serviceId && state.employeeId) {
      setIsLoading(true);
      try {
        const result = await getAvailableSlotsAction(
          clinic.id,
          state.employeeId,
          state.serviceId,
          date
        );

        if (result.success) {
          setAvailableSlots(result.data || []);
        } else {
          setError(result.error || 'Failed to load slots');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle step navigation
  const handlePrevious = () => {
    const steps: Step[] = ["service", "professional", "date", "client", "confirm"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleNext = async () => {
    try {
      setError(null);

      if (currentStep === "service") {
        if (!state.serviceId) {
          setError("Please select a service");
          return;
        }
        setCurrentStep("professional");
      } else if (currentStep === "professional") {
        if (!state.employeeId) {
          setError("Please select a professional");
          return;
        }
        setCurrentStep("date");
      } else if (currentStep === "date") {
        if (!state.date || !state.time) {
          setError("Please select a date and time");
          return;
        }
        setCurrentStep("client");
      } else if (currentStep === "client") {
        if (!state.name || !state.email) {
          setError("Please fill in your information");
          return;
        }
        setCurrentStep("confirm");
      } else if (currentStep === "confirm") {
        await handleSubmit();
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // Submit booking
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await createBookingAction({
        clinicId: clinic.id,
        serviceId: state.serviceId!,
        employeeId: state.employeeId!,
        clientName: state.name!,
        clientEmail: state.email!,
        clientPhone: state.phone,
        date: state.date!,
        time: state.time!,
      });

      if (result.success) {
        onBookingComplete(result.data!.appointmentId);
      } else {
        setError(result.error ?? "Um erro ocorreu ao criar o agendamento");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Agendar Consulta
        </h1>
        <p className="text-neutral-700">
          Clínica: <span className="font-semibold">{clinic.name}</span>
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {["Serviço", "Profissional", "Data & Hora", "Seus Dados", "Confirmar"].map(
            (label, idx) => {
              const steps: Step[] = ["service", "professional", "date", "client", "confirm"];
              const step = steps[idx];
              const isActive = step === currentStep;
              const isDone = steps.indexOf(currentStep) > idx;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 ${
                      isActive || isDone
                        ? "bg-primary text-white"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-xs font-medium text-neutral-700 text-center">
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}
      <Card padding="lg" elevation="sm" className="mb-6">
        {/* Step 1: Service Selection */}
        {currentStep === "service" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Selecione um Serviço</h2>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      serviceId: service.id,
                      employeeId: undefined,
                      date: undefined,
                      time: undefined,
                    }))
                  }
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    state.serviceId === service.id
                      ? "border-primary bg-primary-light"
                      : "border-neutral-200 hover:border-primary-light"
                  }`}
                >
                  <div className="font-semibold text-neutral-900">
                    {service.name}
                  </div>
                  <div className="text-sm text-neutral-700 mt-1">
                    {service.duration_minutes || service.duration || "N/A"} minutos • R${" "}
                    {service.price || service.price === 0 ? service.price.toFixed(2).replace(".", ",") : "N/A"}
                  </div>
                  {(service.description) && (
                    <p className="text-sm text-neutral-600 mt-2">
                      {service.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Professional Selection */}
        {currentStep === "professional" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">
              Escolha o Profissional
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {availableEmployees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => setState((prev) => ({ ...prev, employeeId: employee.id }))}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    state.employeeId === employee.id
                      ? "border-primary bg-primary-light"
                      : "border-neutral-200 hover:border-primary-light"
                  }`}
                >
                  <div className="font-semibold text-neutral-900">
                    {employee.name}
                  </div>
                  {employee.specialty && (
                    <div className="text-sm text-neutral-700 mt-1">
                      Especialidade: {employee.specialty}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date and Time Selection */}
        {currentStep === "date" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Data e Hora</h2>
            <FormInput
              name="date"
              label="Data"
              type="date"
              value={state.date || ""}
              onChange={handleDateChange}
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
            />

            {state.date && (
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Horário Disponível
                </label>
                {availableSlots.length === 0 ? (
                  <p className="text-neutral-600 text-center py-4">
                    {isLoading
                      ? "Carregando horários disponíveis..."
                      : "Nenhum horário disponível para esta data"}
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setState((prev) => ({ ...prev, time: slot || undefined }))}
                        className={`p-2 border rounded text-sm font-medium transition ${
                          state.time === slot
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-200 text-neutral-900 hover:border-primary"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Client Information */}
        {currentStep === "client" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Seus Dados</h2>
            <FormInput
              name="name"
              label="Nome Completo"
              value={state.name || ""}
              onChange={(value) => setState((prev) => ({ ...prev, name: value }))}
              required
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              value={state.email || ""}
              onChange={(value) => setState((prev) => ({ ...prev, email: value }))}
              required
            />
            <FormInput
              name="phone"
              label="Telefone (opcional)"
              type="tel"
              value={state.phone || ""}
              onChange={(value) => setState((prev) => ({ ...prev, phone: value }))}
            />
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Confirme seu Agendamento</h2>

            <div className="space-y-3 bg-neutral-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-neutral-600">Serviço</p>
                <p className="font-semibold text-neutral-900">
                  {selectedService?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Profissional</p>
                <p className="font-semibold text-neutral-900">
                  {selectedEmployee?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Data e Hora</p>
                <p className="font-semibold text-neutral-900">
                  {new Date(state.date!).toLocaleDateString("pt-BR")} às{" "}
                  {state.time}
                </p>
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-neutral-600">Valor</p>
                <p className="font-bold text-lg text-primary">
                  R$ {selectedService?.price ? selectedService.price.toFixed(2).replace(".", ",") : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-primary-light border border-primary p-4 rounded-lg">
              <p className="text-sm text-neutral-900">
                Um email de confirmação será enviado para{' '}
                <strong>{state.email || 'seu email'}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-danger-light border border-danger text-danger p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === "service" || isLoading}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading
            ? "Processando..."
            : currentStep === "confirm"
            ? "Confirmar Agendamento"
            : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
