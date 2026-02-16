'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    Users,
    User,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProfessionalSelection({ params }: { params: { slug: string } }) {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = params;

    useEffect(() => {
        fetchProfessionals();
    }, [slug]);

    async function fetchProfessionals() {
        try {
            const { data: org } = await supabase
                .from('organizations')
                .select('id')
                .eq('slug', slug)
                .single();

            if (org) {
                const { data, error } = await supabase
                    .from('professionals')
                    .select('*')
                    .eq('organization_id', org.id)
                    .order('name');

                if (error) throw error;
                setProfessionals(data || []);
            }
        } catch (error: any) {
            toast.error('Error al cargar profesionales');
        } finally {
            setLoading(false);
        }
    }

    const handleSelectProfessional = (pro: any) => {
        const existingState = JSON.parse(sessionStorage.getItem('booking_state') || '{}');
        const newState = {
            ...existingState,
            professionalId: pro?.id || null,
            professionalName: pro?.name || 'Cualquiera',
        };
        sessionStorage.setItem('booking_state', JSON.stringify(newState));
        router.push(`/${slug}/calendario`);
    };

    if (loading) return <div className="text-center py-12 text-slate-400">Cargando equipo...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-900">Elige quién te atenderá</h2>
                    <p className="text-sm text-slate-500">O selecciona "Cualquiera" para ver más horarios.</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* "Any" option */}
                <Card
                    className="group cursor-pointer border-dashed hover:border-purple-300 transition-all hover:bg-purple-50/30"
                    onClick={() => handleSelectProfessional(null)}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 transition-colors">Cualquiera</h3>
                                <p className="text-xs text-slate-500">Muestra toda la disponibilidad</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </CardContent>
                </Card>

                {professionals.map((pro) => (
                    <Card
                        key={pro.id}
                        className="group cursor-pointer hover:border-purple-300 transition-all hover:bg-purple-50/30"
                        onClick={() => handleSelectProfessional(pro)}
                    >
                        <div
                            className="h-1.5 w-full bg-slate-100 group-hover:bg-purple-200 transition-colors"
                            style={{ backgroundColor: pro.color_code }}
                        />
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                                        {pro.name}
                                    </h3>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
