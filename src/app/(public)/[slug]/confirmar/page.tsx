'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    format,
    parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ArrowLeft,
    User,
    Phone,
    CheckCircle2,
    Loader2,
    CalendarDays,
    Clock,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function BookingConfirmation({ params }: { params: { slug: string } }) {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingState, setBookingState] = useState<any>(null);
    const router = useRouter();
    const { slug } = params;

    useEffect(() => {
        const state = JSON.parse(sessionStorage.getItem('booking_state') || '{}');
        if (!state.startTime) {
            router.push(`/${slug}/calendario`);
            return;
        }
        setBookingState(state);
    }, []);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Get Organization ID
            const { data: org } = await supabase
                .from('organizations')
                .select('id')
                .eq('slug', slug)
                .single();

            if (!org) throw new Error('Organización no encontrada');

            // 2. Upsert Customer
            let customerId;
            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('organization_id', org.id)
                .eq('whatsapp_number', whatsapp)
                .maybeSingle();

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                const { data: newCustomer, error: custError } = await supabase
                    .from('customers')
                    .insert([{
                        organization_id: org.id,
                        full_name: name,
                        whatsapp_number: whatsapp
                    }])
                    .select()
                    .single();

                if (custError) throw custError;
                customerId = newCustomer.id;
            }

            // 3. Create Appointment
            const { data: appointment, error: apptError } = await supabase
                .from('appointments')
                .insert([{
                    organization_id: org.id,
                    customer_id: customerId,
                    service_id: bookingState.serviceId,
                    professional_id: bookingState.professionalId,
                    start_time: bookingState.startTime,
                    end_time: bookingState.endTime,
                    status: 'confirmed'
                }])
                .select()
                .single();

            if (apptError) throw apptError;

            // 4. Success!
            toast.success('¡Reserva confirmada!');
            sessionStorage.setItem('last_booking', JSON.stringify(appointment));
            router.push(`/${slug}/exito`);
        } catch (error: any) {
            toast.error('Error al procesar la reserva: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!bookingState) return null;

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-900">Finalizar Reserva</h2>
                    <p className="text-sm text-slate-500">Completa tus datos para confirmar.</p>
                </div>
            </div>

            <Card className="border-purple-100 bg-purple-50/50">
                <CardContent className="p-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-purple-900">
                        <CheckCircle2 className="w-4 h-4" />
                        Resumen de tu turno
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-slate-600">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5" />
                            {bookingState.serviceName} (${bookingState.price})
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {format(parseISO(bookingState.startTime), "EEEE, d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {format(parseISO(bookingState.startTime), "HH:mm")}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" />
                            Atendido por: <span className="font-medium text-slate-800">{bookingState.professionalName}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tu Nombre Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="name"
                                className="pl-10 h-12"
                                placeholder="Ej. Carlos Ruiz"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="whatsapp"
                                className="pl-10 h-12"
                                placeholder="Ej. +57 300 123 4567"
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">
                            Te enviaremos un recordatorio por este medio.
                        </p>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-2xl md:relative md:bg-transparent md:border-t-0 md:p-0 md:shadow-none">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg rounded-xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            'Confirmar Mi Reserva'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
