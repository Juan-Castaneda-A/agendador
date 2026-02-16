'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    format,
    addDays,
    startOfDay,
    endOfDay,
    eachHourOfInterval,
    setHours,
    setMinutes,
    isBefore,
    addMinutes,
    isAfter,
    parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CalendarSelection({ params }: { params: Promise<{ slug: string }> }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookingState, setBookingState] = useState<any>(null);
    const router = useRouter();
    const { slug } = use(params);

    useEffect(() => {
        const state = JSON.parse(sessionStorage.getItem('booking_state') || '{}');
        if (!state.serviceId) {
            router.push(`/${slug}`);
            return;
        }
        setBookingState(state);
    }, []);

    useEffect(() => {
        if (date && bookingState) {
            calculateAvailability();
        }
    }, [date, bookingState]);

    async function calculateAvailability() {
        if (!date || !bookingState) return;
        setLoading(true);
        try {
            // 1. Get organization rules (should be from DB, but using 9-18 for MVP)
            const startHour = 9;
            const endHour = 18;

            // 2. Fetch existing appointments for the day
            const query = supabase
                .from('appointments')
                .select('start_time, end_time')
                .eq('organization_id', (await getOrgId()))
                .gte('start_time', startOfDay(date).toISOString())
                .lte('start_time', endOfDay(date).toISOString())
                .neq('status', 'cancelled');

            if (bookingState.professionalId) {
                query.eq('professional_id', bookingState.professionalId);
            }

            const { data: existingAppts } = await query;

            // 3. Generate slots of the service duration
            const slots: Date[] = [];
            let currentSlot = setMinutes(setHours(startOfDay(date), startHour), 0);
            const dayEnd = setMinutes(setHours(startOfDay(date), endHour), 0);

            const now = new Date();

            while (isBefore(currentSlot, dayEnd)) {
                const slotEnd = addMinutes(currentSlot, bookingState.duration);

                // Check if slot is in the past
                const isPast = isBefore(currentSlot, now);

                // Check for collisions
                const hasCollision = existingAppts?.some(appt => {
                    const apptStart = parseISO(appt.start_time);
                    const apptEnd = parseISO(appt.end_time);
                    return (
                        (isAfter(currentSlot, apptStart) || currentSlot.getTime() === apptStart.getTime()) &&
                        isBefore(currentSlot, apptEnd)
                    );
                });

                if (!hasCollision && !isPast) {
                    slots.push(new Date(currentSlot));
                }

                currentSlot = addMinutes(currentSlot, 30); // 30 min intervals
            }

            setAvailableSlots(slots);
        } catch (error) {
            toast.error('Error al calcular disponibilidad');
        } finally {
            setLoading(false);
        }
    }

    async function getOrgId() {
        const { data } = await supabase.from('organizations').select('id').eq('slug', slug).single();
        return data?.id;
    }

    const handleConfirmSlot = () => {
        if (!selectedSlot) return;
        const newState = {
            ...bookingState,
            startTime: selectedSlot.toISOString(),
            endTime: addMinutes(selectedSlot, bookingState.duration).toISOString(),
        };
        sessionStorage.setItem('booking_state', JSON.stringify(newState));
        router.push(`/${slug}/confirmar`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-900">Fecha y Hora</h2>
                    <p className="text-sm text-slate-500">
                        {bookingState?.serviceName} con {bookingState?.professionalName}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < startOfDay(new Date())}
                    className="rounded-md mx-auto"
                    locale={es}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Horarios Disponibles
                </h3>

                {loading ? (
                    <div className="grid grid-cols-3 gap-2 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-10 bg-slate-100 rounded-lg"></div>
                        ))}
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                            <Button
                                key={slot.toISOString()}
                                variant={selectedSlot?.getTime() === slot.getTime() ? 'default' : 'outline'}
                                className={cn(
                                    "h-11 font-medium transition-all",
                                    selectedSlot?.getTime() === slot.getTime()
                                        ? "bg-purple-600 hover:bg-purple-700 shadow-md"
                                        : "hover:border-purple-300"
                                )}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {format(slot, 'HH:mm')}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No hay horarios disponibles para este día.
                    </div>
                )}
            </div>

            {selectedSlot && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-2xl md:relative md:bg-transparent md:border-t-0 md:p-0 md:shadow-none">
                    <Button
                        className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg rounded-xl flex items-center justify-between px-6"
                        onClick={handleConfirmSlot}
                    >
                        <span>Confirmar Horario</span>
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            )}
        </div>
    );
}
