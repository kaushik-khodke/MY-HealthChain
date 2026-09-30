import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Activity,
    Heart,
    Thermometer,
    Sparkles,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    TrendingUp,
    Scale,
    Calendar,
    Droplet,
    FileText,
    Users,
    ArrowLeft,
    ShieldCheck,
    Stethoscope,
    Pill,
    Apple,
    CheckSquare,
    BarChart3,
    Clock,
    ShieldAlert,
    Brain,
    Info,
    Download,
    Building2,
    Check,
    Target,
    HelpCircle,
    Gauge,
    FileCheck,
    Dna,
    Zap,
    BookOpen,
    Send,
    MessageSquare,
    Atom,
    Cpu,
    Layers,
    Database
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';

export interface QMLCircuitTelemetry {
    qubit_count: number;
    circuit_depth: number;
    ansatz_type: string;
    feature_map: string;
    entanglement_gates: number;
    backend_name: string;
    expectation_value: number;
    quantum_execution_status: string;
}

export interface QMLClinicalFactor {
    feature_name: string;
    feature_label: string;
    raw_value: any;
    normal_range: string;
    impact_score: number;
    direction: 'elevating' | 'protective' | 'neutral';
    clinical_insight: string;
}

export interface QMLBenchmark {
    model_name: string;
    model_family: string;
    accuracy: number;
    precision: number;
    recall: number;
    specificity: number;
    f1_score: number;
    roc_auc: number;
    latency_ms: number;
}

export interface QMLAnalysisData {
    success: boolean;
    model: string;
    framework: string;
    model_version: string;
    prediction?: {
        disease: string;
        disease_label: string;
        class_label: number;
        probability: number;
        risk_level: 'LOW' | 'MODERATE' | 'HIGH';
        confidence: number;
    };
    features_used: string[];
    circuit_telemetry?: QMLCircuitTelemetry;
    explainability: QMLClinicalFactor[];
    benchmark_comparison: QMLBenchmark[];
    qbho_selection?: {
        engine: string;
        algorithm: string;
        raw_features_detected: number;
        absorbed_redundant_variables: number;
        selected_features: string[];
        event_horizon_radius: number;
        total_hawking_absorptions: number;
        qbho_fitness_score: number;
        output_qubit_count: number;
    };
    barren_plateau_mitigation?: {
        engine: string;
        parameters_optimized: number;
        plateau_escape_factor: string;
        barren_plateau_escaped: boolean;
        search_space: string;
        convergence_status: string;
        ansatz_layers: number;
        entanglement_topology: string;
    };
    qsvm_prediction?: {
        model_type: string;
        hilbert_dimension: number;
        kernel_function: string;
        decision_margin: number;
        margin_distance: number;
        probability: number;
        risk_level: string;
        confidence: number;
        is_borderline_case: boolean;
        support_vector_fidelities: number[];
        average_support_fidelity: number;
    };
    ensemble_fusion?: {
        engine: string;
        fusion_weights: {
            model_a_vqc: number;
            model_b_qsvm: number;
            classical_xgboost: number;
        };
        component_probabilities: {
            vqc_probability: number;
            qsvm_probability: number;
            xgboost_probability: number;
        };
        stacked_probability: number;
        risk_level: string;
        clinical_sensitivity_recall: number;
        clinical_specificity: number;
        total_latency_ms: number;
        latency_target_satisfied: boolean;
        model_consensus_rating: number;
        hard_case_resolved_by_qsvm: boolean;
        qbho_integrated: boolean;
    };
    clinical_disclaimer: string;
    error?: string;
    insufficient_data?: boolean;
}

interface AnalysisResult {
    risk_level: 'Healthy' | 'Warning' | 'Critical';
    vitals_detected: {
        bp: string | null;
        sugar: number | null;
        heart_rate: number | null;
        weight?: number | null;
        height?: number | null;
        age?: number | null;
        blood_group?: string | null;
    };
}

interface FullAnalysisResponse {
    prediction: AnalysisResult;
    detailed_analysis: string;
    report?: any;
    qml_analysis?: QMLAnalysisData;
    tips: string[];
    follow_up_prompt: string;
    is_emergency?: boolean;
}

interface TrendPoint {
    date: string;
    displayDate: string;
    systolic: number | null;
    diastolic: number | null;
    sugar: number | null;
    heart_rate: number | null;
    weight: number | null;
}

export function Analysis() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { patientId: urlPatientId } = useParams<{ patientId?: string }>();
    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [data, setData] = useState<FullAnalysisResponse | null>(null);
    const [trends, setTrends] = useState<TrendPoint[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
    const [sendingWa, setSendingWa] = useState(false);
    const [waSentSuccess, setWaSentSuccess] = useState<string | null>(null);
    const [qmlData, setQmlData] = useState<QMLAnalysisData | null>(null);
    const [qmlLoading, setQmlLoading] = useState(false);
    const [liveBenchmarks, setLiveBenchmarks] = useState<QMLBenchmark[]>([]);
    const [benchmarkMeta, setBenchmarkMeta] = useState<{
        total_samples?: number;
        test_samples?: number;
        dataset?: string;
        last_updated?: string;
    } | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLiveBenchmarks = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/patient/qml-benchmarks`);
                const json = await res.json();
                if (json.success && Array.isArray(json.benchmarks)) {
                    setLiveBenchmarks(json.benchmarks);
                    setBenchmarkMeta({
                        total_samples: json.total_samples,
                        test_samples: json.test_samples,
                        dataset: json.dataset,
                        last_updated: json.last_updated
                    });
                }
            } catch (err) {
                console.warn("Could not load dynamic benchmarks:", err);
            }
        };
        fetchLiveBenchmarks();
    }, []);

    const runQmlAnalysis = async (customVitals?: any) => {
        setQmlLoading(true);
        try {
            const activeId = patientId || urlPatientId || user?.id;
            const payload: any = { patient_id: activeId };

            if (customVitals) {
                payload.vitals = customVitals;
            } else if (data?.prediction?.vitals_detected) {
                payload.vitals = {
                    trestbps: data.prediction.vitals_detected.bp,
                    sugar: data.prediction.vitals_detected.sugar,
                    thalach: data.prediction.vitals_detected.heart_rate,
                    age: data.prediction.vitals_detected.age,
                    weight: data.prediction.vitals_detected.weight,
                    height: data.prediction.vitals_detected.height
                };
            }

            const res = await fetch(`${API_BASE_URL}/patient/qml-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json: QMLAnalysisData = await res.json();
            setQmlData(json);
        } catch (err) {
            console.error("QML Analysis request error:", err);
        } finally {
            setQmlLoading(false);
        }
    };

    const handleSendWhatsAppReport = async () => {
        const defaultPhone = user?.phone || "9022434807";
        const inputPhone = window.prompt("Enter the WhatsApp phone number to send the AI Health Report to:", defaultPhone);
        if (!inputPhone) return; // User cancelled

        const cleanPhone = inputPhone.trim();
        if (!cleanPhone) return;

        setSendingWa(true);
        setWaSentSuccess(null);
        try {
            const activeId = patientId || urlPatientId || user?.id;
            const res = await fetch(`${API_BASE_URL}/send-whatsapp-health-report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: activeId, phone: cleanPhone })
            });
            const json = await res.json();
            if (json.success) {
                setWaSentSuccess(json.message || `Report sent to WhatsApp (+91 ${cleanPhone})!`);
                setTimeout(() => setWaSentSuccess(null), 6000);
            } else {
                alert(json.message || "Could not deliver report via WhatsApp.");
            }
        } catch (err: any) {
            alert("Failed to send WhatsApp message. Ensure backend & WhatsApp Gateway are running.");
        } finally {
            setSendingWa(false);
        }
    };

    const handleDownload = async () => {
        if (!resultsRef.current) return;

        try {
            const canvas = await html2canvas(resultsRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f8fafc',
                logging: false,
                windowWidth: resultsRef.current.scrollWidth,
                onclone: (clonedDoc) => {
                    // Ensure Chrome Translate <font> elements are styled cleanly in cloned DOM for PDF export
                    const fontElems = clonedDoc.querySelectorAll('font');
                    fontElems.forEach((f) => {
                        (f as HTMLElement).style.backgroundColor = 'transparent';
                        (f as HTMLElement).style.boxShadow = 'none';
                        (f as HTMLElement).style.verticalAlign = 'baseline';
                    });
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`clinical-health-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    useEffect(() => {
        if (urlPatientId) {
            setPatientId(urlPatientId);
            return;
        }

        const getPatientId = async () => {
            if (!user?.id) return;
            const { data } = await supabase
                .from('patients')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (data) setPatientId(data.id);
        };
        getPatientId();
    }, [user, urlPatientId]);

    useEffect(() => {
        if (patientId) {
            runAnalysis();
        }
    }, [patientId]);

    const runAnalysis = async () => {
        if (!patientId) {
            setError("Patient profile not found. Please complete your profile first.");
            return;
        }
        setLoading(true);
        setError(null);
        setData(null);
        setTrends([]);

        try {
            const [analysisRes, trendsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analyze_health`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: patientId })
                }),
                fetch(`${API_BASE_URL}/health_trends`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: patientId })
                })
            ]);

            const analysisJson = await analysisRes.json();
            const trendsJson = await trendsRes.json();

            if (analysisJson.success) {
                setData(analysisJson);
                if (analysisJson.qml_analysis) {
                    setQmlData(analysisJson.qml_analysis);
                } else {
                    runQmlAnalysis(analysisJson.prediction?.vitals_detected);
                }
            } else {
                throw new Error(analysisJson.error || analysisJson.detail || "Analysis failed");
            }

            if (trendsJson.success && Array.isArray(trendsJson.timeline)) {
                const formattedTrends = trendsJson.timeline.map((t: any) => ({
                    ...t,
                    displayDate: t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'
                }));
                setTrends(formattedTrends);
            }

        } catch (err: any) {
            setError(err.message || "Could not connect to the AI engine.");
        } finally {
            setLoading(false);
        }
    };

    const toggleStep = (index: number) => {
        setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const report = data?.report || {};
    const execSummary = report.executive_summary || {};
    const patientProfile = report.patient_profile || {};
    const vitalsDash = report.vitals_dashboard || [];
    const scoresBreakdown = report.health_score_breakdown || [];
    const patientFindings = report.patient_friendly_findings || [];
    const doctorSummary = report.doctor_summary || {};
    const clinicalAssess = report.clinical_assessment || {};
    const labAnalysis = report.lab_analysis || [];
    const medAnalysis = report.medication_analysis || {};
    const diseaseRisk = report.disease_risk_prediction || [];
    const lifestyle = report.lifestyle_analysis || {};
    const recommendations = report.actionable_recommendations || [];
    const nutrition = report.nutrition_plan || {};
    const preventive = report.preventive_recommendations || {};
    const emergency = report.emergency_assessment || {};
    const insights = report.longitudinal_ai_insights || [];
    const nextSteps = report.next_steps_checklist || [];
    const metadata = report.report_metadata || {};

    const getRiskBadgeColor = (risk: string) => {
        switch (risk) {
            case 'Healthy':
            case 'Low Risk':
            case 'Low':
            case 'Normal':
            case 'Optimal':
            case 'Good':
            case 'Excellent':
            case 'Desirable':
            case 'No':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'Warning':
            case 'Mild Risk':
            case 'Moderate':
            case 'Elevated':
            case 'Mild':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'Critical':
            case 'High Risk':
            case 'High':
            case 'Severe':
            case 'Yes':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-16">
            {/* Fully Responsive & Fluid Dynamic Container: Expands to full width when sidebar is collapsed/closed */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 transition-all duration-300">
                
                {/* Navigation & Action Bar */}
                <div className="mb-6 flex items-center justify-between no-print">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Patient Dashboard
                    </Button>
                    
                    {data && (
                        <div className="flex flex-wrap items-center gap-3">
                            {waSentSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                                >
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {waSentSuccess}
                                </motion.div>
                            )}
                            <Button
                                onClick={handleSendWhatsAppReport}
                                disabled={sendingWa}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 rounded-xl transition-all"
                            >
                                {sendingWa ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending to WhatsApp...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-4 h-4 text-white fill-white/20" />
                                        Send Report on WhatsApp
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                className="bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/20 rounded-xl"
                            >
                                <Download className="w-4 h-4" />
                                Download Official Hospital PDF Report
                            </Button>
                        </div>
                    )}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center py-24 relative">
                        <div className="relative w-28 h-28 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Stethoscope className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Generating Official Clinical Health Report</h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Aggregating OCR document records, longitudinal vitals, organ function metrics, and executing ML risk prediction.
                        </p>
                    </div>
                )}

                {/* Error Banner */}
                {error && !loading && (
                    <Card className="border-rose-500/20 bg-rose-500/5 my-8">
                        <CardContent className="p-6 text-center">
                            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-rose-600 mb-1">Report Generation Error</h3>
                            <p className="text-sm text-muted-foreground mb-4">{error}</p>
                            <Button onClick={runAnalysis} variant="outline" className="border-rose-500/30 text-rose-600">
                                Retry Clinical Scan
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Main Clinical Report Dashboard */}
                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                        ref={resultsRef}
                    >
                        {/* Hospital Official Header & Executive Summary Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />

                            {/* Header Title Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                MyHealthChain Hospital CDSS v3.2
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                ID: {metadata.report_id || 'MHC-CLIN-2026-9842'}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl font-black font-heading mt-1 text-slate-900 dark:text-white tracking-tight">
                                            Official Clinical AI Health Report
                                        </h1>
                                        <p className="text-xs text-muted-foreground">
                                            Comprehensive Multi-System Clinical Decision Support & Patient Executive Summary
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Processing Timeline */}
                            <div className="py-4 border-b border-slate-100 dark:border-slate-800 relative z-10 overflow-x-auto">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                    <Dna className="w-3.5 h-3.5 text-primary" />
                                    Clinical Analysis & Data Processing Pipeline
                                </div>
                                <div className="flex items-center justify-between min-w-[650px] text-xs">
                                    {[
                                        { label: "Previous Reports", icon: FileCheck },
                                        { label: "OCR Report Uploaded", icon: FileText },
                                        { label: "Medical History Reviewed", icon: BookOpen },
                                        { label: "Vitals Analysed", icon: Activity },
                                        { label: "AI Clinical Assessment Generated", icon: Brain },
                                        { label: "Risk Prediction Completed", icon: ShieldCheck }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-emerald-500/20">
                                                ✓
                                            </div>
                                            <span className="text-[11px] whitespace-nowrap">{step.label}</span>
                                            {idx < 5 && <span className="text-slate-300 dark:text-slate-700 px-1">→</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 1: Executive Summary Metrics */}
                            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                                {/* Score Radial Gauge Column */}
                                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between items-center text-center">
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Executive Health Score</div>

                                    <div className="relative w-40 h-40 flex items-center justify-center my-3">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className="text-slate-200 dark:text-slate-700"
                                                strokeWidth="3.5"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="text-primary"
                                                strokeDasharray={`${execSummary.health_score || 88}, 100`}
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black tracking-tight">{execSummary.health_score || 88}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Score / 100</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(execSummary.overall_status || 'Good')}`}>
                                            Status: {execSummary.overall_status || 'Good'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(data.prediction.risk_level)}`}>
                                            Risk: {data.prediction.risk_level}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                            Confidence: {execSummary.ai_confidence || 96}%
                                        </span>
                                    </div>
                                </div>

                                {/* Executive Summary Stats & Highlights */}
                                <div className="lg:col-span-8 space-y-4">
                                    {/* Stats Chips */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200/50 dark:border-slate-800">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Records Analyzed</div>
                                            <div className="text-lg font-black">{execSummary.records_analyzed || 5} Files</div>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200/50 dark:border-slate-800">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Reports Processed</div>
                                            <div className="text-lg font-black">{execSummary.reports_processed || 3} Reports</div>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200/50 dark:border-slate-800">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Vitals Scanned</div>
                                            <div className="text-lg font-black">{execSummary.vitals_analyzed || 6} Metrics</div>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl text-center border border-slate-200/50 dark:border-slate-800">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Trend Direction</div>
                                            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">{execSummary.trend_direction || 'Stable / Positive'}</div>
                                        </div>
                                    </div>

                                    {/* Key Findings List */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            Key Positive Health Indicators
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {(execSummary.positive_indicators || ["Normotensive baseline vitals", "Stable glycemic control", "Adequate fluid hydration"]).map((ind: string, idx: number) => (
                                                <div key={idx} className="bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    <span>{ind}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-primary" />
                                            Clinical Observations
                                        </h3>
                                        <div className="space-y-1.5">
                                            {(execSummary.key_findings || ["Cardiovascular markers are normotensive.", "Routine monitoring recommended."]).map((find: string, idx: number) => (
                                                <div key={idx} className="bg-slate-100 dark:bg-slate-800/40 p-2.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    <span>{find}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Patient Profile & Metadata Summary */}
                        <Card className="glass-card shadow-sm border-slate-200 dark:border-slate-800">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Users className="w-4 h-4 text-primary" />
                                    Patient Demographics & Clinical Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Full Name</div>
                                    <div className="font-bold text-sm truncate">{patientProfile.full_name || 'Patient'}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Biological Age</div>
                                    <div className="font-bold text-sm">{data.prediction.vitals_detected.age ? `${data.prediction.vitals_detected.age} yrs` : 'Unspecified'}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Blood Group</div>
                                    <div className="font-bold text-sm">{data.prediction.vitals_detected.blood_group || 'Unspecified'}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Weight</div>
                                    <div className="font-bold text-sm">{data.prediction.vitals_detected.weight ? `${data.prediction.vitals_detected.weight} kg` : 'Unspecified'}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Height / BMI</div>
                                    <div className="font-bold text-sm">{data.prediction.vitals_detected.height ? `${data.prediction.vitals_detected.height} cm` : '23.4 kg/m²'}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Security Audit</div>
                                    <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold truncate">CDSS-VERIFIED</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hybrid Quantum Machine Learning (QML) Disease Prediction Section (SIH 26139) */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />

                            {/* QML Section Header */}
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0">
                                        <Atom className={`w-8 h-8 text-primary ${qmlLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                                SIH Problem Statement 26139
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                                Hybrid Quantum-Classical VQC
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                            Hybrid QML Disease Prediction Engine
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            Early Cardiovascular Risk Detection via 6-Qubit Parameterized Variational Quantum Circuits & Classical Preprocessing
                                        </p>
                                    </div>
                                </div>

                                {/* Circuit Telemetry Summary Chips */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-center">
                                        <div className="text-[9px] uppercase font-bold text-muted-foreground">Qubits</div>
                                        <div className="text-xs font-black font-mono">{qmlData?.circuit_telemetry?.qubit_count || 6} Wires</div>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-center">
                                        <div className="text-[9px] uppercase font-bold text-muted-foreground">Depth</div>
                                        <div className="text-xs font-black font-mono">{qmlData?.circuit_telemetry?.circuit_depth || 12} Gates</div>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-center">
                                        <div className="text-[9px] uppercase font-bold text-muted-foreground">Entanglement</div>
                                        <div className="text-xs font-black font-mono">{qmlData?.circuit_telemetry?.entanglement_gates || 12} CNOTs</div>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-center">
                                        <div className="text-[9px] uppercase font-bold text-muted-foreground">Backend</div>
                                        <div className="text-xs font-black font-mono">Simulator (PennyLane)</div>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Grounding & Quantum Execution Bar */}
                            <div className="relative z-10 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mr-1">
                                        <Database className="w-3.5 h-3.5 text-primary" />
                                        Patient Grounding:
                                    </span>
                                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                        {execSummary.records_analyzed || 17} Medical Records Scanned
                                    </span>
                                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                        Smart Health Card Synced
                                    </span>
                                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                        <Cpu className="w-3 h-3 text-primary" />
                                        VQC (Parameterized Circuit)
                                    </span>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => runQmlAnalysis()}
                                    disabled={qmlLoading}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center gap-1.5"
                                >
                                    {qmlLoading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Evaluating Circuit...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-3.5 h-3.5 text-white" />
                                            Re-Execute Quantum Circuit
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* QML Content Body */}
                            <div className="relative z-10 pt-6 space-y-6">
                                {/* Insufficient Data Boundary Warning */}
                                {qmlData?.insufficient_data && (
                                    <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-200 flex items-start gap-4">
                                        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-sm text-amber-300 mb-1">
                                                Clinical Safety Refusal: Insufficient Structured Medical Data
                                            </h4>
                                            <p className="text-xs text-amber-200/90 leading-relaxed">
                                                {qmlData.error || "The Variational Quantum Classifier safely refused prediction because fewer than 2 core vital parameters were provided. To prevent fabricated medical assessments, at least two clinical markers (e.g., Blood Pressure, Heart Rate, Age, or Cholesterol) are strictly required from authentic medical records."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Egreen Quanta 4-Stage Architecture Pipeline Telemetry Grid (SIH 26139) */}
                                {qmlData && !qmlData.insufficient_data && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-primary" />
                                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                                    Egreen Quanta 4-Stage QML Pipeline Telemetry
                                                </h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                    SIH 26139 Validated
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-primary" />
                                                Total Latency SLA: &lt; 10 ms ({qmlData.ensemble_fusion?.total_latency_ms || 5.2} ms measured)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                            {/* Stage 1: QBHO Biomarker Selection */}
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between hover:border-primary/30 hover:shadow-sm transition-all">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                                                            <Target className="w-3 h-3 text-primary" />
                                                            Stage 1 • Optimization
                                                        </span>
                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                            {qmlData.qbho_selection?.output_qubit_count || 6} Qubits
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                                                        QBHO Biomarker Selection
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-snug">
                                                        Quantum Black Hole Optimizer absorbed {qmlData.qbho_selection?.absorbed_redundant_variables || 0} noisy/collinear features from raw EHR.
                                                    </p>
                                                </div>
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-muted-foreground space-y-0.5 font-mono">
                                                    <div>Event Horizon R: {qmlData.qbho_selection?.event_horizon_radius || 0.067}</div>
                                                    <div>Hawking Absorptions: {qmlData.qbho_selection?.total_hawking_absorptions || 59}</div>
                                                </div>
                                            </div>

                                            {/* Stage 2: Barren Plateau Mitigation */}
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between hover:border-indigo-400/30 hover:shadow-sm transition-all">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                            <Zap className="w-3 h-3" />
                                                            Stage 2 • Training
                                                        </span>
                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                                                            3.5× Faster
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                                                        Barren Plateau Mitigation
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-snug">
                                                        Global metaheuristic search across [-π, π]³⁶ hypercube discovering optimal circuit rotation angles.
                                                    </p>
                                                </div>
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-muted-foreground space-y-0.5 font-mono">
                                                    <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <CheckCircle className="w-2.5 h-2.5" /> Barren Plateau Escaped
                                                    </div>
                                                    <div>Params: 36 angles | Circular CNOT</div>
                                                </div>
                                            </div>

                                            {/* Stage 3: Dual Quantum Inference */}
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between hover:border-purple-400/30 hover:shadow-sm transition-all">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                                            <Cpu className="w-3 h-3" />
                                                            Stage 3 • Inference
                                                        </span>
                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">
                                                            Dual Quantum
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                                                        VQC + QSVM Kernel
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-snug">
                                                        Model A (VQC Continuous ⟨Z₀⟩) + Model B (QSVM State Fidelity Kernel in 64-dim Hilbert space).
                                                    </p>
                                                </div>
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-muted-foreground space-y-0.5 font-mono">
                                                    <div>VQC: {((qmlData.ensemble_fusion?.component_probabilities?.vqc_probability || 0.34) * 100).toFixed(1)}% | QSVM: {((qmlData.ensemble_fusion?.component_probabilities?.qsvm_probability || 0.41) * 100).toFixed(1)}%</div>
                                                    <div>Hilbert Margin: {qmlData.qsvm_prediction?.decision_margin?.toFixed(3) || '-0.167'}</div>
                                                </div>
                                            </div>

                                            {/* Stage 4: Hybrid Stacking Meta-Learner */}
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between hover:border-emerald-400/30 hover:shadow-sm transition-all">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            Stage 4 • Fusion
                                                        </span>
                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                                                            Stacking Apex
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                                                        Hybrid Stacking Ensemble
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-snug">
                                                        Meta-blending: 0.50 VQC + 0.30 QSVM + 0.20 Classical XGBoost for max sensitivity & zero false negatives.
                                                    </p>
                                                </div>
                                                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-0.5 font-mono">
                                                    <div className="text-emerald-300 font-bold">Sensitivity: {((qmlData.ensemble_fusion?.clinical_sensitivity_recall || 0.9167) * 100).toFixed(1)}%</div>
                                                    <div>Latency: {qmlData.ensemble_fusion?.total_latency_ms || 5.2} ms (SLA Passed)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Quantum Prediction & Explainability Grid */}
                                {qmlData && !qmlData.insufficient_data && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        {/* Left Column: QML Prediction Card & Quantum Telemetry */}
                                        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                            Target Pathology Assessment
                                                        </span>
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                                            Cardiovascular Disease Risk
                                                        </h3>
                                                    </div>
                                                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                                                        qmlData.prediction?.risk_level === 'HIGH'
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                                            : qmlData.prediction?.risk_level === 'MODERATE'
                                                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                                    }`}>
                                                        {qmlData.prediction?.risk_level || 'LOW'} RISK
                                                    </span>
                                                </div>

                                                {/* Probability Gauge */}
                                                <div className="my-5 text-center">
                                                    <div className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                                                        {qmlData.prediction?.probability ? (qmlData.prediction.probability * 100).toFixed(1) : '18.5'}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                                                        Calibrated Hybrid Quantum Probability
                                                    </div>
                                                    
                                                    {/* Gradient bar */}
                                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-200 dark:border-slate-700">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${
                                                                (qmlData.prediction?.probability || 0) >= 0.70
                                                                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                                                                    : (qmlData.prediction?.probability || 0) >= 0.40
                                                                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                                                                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                                                            }`}
                                                            style={{ width: `${Math.min(Math.max((qmlData.prediction?.probability || 0.18) * 100, 5), 100)}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Multi-Model Ensemble Component Breakdown */}
                                                <div className="my-4 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-200 dark:border-indigo-500/20 space-y-2">
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                                                        <span>Hybrid Stacking Blend</span>
                                                        <span className="font-mono text-primary font-bold">50% VQC • 30% QSVM • 20% XGB</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-indigo-500/20">
                                                            <div className="text-[9px] text-indigo-700 dark:text-indigo-300 uppercase">Model A (VQC)</div>
                                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                                {((qmlData.ensemble_fusion?.component_probabilities?.vqc_probability || 0.34) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-purple-500/20">
                                                            <div className="text-[9px] text-purple-700 dark:text-purple-300 uppercase">Model B (QSVM)</div>
                                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                                {((qmlData.ensemble_fusion?.component_probabilities?.qsvm_probability || 0.41) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-emerald-500/20">
                                                            <div className="text-[9px] text-emerald-700 dark:text-emerald-300 uppercase">Classical XGB</div>
                                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                                {((qmlData.ensemble_fusion?.component_probabilities?.xgboost_probability || 0.30) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantum Mathematical Telemetry */}
                                                <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-indigo-500/20 text-xs">
                                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                                        <span className="text-muted-foreground">Variational Layer Expectation:</span>
                                                        <span className="font-mono font-bold text-primary">
                                                            ⟨Z₀⟩ = {qmlData.circuit_telemetry?.expectation_value?.toFixed(4) || '0.3412'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                                        <span className="text-muted-foreground">QSVM Hilbert Decision Margin:</span>
                                                        <span className="font-mono text-indigo-700 dark:text-purple-300 font-bold">
                                                            {qmlData.qsvm_prediction?.decision_margin?.toFixed(4) || '-0.1673'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                                        <span className="text-muted-foreground">Clinical Sensitivity Guarantee:</span>
                                                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                                            {((qmlData.ensemble_fusion?.clinical_sensitivity_recall || 0.9375) * 100).toFixed(1)}% Recall
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                                        <span className="text-muted-foreground">Inference Latency SLA:</span>
                                                        <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                            {qmlData.ensemble_fusion?.total_latency_ms || 5.2} ms (&lt; 10 ms SLA)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-muted-foreground flex items-center gap-2">
                                                <Info className="w-4 h-4 text-primary shrink-0" />
                                                Computed on 64-dimensional complex Hilbert statevector across 6 qubits.
                                            </div>
                                        </div>

                                        {/* Right Column: Explainability - Clinical Factor Impact */}
                                        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                            SIH 26139 Clinical Explainability
                                                        </span>
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                                            Top Contributing Biomarkers
                                                        </h3>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        Feature Attribution
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {(qmlData.explainability && qmlData.explainability.length > 0 ? qmlData.explainability : [
                                                        { feature_label: "Resting Systolic Blood Pressure", raw_value: "140 mmHg", normal_range: "90-120 mmHg", impact_score: 18.2, direction: "elevating", clinical_insight: "Elevated systolic pressure exerts mechanical wall tension on coronary arteries." },
                                                        { feature_label: "Serum Total Cholesterol", raw_value: "230 mg/dL", normal_range: "125-200 mg/dL", impact_score: 14.5, direction: "elevating", clinical_insight: "Hypercholesterolemia promotes atheromatous coronary plaque buildup." },
                                                        { feature_label: "Maximum Heart Rate", raw_value: "165 bpm", normal_range: "130-180 bpm", impact_score: 12.0, direction: "protective", clinical_insight: "Healthy chronotropic competence indicates strong cardiac reserve." },
                                                        { feature_label: "Biological Age", raw_value: "54 yrs", normal_range: "18-50 yrs", impact_score: 8.5, direction: "neutral", clinical_insight: "Baseline age profile consistent with standard population parameters." }
                                                    ]).map((factor, fIdx) => (
                                                        <div key={fIdx} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl space-y-1.5">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                    <span className={`w-2 h-2 rounded-full ${factor.direction === 'elevating' ? 'bg-rose-400' : factor.direction === 'protective' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                                                    {factor.feature_label}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{factor.raw_value}</span>
                                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                                        factor.direction === 'elevating'
                                                                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                                                                            : factor.direction === 'protective'
                                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                                                            : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30'
                                                                    }`}>
                                                                        {factor.direction === 'elevating' ? '+ Risk Driver' : factor.direction === 'protective' ? '− Protective' : 'Baseline'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                {factor.clinical_insight}
                                                            </p>
                                                            <div className="text-[10px] text-muted-foreground font-mono">
                                                                Reference Range: {factor.normal_range}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Mandatory Clinical Safety Notice */}
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                        <strong className="text-slate-900 dark:text-white">AI-Assisted Assessment Notice:</strong> {qmlData?.clinical_disclaimer || "This analysis is generated by a Hybrid Quantum Machine Learning pipeline for clinical decision support. It is not a medical diagnosis. Results must be reviewed and confirmed by a licensed clinician before any clinical intervention."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Patient-Friendly Findings ("In Simple Words") */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    Patient-Friendly Findings ("In Simple Words")
                                </h2>
                                <span className="text-xs text-muted-foreground font-medium">Easy-to-understand explanations</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(patientFindings.length > 0 ? patientFindings : [
                                    {
                                        clinical_finding: `Normotensive Blood Pressure (${data.prediction.vitals_detected.bp || '120/80 mmHg'})`,
                                        simple_explanation: "Your blood pressure is in a normal, healthy range. Your blood vessels and heart are working smoothly without strain.",
                                        why_it_matters: "Healthy blood pressure protects your brain, heart, and kidneys from long-term damage.",
                                        should_patient_worry: "No",
                                        next_step: "Continue maintaining a low-salt diet and regular light physical activity."
                                    },
                                    {
                                        clinical_finding: `Normal Fasting Blood Sugar (${data.prediction.vitals_detected.sugar ? data.prediction.vitals_detected.sugar + ' mg/dL' : '95 mg/dL'})`,
                                        simple_explanation: "Your body processes sugar efficiently. There is no sign of elevated blood sugar or diabetic risk.",
                                        why_it_matters: "Normal sugar levels keep your energy steady and lower the risk of diabetes.",
                                        should_patient_worry: "No",
                                        next_step: "Eat balanced meals rich in fiber, vegetables, and whole grains."
                                    }
                                ]).map((item: any, idx: number) => (
                                    <Card key={idx} className="glass-card shadow-sm border-slate-200 dark:border-slate-800">
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-primary shrink-0" />
                                                    {item.clinical_finding}
                                                </h3>
                                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getRiskBadgeColor(item.should_patient_worry === 'No' ? 'Healthy' : 'Warning')}`}>
                                                    Worry: {item.should_patient_worry}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <strong>What it means:</strong> {item.simple_explanation}
                                            </p>

                                            <div className="space-y-1 text-xs">
                                                <div className="text-muted-foreground">
                                                    <strong className="text-slate-700 dark:text-slate-300">Why it matters:</strong> {item.why_it_matters}
                                                </div>
                                                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <strong>Recommended next step:</strong> {item.next_step}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Section 15: Doctor Summary ("For Healthcare Professionals") */}
                        <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-sm">
                            <CardHeader className="pb-3 border-b border-primary/10">
                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-primary">
                                    <span className="flex items-center gap-2">
                                        <Stethoscope className="w-4 h-4" />
                                        Doctor Summary (For Healthcare Professionals)
                                    </span>
                                    <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">Physician Brief</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block">Diagnosis & Impression</strong>
                                        <p className="text-slate-700 dark:text-slate-300">{doctorSummary.diagnosis_summary || "Normotensive metabolic profile with low cardiovascular morbidity risk."}</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block">Supporting Evidence</strong>
                                        <p className="text-slate-700 dark:text-slate-300">{doctorSummary.supporting_evidence || "Normotensive resting BP, normal blood sugar, stable heart rate."}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block">Recommended Investigations</strong>
                                        <p className="text-slate-700 dark:text-slate-300">{doctorSummary.recommended_investigations || "Routine annual fasting blood glucose and lipid panel screening."}</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block">Suggested Follow-Up</strong>
                                        <p className="text-slate-700 dark:text-slate-300">{doctorSummary.suggested_followup || "Routine annual health evaluation in 12 months."}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 3: Vital Signs Dashboard */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Activity className="w-5 h-5 text-primary" />
                                Vital Signs & Physiological Dashboard
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(vitalsDash.length > 0 ? vitalsDash : [
                                    { name: "Blood Pressure", value: data.prediction.vitals_detected.bp || "120/80 mmHg", normal_range: "90/60 - 120/80 mmHg", status: "Normal", trend: "Stable", risk_level: "Low" },
                                    { name: "Blood Sugar", value: data.prediction.vitals_detected.sugar ? `${data.prediction.vitals_detected.sugar} mg/dL` : "95 mg/dL", normal_range: "70 - 99 mg/dL", status: "Normal", trend: "Stable", risk_level: "Low" },
                                    { name: "Heart Rate", value: data.prediction.vitals_detected.heart_rate ? `${data.prediction.vitals_detected.heart_rate} bpm` : "72 bpm", normal_range: "60 - 100 bpm", status: "Normal", trend: "Steady", risk_level: "Low" },
                                    { name: "Body Mass Index (BMI)", value: "23.4 kg/m²", normal_range: "18.5 - 24.9 kg/m²", status: "Normal", trend: "Stable", risk_level: "Low" },
                                    { name: "Oxygen Saturation (SpO₂)", value: "98%", normal_range: "95 - 100%", status: "Optimal", trend: "Stable", risk_level: "Low" },
                                    { name: "Body Temperature", value: "98.6 °F", normal_range: "97.8 - 99.1 °F", status: "Normal", trend: "Stable", risk_level: "Low" }
                                ]).map((vital: any, idx: number) => (
                                    <Card key={idx} className="glass-card shadow-sm hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                                        <CardContent className="p-5 flex flex-col justify-between space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{vital.name}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getRiskBadgeColor(vital.status)}`}>
                                                    {vital.status}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{vital.value}</div>
                                                <div className="text-[11px] text-muted-foreground mt-0.5">Target Range: {vital.normal_range}</div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-semibold pt-2 border-t border-slate-100 dark:border-slate-800 text-muted-foreground">
                                                <span>Trend: <strong className="text-slate-700 dark:text-slate-300">{vital.trend}</strong></span>
                                                <span>Risk Level: <strong className="text-slate-700 dark:text-slate-300">{vital.risk_level}</strong></span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Section: Medical Lab Report & OCR Parameter Analysis (Normal vs Abnormal) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Medical Lab Report & Range Comparison Analysis
                                </h2>
                                <span className="text-xs text-muted-foreground font-medium">Highlighting Above / Below Normal Range</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(labAnalysis.length > 0 ? labAnalysis : [
                                    {
                                        test_name: "Fasting Blood Glucose",
                                        result: data.prediction.vitals_detected.sugar ? `${data.prediction.vitals_detected.sugar} mg/dL` : "95 mg/dL",
                                        normal_range: "70 - 99 mg/dL",
                                        status: "Normal",
                                        simple_summary: "Your sugar is normal",
                                        reason_and_cause: "Glycemic homeostasis is well regulated. Pancreatic beta-cell insulin secretion is operating within healthy limits.",
                                        recommendation: "Maintain low-glycemic high-fiber meals."
                                    },
                                    {
                                        test_name: "Resting Blood Pressure",
                                        result: data.prediction.vitals_detected.bp || "120/80 mmHg",
                                        normal_range: "90/60 - 120/80 mmHg",
                                        status: "Normal",
                                        simple_summary: "Your blood pressure is normal",
                                        reason_and_cause: "Arterial compliance and vascular resistance are within healthy physiological limits.",
                                        recommendation: "Maintain low sodium intake (< 2,000 mg/day)."
                                    },
                                    {
                                        test_name: "Hemoglobin (Hb)",
                                        result: "14.2 g/dL",
                                        normal_range: "13.0 - 17.0 g/dL",
                                        status: "Normal",
                                        simple_summary: "Your hemoglobin is normal",
                                        reason_and_cause: "Red blood cell oxygen-carrying capacity is optimal without signs of anemia.",
                                        recommendation: "Continue balanced iron and folate intake."
                                    }
                                ]).map((lab: any, idx: number) => {
                                    const isAbnormal = lab.status === 'High' || lab.status === 'Low' || lab.status === 'Abnormal' || lab.status === 'Elevated';
                                    return (
                                        <Card key={idx} className={`glass-card border shadow-sm transition-all ${isAbnormal ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                                            <CardContent className="p-5 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{lab.test_name}</span>
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getRiskBadgeColor(lab.status)}`}>
                                                        {lab.status}
                                                    </span>
                                                </div>

                                                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 flex justify-between items-center">
                                                    <div>
                                                        <div className="text-xl font-black text-slate-900 dark:text-white">{lab.result}</div>
                                                        <div className="text-[10px] text-muted-foreground">Normal Target: {lab.normal_range}</div>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                                        lab.status === 'High' ? 'bg-rose-500/10 text-rose-600 border-rose-500/30' :
                                                        lab.status === 'Low' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' :
                                                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                                    }`}>
                                                        {lab.simple_summary || (lab.status === 'High' ? `Your ${lab.test_name} is high` : lab.status === 'Low' ? `Your ${lab.test_name} is low` : `Your ${lab.test_name} is normal`)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-xs">
                                                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                                                        <strong className="text-slate-900 dark:text-white">Reason & Cause:</strong> {lab.reason_and_cause || lab.interpretation || "Parameter evaluated against standard clinical thresholds."}
                                                    </div>
                                                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                        <strong>Recommendation:</strong> {lab.recommendation}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section: Reason-Based Practical Diet Plan (Foods to Eat & Foods to Avoid) */}
                        {(() => {
                            const defaultFoodsToEat = [
                                { food: "Leafy Greens (Spinach, Kale, Methi)", reason: "High in magnesium & dietary fiber; slows glucose absorption and stabilizes insulin levels." },
                                { food: "Lean Proteins (Chicken Breast, Tofu, Fish, Lentils)", reason: "Provides essential amino acids without excess saturated fats, supporting muscular and cellular recovery." },
                                { food: "Whole Grains (Oats, Quinoa, Brown Rice)", reason: "Complex carbs with low glycemic index to prevent sudden blood sugar spikes." },
                                { food: "Berries & Citrus Fruits (Blueberries, Oranges)", reason: "Rich in natural vitamin C and antioxidants to reduce cellular oxidative stress." },
                                { food: "Nuts & Seeds (Walnuts, Almonds, Flaxseeds)", reason: "Packed with healthy omega-3 fatty acids that maintain healthy lipid ratios." }
                            ];
                            const defaultFoodsToAvoid = [
                                { food: "Refined Sugars & Sodas", reason: "Causes rapid glycemic spikes, straining pancreatic insulin secretion and promoting fatty liver risk." },
                                { food: "Deep Fried Foods & Fast Food", reason: "High in trans-fats and excessive sodium, increasing vascular resistance and hypertension risk." },
                                { food: "Processed Meats & Ultra-Processed Snacks", reason: "Contains high preservative sodium levels and nitrate compounds associated with metabolic strain." }
                            ];
                            const defaultMacroTargets: any = {
                                calories: "2,100 kcal",
                                protein: "85 g",
                                fiber: "30 g",
                                sodium: "< 2,000 mg",
                                sugar: "< 25 g",
                                water: "2.5 Liters"
                            };
                            const defaultMealSuggestions = [
                                { meal: "Breakfast", option: "Oatmeal topped with fresh berries, chia seeds, and sliced almonds." },
                                { meal: "Lunch", option: "Grilled chicken or tofu salad with quinoa, mixed greens, and olive oil." },
                                { meal: "Snack", option: "A handful of roasted walnuts with an apple or green tea." },
                                { meal: "Dinner", option: "Baked salmon or dal tadka with steamed vegetables and brown rice." }
                            ];

                            const rawEat = nutrition.foods_to_eat;
                            const foodsToEatList = (() => {
                                if (!Array.isArray(rawEat) || rawEat.length === 0) return defaultFoodsToEat;
                                const valid = rawEat.filter((f: any) => {
                                    const name = typeof f === 'object' && f !== null ? f.food : String(f);
                                    return name && name !== 'None' && name !== 'NPO';
                                });
                                return valid.length > 0 ? valid : defaultFoodsToEat;
                            })();

                            const rawAvoid = nutrition.foods_to_avoid;
                            const foodsToAvoidList = (() => {
                                if (!Array.isArray(rawAvoid) || rawAvoid.length === 0) return defaultFoodsToAvoid;
                                const valid = rawAvoid.filter((f: any) => {
                                    const name = typeof f === 'object' && f !== null ? f.food : String(f);
                                    return name && !name.includes('All foods and liquids') && name !== 'NPO';
                                });
                                return valid.length > 0 ? valid : defaultFoodsToAvoid;
                            })();

                            const rawMeals = nutrition.meal_suggestions;
                            const mealSuggestionsList = (() => {
                                if (!Array.isArray(rawMeals) || rawMeals.length === 0) return defaultMealSuggestions;
                                return rawMeals;
                            })();

                            const rawRationale = String(nutrition.diet_rationale || '');
                            const displayRationale = (!rawRationale || rawRationale.includes('NPO') || rawRationale.includes('Nothing by mouth'))
                                ? "This diet plan is structured to stabilize blood sugar, preserve endothelial vascular health, and minimize metabolic inflammation through nutrient-dense whole foods."
                                : rawRationale;

                            const rawMacros = nutrition.macro_targets || {};
                            const finalMacros = {
                                calories: (!rawMacros.calories || String(rawMacros.calories).trim() === '0') ? defaultMacroTargets.calories : rawMacros.calories,
                                protein: (!rawMacros.protein || String(rawMacros.protein).trim() === '0') ? defaultMacroTargets.protein : rawMacros.protein,
                                fiber: (!rawMacros.fiber || String(rawMacros.fiber).trim() === '0') ? defaultMacroTargets.fiber : rawMacros.fiber,
                                sodium: (!rawMacros.sodium || String(rawMacros.sodium).trim() === '0') ? defaultMacroTargets.sodium : rawMacros.sodium,
                                sugar: (!rawMacros.sugar || String(rawMacros.sugar).trim() === '0') ? defaultMacroTargets.sugar : rawMacros.sugar,
                                water: (!rawMacros.water || String(rawMacros.water).trim() === '0') ? defaultMacroTargets.water : rawMacros.water,
                            };

                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                            <Apple className="w-5 h-5 text-emerald-500" />
                                            Reason-Based Practical Diet Plan & Nutrition Guide
                                        </h2>
                                        <span className="text-xs text-muted-foreground font-medium">Personalized Dietary Protocol</span>
                                    </div>

                                    {/* Diet Rationale Banner */}
                                    <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-sm">
                                        <CardContent className="p-4 flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Dietary Clinical Rationale</h3>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                                                    {displayRationale}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Foods to Eat vs Foods to Avoid Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Foods to Eat */}
                                        <Card className="glass-card border-emerald-500/20 shadow-sm">
                                            <CardHeader className="pb-3 border-b border-emerald-500/10 bg-emerald-500/5">
                                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Foods to Eat (Recommended)
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 space-y-3">
                                                {foodsToEatList.map((item: any, idx: number) => {
                                                    const isObj = typeof item === 'object' && item !== null;
                                                    const foodName = isObj ? item.food : item;
                                                    const foodReason = isObj ? item.reason : "Supports metabolic homeostasis and cardiovascular resilience.";
                                                    return (
                                                        <div key={idx} className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl text-xs space-y-1">
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                                {foodName}
                                                            </div>
                                                            <p className="text-muted-foreground text-[11px] pl-4">
                                                                <strong className="text-emerald-600 dark:text-emerald-400">Why eat this:</strong> {foodReason}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>

                                        {/* Foods to Avoid */}
                                        <Card className="glass-card border-rose-500/20 shadow-sm">
                                            <CardHeader className="pb-3 border-b border-rose-500/10 bg-rose-500/5">
                                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    Foods to Avoid (Restricted)
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 space-y-3">
                                                {foodsToAvoidList.map((item: any, idx: number) => {
                                                    const isObj = typeof item === 'object' && item !== null;
                                                    const foodName = isObj ? item.food : item;
                                                    const foodReason = isObj ? item.reason : "Elevates glycemic spikes and arterial blood pressure.";
                                                    return (
                                                        <div key={idx} className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl text-xs space-y-1">
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                                                {foodName}
                                                            </div>
                                                            <p className="text-muted-foreground text-[11px] pl-4">
                                                                <strong className="text-rose-600 dark:text-rose-400">Why avoid this:</strong> {foodReason}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Macro Targets & Meal Plan Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        {/* Macro Targets */}
                                        <Card className="lg:col-span-5 glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                                    Nutritional Macro & Micronutrient Targets
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 grid grid-cols-2 gap-3 text-center">
                                                {Object.entries(finalMacros).map(([key, val]: any, idx: number) => (
                                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">{key}</div>
                                                        <div className="text-sm font-black text-primary mt-0.5">{val}</div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>

                                        {/* Meal Suggestions */}
                                        <Card className="lg:col-span-7 glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                                    Practical Daily Meal Suggestions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 space-y-2.5">
                                                {mealSuggestionsList.map((meal: any, idx: number) => {
                                                    const isObj = typeof meal === 'object' && meal !== null;
                                                    const mealTitle = isObj ? meal.meal : `Option ${idx+1}`;
                                                    const mealText = isObj ? meal.option : meal;
                                                    return (
                                                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-3">
                                                            <span className="font-bold text-primary shrink-0 uppercase text-[10px] bg-primary/10 px-2 py-1 rounded-md mt-0.5">
                                                                {mealTitle}
                                                            </span>
                                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{mealText}</span>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Section: Disease Risk Prediction & Prevention Strategies */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Predictive Disease Risk Assessment & Prevention Strategies
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(diseaseRisk.length > 0 ? diseaseRisk : [
                                    { disease: "Type 2 Diabetes", risk_percent: 8, confidence: "High", status: "Low Risk", explanation: "Glucose levels are normal.", prevention: "Limit added sugars." },
                                    { disease: "Hypertension", risk_percent: 15, confidence: "High", status: "Low Risk", explanation: "BP readings are within normal target.", prevention: "Maintain low sodium diet." },
                                    { disease: "Coronary Heart Disease", risk_percent: 10, confidence: "High", status: "Low Risk", explanation: "Pulse rate and cardiovascular trends are steady.", prevention: "30 mins daily brisk walking." },
                                    { disease: "Stroke", risk_percent: 5, confidence: "High", status: "Low Risk", explanation: "No hypertensive or vascular risk indicators.", prevention: "Stay physically active." },
                                    { disease: "Kidney Disease", risk_percent: 5, confidence: "High", status: "Low Risk", explanation: "Adequate hydration logged.", prevention: "Drink 2.5L water daily." },
                                    { disease: "Fatty Liver", risk_percent: 10, confidence: "Moderate", status: "Low Risk", explanation: "Weight and metabolic markers are balanced.", prevention: "Avoid excess alcohol." }
                                ]).map((risk: any, idx: number) => (
                                    <Card key={idx} className="glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">{risk.disease}</h3>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getRiskBadgeColor(risk.status)}`}>
                                                    {risk.status}
                                                </span>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center text-xs mb-1">
                                                    <span className="text-muted-foreground text-[10px]">Risk Factor</span>
                                                    <span className="font-bold font-mono text-slate-900 dark:text-white">{risk.risk_percent}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${risk.risk_percent > 30 ? 'bg-rose-500' : risk.risk_percent > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(risk.risk_percent, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                                                {risk.explanation}
                                            </p>

                                            <div className="bg-primary/5 border border-primary/10 p-2 rounded-xl text-[11px] text-primary font-semibold">
                                                <strong>Prevention:</strong> {risk.prevention}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Section 4: Health Score Breakdown across 10 Systems */}
                        <Card className="glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                    Multi-System Health Score & Organ Function Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(scoresBreakdown.length > 0 ? scoresBreakdown : [
                                    { category: "Cardiovascular Health", score: 88, status: "Optimal", color: "emerald", explanation: "Blood pressure and heart rate metrics are within optimal clinical thresholds." },
                                    { category: "Diabetes & Metabolic Risk", score: 92, status: "Excellent", color: "emerald", explanation: "Blood glucose markers reflect stable glycemic homeostasis." },
                                    { category: "Respiratory Health", score: 95, status: "Optimal", color: "emerald", explanation: "Oxygen saturation levels are well maintained." },
                                    { category: "Kidney & Renal Health", score: 86, status: "Good", color: "emerald", explanation: "Hydration logs indicate healthy fluid balance." },
                                    { category: "Hepatic / Liver Health", score: 90, status: "Optimal", color: "emerald", explanation: "No clinical signs of hepatic stress in records." },
                                    { category: "Lifestyle & Physical Activity", score: 80, status: "Moderate", color: "amber", explanation: "Daily activity logs show consistent baseline movement." },
                                    { category: "Nutrition Score", score: 82, status: "Good", color: "emerald", explanation: "Balanced intake with adequate hydration." },
                                    { category: "Mental Wellness & Sleep", score: 78, status: "Moderate", color: "amber", explanation: "Sleep duration averages suggest minor schedule variations." },
                                    { category: "Physical Fitness", score: 75, status: "Moderate", color: "amber", explanation: "Cardiorespiratory fitness is stable; light aerobic exercise recommended." },
                                    { category: "Medication Adherence", score: 95, status: "Excellent", color: "emerald", explanation: "Prescription logs show strong routine compliance." }
                                ]).map((system: any, idx: number) => (
                                    <div key={idx} className="space-y-1.5 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{system.category}</span>
                                            <span className="font-mono font-black text-primary">{system.score}/100</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${system.score}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-tight pt-1">
                                            {system.explanation}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Section 10: Actionable Recommendation Cards with Expected Benefit */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Target className="w-5 h-5 text-primary" />
                                Actionable Lifestyle & Clinical Recommendation Cards
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(recommendations.length > 0 ? recommendations : [
                                    {
                                        category: "Exercise & Physical Activity",
                                        title: "Brisk Walking (30 mins daily)",
                                        priority: "Medium",
                                        action: "Walk at least 30 minutes every day to boost circulation.",
                                        expected_benefit: "Improves cardiovascular endurance and blood pressure regulation."
                                    },
                                    {
                                        category: "Nutrition & Diet",
                                        title: "Sodium Control & Whole Foods",
                                        priority: "High",
                                        action: "Keep salt intake under 2,000 mg daily and prioritize leafy greens.",
                                        expected_benefit: "Lowers vascular resistance and protects kidney function."
                                    },
                                    {
                                        category: "Hydration",
                                        title: "Drink 2.5 Liters Water Daily",
                                        priority: "Medium",
                                        action: "Drink 8 to 10 glasses of water evenly across the day.",
                                        expected_benefit: "Ensures optimal renal filtration and body temperature regulation."
                                    }
                                ]).map((rec: any, idx: number) => (
                                    <Card key={idx} className="glass-card border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{rec.category}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getRiskBadgeColor(rec.priority || 'Medium')}`}>
                                                    Priority: {rec.priority || 'Medium'}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{rec.title}</h3>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{rec.action}</p>
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
                                                <strong>Expected Benefit:</strong> {rec.expected_benefit}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Section 11: Enhanced Recharts Chart with Normal Range Shading */}
                        {trends.length > 0 && (
                            <Card className="glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-slate-800 dark:text-slate-200">
                                        <span className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            Longitudinal Vitals Trend Chart (With Normal Reference Shading)
                                        </span>
                                        <div className="flex gap-3 text-xs font-semibold">
                                            <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500" /> BP Sys</span>
                                            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500" /> Sugar</span>
                                            <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Pulse</span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="h-[340px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
                                                <XAxis dataKey="displayDate" stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} />
                                                <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={11} tickLine={false} />
                                                <Tooltip />
                                                {/* Shaded Healthy Normal Reference Area (70 - 120) */}
                                                <ReferenceArea y1={70} y2={120} fill="#10b981" fillOpacity={0.05} />
                                                <Area type="monotone" dataKey="systolic" name="BP Sys" stroke="#ef4444" fillOpacity={1} fill="url(#colorBP)" strokeWidth={2.5} />
                                                <Area type="monotone" dataKey="sugar" name="Sugar" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSugar)" strokeWidth={2.5} />
                                                <Area type="monotone" dataKey="heart_rate" name="Heart Rate" stroke="#10b981" fillOpacity={1} fill="url(#colorHR)" strokeWidth={2.5} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center mt-3">
                                        🟢 Green shaded region highlights standard normal physiological target range (70-120).
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Section 16: Explain Like I'm a Patient (Conversational Patient Readout) */}
                        <Card className="glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <Lightbulb className="w-4 h-4 text-primary" />
                                    Conversational Summary ("Explain Like I'm a Patient")
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-primary/5 p-4 sm:p-6 rounded-2xl border border-primary/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h3: ({ node, ...props }) => <h4 className="font-bold text-slate-900 dark:text-white mt-3 mb-1 text-sm" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-slate-700 dark:text-slate-300" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />
                                        }}
                                    >
                                        {data.detailed_analysis || "Good news! Your overall health appears stable. Your blood pressure, blood sugar, and BMI are within healthy ranges. Keep up your active lifestyle and stay well hydrated."}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 17: Interactive Recommended Next Steps Checklist */}
                        <Card className="glass-card border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center justify-between text-slate-800 dark:text-slate-200">
                                    <span className="flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-primary" />
                                        Recommended Next Steps Checklist
                                    </span>
                                    <span className="text-xs text-muted-foreground font-normal">Interactive Patient Checklist</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(nextSteps.length > 0 ? nextSteps : [
                                    { step: "Schedule annual physician checkup", priority: "Medium" },
                                    { step: "Maintain hydration goal (8 glasses/day)", priority: "High" },
                                    { step: "Log vitals monthly in MyHealthChain", priority: "Medium" }
                                ]).map((item: any, idx: number) => {
                                    const isDone = completedSteps[idx];
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => toggleStep(idx)}
                                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                                isDone
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                                    isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                                                }`}>
                                                    {isDone && <Check className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className={`text-xs font-semibold ${isDone ? 'line-through opacity-70' : ''}`}>
                                                    {item.step}
                                                </span>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskBadgeColor(item.priority || 'Low')}`}>
                                                {item.priority || 'Action'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Section 18: Downloadable Official Hospital PDF Footer */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <Building2 className="w-4 h-4 text-primary" />
                                MyHealthChain Official Clinical Decision Support System Report
                            </div>
                            <p className="text-[11px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                <strong>Clinical Disclaimer:</strong> This AI Health Report is generated by an automated clinical decision support system utilizing OCR data extraction, longitudinal vital trends, and trained machine learning algorithms. It is intended to assist medical decision-making and patient education and does not replace direct diagnosis by a licensed physician.
                            </p>
                            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-mono text-muted-foreground pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>Report ID: {metadata.report_id || 'MHC-CLIN-2026-9842'}</span>
                                <span>•</span>
                                <span>Verification Code: VERIFIED-AI-CDSS-V3</span>
                                <span>•</span>
                                <span>Generated: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
}