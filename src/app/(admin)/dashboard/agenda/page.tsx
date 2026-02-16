'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    format,
    addDays,
    subDays,
    startOfDay,
    endOfDay,
    isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
    customers: { full_name: string; whatsapp_number: string };
    services: { name: string; duration_minutes: number; price: number };
    professionals: { name: string; color_code: string };
};

export default function AgendaPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    async function fetchAppointments() {
        setLoading(true);
        try {
            const { data: orgs } = await supabase.from('organizations').select('id').limit(1);
            if (!orgs || orgs.length === 0) return;

            const { data, error } = await supabase
                .from('appointments')
                .select(`
          *,
          customers (full_name, whatsapp_number),
          services (name, duration_minutes, price),
          professionals (name, color_code)
        `)
                .eq('organization_id', orgs[0].id)
                .gte('start_time', startOfDay(selectedDate).toISOString())
                .lte('start_time', endOfDay(selectedDate).toISOString())
                .order('start_time');

            if (error) throw error;
            setAppointments(data as any || []);
        } catch (error: any) {
            toast.error('Error al cargar citas: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Cita actualizada a ${status}`);
            fetchAppointments();
        } catch (error: any) {
            toast.error('Error: ' + error.message);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
            default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Confirmada';
            case 'cancelled': return 'Cancelada';
            case 'completed': return 'Finalizada';
            default: return 'Pendiente';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Agenda Maestra</h1>
                    <p className="text-slate-500 capitalize">
                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="font-medium px-4"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        Hoy
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                        Cargando citas...
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <Card key={apt.id} className="overflow-hidden border-l-4" style={{ borderColor: apt.professionals.color_code }}>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Time Section */}
                                    <div className="w-full md:w-32 bg-slate-50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r">
                                        <span className="text-lg font-bold text-slate-700">
                                            {format(new Date(apt.start_time), 'HH:mm')}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {apt.services.duration_minutes} min
                                        </span>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-lg">{apt.customers.full_name}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider",
                                                    apt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                                                        apt.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                                            apt.status === 'completed' ? "bg-blue-100 text-blue-700" :
                                                                "bg-yellow-100 text-yellow-700"
                                                )}>
                                                    {getStatusLabel(apt.status)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <BriefcaseIcon className="w-3.5 h-3.5" />
                                                    {apt.services.name}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5" />
                                                    {apt.professionals.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        {getStatusIcon(apt.status)}
                                                        Cambiar Estado
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => updateStatus(apt.id, 'confirmed')}>
                                                        Marcar como Confirmada
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(apt.id, 'completed')}>
                                                        Marcar como Finalizada
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(apt.id, 'cancelled')} className="text-red-600">
                                                        Cancelar Cita
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <CalendarIcon className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-slate-900">Sin citas para hoy</h3>
                            <p className="text-slate-500 max-w-sm">
                                No hay ninguna reserva registrada para el {format(selectedDate, "d 'de' MMMM", { locale: es })}.
                            </p>
                        </div>
                        {isSameDay(selectedDate, new Date()) && (
                            <Button variant="outline" className="mt-4">
                                Crear Cita Manual
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function BriefcaseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
    );
}
