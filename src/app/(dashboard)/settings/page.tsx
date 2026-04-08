"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { Save, Bell, Lock, CreditCard, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { updateClinicAction, getClinicAction } from "@/app/(auth)/actions";
import { Clinic } from "@/domain/clinic/Clinic";

export default function SettingsPage() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [working_hours_start, setWorkingHoursStart] = useState("08:00");
  const [working_hours_end, setWorkingHoursEnd] = useState("18:00");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [currentPlan] = useState("pro");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load clinic data on mount
  useEffect(() => {
    const loadClinic = async () => {
      try {
        const result = await getClinicAction();
        if (result.success && result.data) {
          setClinic(result.data);
          setClinicName(result.data.name);
          setEmail(result.data.email);
          setPhone(result.data.phone);
          setAddress(result.data.address);
          setWorkingHoursStart(result.data.working_hours_start);
          setWorkingHoursEnd(result.data.working_hours_end);
          console.log("✅ [SETTINGS] Clinic data loaded:", result.data.name);
        } else {
          console.error("❌ [SETTINGS] Failed to load clinic:", result.error);
          setMessage({
            type: "error",
            text: "Não foi possível carregar as configurações da clínica",
          });
        }
      } catch (error) {
        console.error("❌ [SETTINGS] Error loading clinic:", error);
        setMessage({
          type: "error",
          text: "Erro ao carregar configurações",
        });
      } finally {
        setIsFetching(false);
      }
    };

    loadClinic();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const updateData: Partial<Clinic> = {
        name: clinicName,
        email,
        phone,
        address,
        working_hours_start,
        working_hours_end,
      };

      console.log("💾 [SETTINGS] Saving clinic changes:", updateData);
      const result = await updateClinicAction(updateData);

      if (result.success) {
        setClinic(result.data!);
        setMessage({
          type: "success",
          text: "Configurações salvas com sucesso!",
        });
        console.log("✅ [SETTINGS] Changes saved successfully");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Erro ao salvar as configurações",
        });
        console.error("❌ [SETTINGS] Save failed:", result.error);
      }
    } catch (error) {
      console.error("❌ [SETTINGS] Error saving:", error);
      setMessage({
        type: "error",
        text: "Erro inesperado ao salvar configurações",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (clinic) {
      setClinicName(clinic.name);
      setEmail(clinic.email);
      setPhone(clinic.phone);
      setAddress(clinic.address);
      setWorkingHoursStart(clinic.working_hours_start);
      setWorkingHoursEnd(clinic.working_hours_end);
      setMessage(null);
      console.log("↩️ [SETTINGS] Changes discarded");
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Configurações</h1>
          <p className="text-neutral-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-1">Configurações</h1>
        <p className="text-neutral-700">Gerencie as informações da sua clínica</p>
      </div>

      {/* Notification Messages */}
      {message && (
        <div
          className={`flex gap-3 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-success-light border border-success text-success-dark"
              : "bg-danger-light border border-danger text-danger-dark"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Clinic Information */}
      <Card padding="lg" elevation="sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Informações da Clínica</h2>
        
        <div className="space-y-4">
          <Input
            label="Nome da Clínica"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            disabled={isLoading}
          />
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          
          <Input
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />
          
          <Input
            label="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </Card>

      {/* Working Hours */}
      <Card padding="lg" elevation="sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Horário de Funcionamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Horário de Abertura"
            type="time"
            value={working_hours_start}
            onChange={(e) => setWorkingHoursStart(e.target.value)}
            disabled={isLoading}
          />
          
          <Input
            label="Horário de Fechamento"
            type="time"
            value={working_hours_end}
            onChange={(e) => setWorkingHoursEnd(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="lg" elevation="sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificações
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-neutral-700">
              Notificações de agendamento
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-neutral-700">
              Alertas por email
            </span>
          </label>
        </div>
      </Card>

      {/* Current Plan */}
      <Card padding="lg" elevation="sm" className="bg-linear-to-r from-primary-light to-accent-light border border-accent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Plano Atual
          </h2>
          <Badge variant="success">Ativo</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-bold text-accent capitalize">{currentPlan}</p>
            <p className="text-sm text-neutral-700 mt-1">Acesso a todos os recursos premium</p>
          </div>
          
          <div className="flex items-end justify-end gap-3">
            <Button variant="outline">Mudar Plano</Button>
            <Button variant="secondary" size="sm">Gerenciar Pagamento</Button>
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <Card padding="lg" elevation="sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Segurança
        </h2>
        
        <div className="space-y-3">
          <Button variant="outline" fullWidth className="justify-start" disabled={isLoading}>
            Alterar Senha
          </Button>
          <Button variant="outline" fullWidth className="justify-start" disabled={isLoading}>
            Ativar Autenticação de Dois Fatores
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg" elevation="sm" className="border-danger bg-danger-light">
        <h2 className="text-lg font-bold text-danger mb-4">Zona de Risco</h2>
        
        <div className="space-y-3">
          <Button variant="danger" fullWidth size="lg" leftIcon={<LogOut className="w-5 h-5" />} disabled={isLoading}>
            Desativar Clínica
          </Button>
          <p className="text-xs text-neutral-700 mt-2">
            Isto desativará sua clínica e todos os dados serão mantidos em segurança por 30 dias.
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          size="lg" 
          leftIcon={<Save className="w-5 h-5" />}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button variant="outline" size="lg" onClick={handleDiscard} disabled={isLoading}>
          Descartar
        </Button>
      </div>
    </div>
  );
}

