'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Calendar,
    Clock,
    MapPin,
    MessageSquare,
    ArrowRight,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function BookingSuccess({ params }: { params: Promise<{ slug: string }> }) {
    const [appointment, setAppointment] = useState<any>(null);
    const { slug } = use(params);

    useEffect(() => {
        const last = sessionStorage.getItem('last_booking');
        if (last) {
            setAppointment(JSON.parse(last));
        }
    }, []);

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
                        <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-purple-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fecha</p>
                            <p className="font-bold text-slate-900 capitalize">
                                {appointment ? format(parseISO(appointment.start_time), "EEEE, d 'de' MMMM", { locale: es }) : 'Cargando...'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-purple-600">
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
                <Button className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Escribir por WhatsApp
                </Button>

                <Link href={`/${slug}`} className="block">
                    <Button variant="outline" className="w-full h-12 rounded-xl flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>

            <p className="text-sm text-slate-400 bg-slate-100 p-4 rounded-lg">
                💡 <b>Tip:</b> Guarda esta pantalla o el enlace único que te llegará por WhatsApp para gestionar tu cita.
            </p>
        </div>
    );
}
