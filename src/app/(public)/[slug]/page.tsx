'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    Clock,
    DollarSign,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function BusinessLanding({ params }: { params: { slug: string } }) {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = params;

    useEffect(() => {
        fetchServices();
    }, [slug]);

    async function fetchServices() {
        try {
            // Get org id by slug first
            const { data: org } = await supabase
                .from('organizations')
                .select('id')
                .eq('slug', slug)
                .single();

            if (org) {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('organization_id', org.id)
                    .eq('is_active', true)
                    .order('name');

                if (error) throw error;
                setServices(data || []);
            }
        } catch (error: any) {
            toast.error('Error al cargar servicios');
        } finally {
            setLoading(false);
        }
    }

    const handleSelectService = (service: any) => {
        // Save booking state
        const bookingState = {
            serviceId: service.id,
            serviceName: service.name,
            duration: service.duration_minutes,
            price: service.price,
        };
        sessionStorage.setItem('booking_state', JSON.stringify(bookingState));
        router.push(`/${slug}/profesional`);
    };

    if (loading) return <div className="text-center py-12 text-slate-400">Cargando servicios...</div>;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Selecciona un servicio</h2>
                <p className="text-sm text-slate-500">¿Qué te gustaría hacerte hoy?</p>
            </div>

            <div className="space-y-3">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className="group cursor-pointer hover:border-purple-300 transition-all hover:bg-purple-50/30"
                        onClick={() => handleSelectService(service)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {service.duration_minutes} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {service.price}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {services.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic border rounded-xl border-dashed">
                        No hay servicios disponibles en este momento.
                    </div>
                )}
            </div>
        </div>
    );
}
