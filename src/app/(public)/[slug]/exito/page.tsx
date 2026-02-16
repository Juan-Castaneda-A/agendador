'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Calendar,
    Clock,
    MessageSquare,
    Home,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BookingSuccess({ params }: { params: Promise<{ slug: string }> }) {
    const [appointment, setAppointment] = useState<any>(null);
    const [organization, setOrganization] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { slug } = use(params);

    useEffect(() => {
        const last = sessionStorage.getItem('last_booking');
        if (last) {
            setAppointment(JSON.parse(last));
        }
        fetchOrg();
    }, [slug]);

    async function fetchOrg() {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('name, whatsapp_number')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setOrganization(data);
        } catch (error) {
            console.error('Error fetching org:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleWhatsAppClick = () => {
        if (!organization?.whatsapp_number) {
            toast.error('El negocio no tiene un número de WhatsApp configurado.');
            return;
        }

        const dateStr = appointment
            ? format(parseISO(appointment.start_time), "EEEE d 'de' MMMM", { locale: es })
            : '';
        const timeStr = appointment
            ? format(parseISO(appointment.start_time), "HH:mm")
            : '';

        const message = `Hola! Acabo de agendar una cita en *${organization.name}*.\n\n📅 *Fecha:* ${dateStr}\n⏰ *Hora:* ${timeStr}\n\nQuedo atento(a) a la confirmación.`;
        const encodedMessage = encodeURIComponent(message);

        // Clean numbers for whatsapp (remove +, spaces, etc if necessary, but wa.me handles some)
        const cleanNumber = organization.whatsapp_number.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    };

    if (loading && !appointment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <p className="mt-4 text-slate-500">Cargando detalles de tu reserva...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                <CheckCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900">¡Reserva Exitosa!</h1>
                <p className="text-slate-500">
                    Tu cita ha sido agendada correctamente. Te esperamos pronto.
                </p>
            </div>

            <Card className="w-full bg-slate-50 border-slate-200">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-purple-600 shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fecha</p>
                            <p className="font-bold text-slate-900 capitalize">
                                {appointment ? format(parseISO(appointment.start_time), "EEEE, d 'de' MMMM", { locale: es }) : '...'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-purple-600 shadow-sm">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hora</p>
                            <p className="font-bold text-slate-900">
                                {appointment ? format(parseISO(appointment.start_time), "HH:mm") : '...'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 w-full">
                <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg shadow-green-100 transform transition-transform active:scale-95"
                >
                    <MessageSquare className="w-6 h-6" />
                    Escribir por WhatsApp
                </Button>

                <Link href={`/${slug}`} className="block w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600">
                        <Home className="w-5 h-5" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>

            <div className="text-sm text-slate-400 bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-start gap-3 text-left">
                <span className="text-xl">💡</span>
                <p>
                    <b>Tip:</b> Guarda esta pantalla o el enlace único que te llegará por WhatsApp para gestionar tu cita.
                </p>
            </div>
        </div>
    );
}
