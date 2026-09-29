import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SmartHealthCard } from "@/components/features/SmartHealthCard";
import { ProfileSetup } from "@/components/features/ProfileSetup";
import { SetPinDialog } from "@/components/features/SetPinDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "@/lib/api";
import {
  FileText,
  Upload,
  Shield,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  HeartPulse,
  Scan,
} from "lucide-react";
import { ConsentRequestsList } from "@/components/features/ConsentRequestsList";
import { RiskAnalysisCard } from "@/components/features/RiskAnalysisCard";
import { PharmacyRefillAlerts } from "@/components/features/PharmacyRefillAlerts";
import { ScanDiagnosticModal } from "@/components/features/ScanDiagnosticModal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/** Shape expected by SmartHealthCard; matches patients row when profile is completed */
type PatientData = {
  uhid: string;
  full_name: string;
  blood_group: string;
  date_of_birth: string;
  phone: string;
  emergency_contact: string;
  emergency_name: string;
  profile_completed?: boolean;
  smart_pin?: string | null;
};

const formatE164Phone = (phone?: string | null, fallback = "+919022434807"): string => {
  if (!phone || !phone.trim()) return fallback;
  const raw = phone.trim();
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return "+" + digits;
  if (raw.startsWith("00")) return "+" + digits.slice(2);
  const cleanDigits = digits.startsWith("0") && digits.length === 11 ? digits.slice(1) : digits;
  if (cleanDigits.length === 10) return `+91${cleanDigits}`;
  if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) return `+${cleanDigits}`;
  return `+${cleanDigits}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showScanDiagnostic, setShowScanDiagnostic] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [stats, setStats] = useState({ records: 0, consents: 0 });

  useEffect(() => {
    if (user?.id) {
      fetchPatientProfile();
      fetchStats();
    }
  }, [user?.id]);

  const fetchPatientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user?.id)
        .limit(1)
        .maybeSingle(); // Switch to maybeSingle to handle 0 rows without 406

      if (error && error.code !== "PGRST116") throw error;
      setPatientData((data ?? null) as PatientData | null);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: patientRow } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      const patientId = patientRow?.id || user?.id;

      const [recordsRes, consentsRes] = await Promise.all([
        supabase
          .from("records")
          .select("id", { count: "exact" })
          .eq("patient_id", patientId),
        supabase
          .from("consent_requests")
          .select("id", { count: "exact" })
          .eq("patient_id", patientId)
          .eq("status", "pending"),
      ]);

      setStats({
        records: recordsRes.count || 0,
        consents: consentsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCallMe = async () => {
    if (!user) return;
    const defaultPhone = (patientData?.phone && !patientData.phone.includes("8806275531"))
      ? patientData.phone
      : "9022434807";

    const inputPhone = window.prompt("Enter your phone number to receive a call from our AI Pharmacist:", defaultPhone);
    if (!inputPhone || !inputPhone.trim()) return;

    const targetPhone = formatE164Phone(inputPhone.trim(), "+919022434807");
    setIsCalling(true);
    try {
      const rawPhone = patientData?.phone || "+91 9022434807";
      const digits = rawPhone.replace(/\D/g, "");
      const targetPhone = digits.length === 10 ? `+91${digits}` : (rawPhone.startsWith("+") ? rawPhone : `+${digits}`);
      const targetName = patientData?.full_name || "Patient";

      let response = await fetch(`${API_BASE_URL}/call-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: user.id,
          phone_number: targetPhone,
          patient_name: targetName,
        }),
      });

      if (response.status === 404) {
        response = await fetch(`${API_BASE_URL}/initiate-call`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: user.id,
            phone_number: targetPhone,
            patient_name: targetName,
          }),
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`📞 The AI Pharmacist is calling you now!\nPlease check your phone (${targetPhone}).`);
      } else {
        alert("Notice: " + (data.detail || data.error || data.message || "Failed to initiate call."));
      }
    } catch (err: any) {
      alert("Notice: " + (err?.message || "Error initiating call. Check console for details."));
      console.error("Call Me error:", err);
    } finally {
      setIsCalling(false);
    }
  };

  const quickActions = [
    {
      title: "Upload Medical Scan",
      description: "Get instant AI findings for X-Ray, MRI, or CT",
      icon: Scan,
      color: "from-blue-600 to-indigo-600",
      onClick: () => setShowScanDiagnostic(true),
    },
    {
      title: t("patient.my_records"),
      description: "View and manage all medical records",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/patient/records"),
    },
    {
      title: t("patient.consent_management"),
      description: "Control data access permissions",
      icon: Shield,
      color: "from-orange-500 to-amber-500",
      onClick: () => navigate("/patient/consent"),
    },
    {
      title: "Expert Pharmacy",
      description: "Clinical medication advice & refill requests",
      icon: ShieldCheck,
      color: "from-indigo-500 to-blue-500",
      onClick: () => navigate("/patient/pharmacy-chat"),
    },
    {
      title: isCalling ? "Calling..." : "Call Me (AI)",
      description: "Receive a call from our AI Pharmacist",
      icon: PhoneCall,
      color: "from-rose-500 to-pink-500",
      onClick: handleCallMe,
    },
    {
      title: "Health & Routine Tracker",
      description: "Log vitals, habits, and daily agenda",
      icon: HeartPulse,
      color: "from-emerald-500 to-teal-500",
      onClick: () => navigate("/patient/routines"),
    },
  ];

  const displayName =
    (patientData?.full_name as string) ||
    (user?.user_metadata?.full_name as string) ||
    (user?.email?.split("@")[0]) ||
    "there";

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Blurred, soft background */}
      <div className="dashboard-backdrop" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.06]" />
      <div className="absolute top-0 right-0 w-[50%] h-[55%] rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45%] h-[50%] rounded-full bg-teal-400/10 blur-3xl -z-10" />
      <div className="absolute inset-0 -z-10 mask-radial-faded bg-background/20" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            {t("patient.dashboard_title")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground mb-2">
            Hello, {displayName}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            {t("patient.dashboard_subtitle")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <motion.div variants={item}>
            <Card className="glass-card border-primary/15 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden h-full hover:border-primary/25 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("patient.total_records")}
                    </p>
                    <p className="text-4xl font-bold font-heading text-primary">{stats.records}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="glass-card border-amber-500/20 shadow-lg shadow-amber-500/5 rounded-2xl overflow-hidden h-full hover:border-amber-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("patient.pending_consents")}
                    </p>
                    <p className="text-4xl font-bold font-heading text-amber-600 dark:text-amber-400">
                      {stats.consents}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Smart Health Card + Consent */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="glass-card rounded-2xl overflow-hidden border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg font-heading">
                    <span className="text-2xl">🏥</span>
                    {t("patient.smart_card")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patientData?.profile_completed ? (
                    <SmartHealthCard
                      patientData={patientData}
                      userId={user?.id || ""}
                      hasPinSet={!!patientData?.smart_pin}
                      onSetPin={() => setShowPinDialog(true)}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎴</span>
                      </div>
                      <h3 className="font-semibold text-base mb-2">Generate Your Smart Health Card</h3>
                      <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                        Complete your profile to get a digital health card with unique UHID
                      </p>
                      <Button
                        onClick={() => setShowProfileSetup(true)}
                        className="w-full rounded-xl gradient-primary gap-2"
                        size="lg"
                      >
                        Setup Profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <ConsentRequestsList />
          </div>

          {/* Right: Risk + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <PharmacyRefillAlerts />
            <RiskAnalysisCard />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card rounded-2xl overflow-hidden border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading">{t("patient.quick_actions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.title}
                        type="button"
                        onClick={action.onClick}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left group rounded-2xl p-5 border border-border/60 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-black/5`}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <ProfileSetup
        open={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onSuccess={() => {
          fetchPatientProfile();
          setShowPinDialog(true);
        }}
      />

      <SetPinDialog
        open={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onSuccess={fetchPatientProfile}
        userId={user?.id || ""}
      />

      <ScanDiagnosticModal
        open={showScanDiagnostic}
        onClose={() => setShowScanDiagnostic(false)}
        onSuccess={() => {
          fetchPatientProfile();
          fetchStats();
        }}
      />
    </div>
  );
}
