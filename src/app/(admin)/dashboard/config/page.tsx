'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Building2,
    Globe,
    Clock,
    MessageSquare,
    Save,
    Loader2
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type Organization = Database['public']['Tables']['organizations']['Row'];

export default function ConfigPage() {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [timezone, setTimezone] = useState('UTC');

    useEffect(() => {
        fetchOrg();
    }, []);

    async function fetchOrg() {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setOrganization(data);
                setName(data.name);
                setSlug(data.slug);
                setWhatsapp(data.whatsapp_number || '');
                setTimezone(data.timezone);
            }
        } catch (error: any) {
            toast.error('Error al cargar configuración: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name,
                slug,
                whatsapp_number: whatsapp,
                timezone,
                updated_at: new Date().toISOString(),
            };

            let error;
            if (organization) {
                const { error: updateError } = await supabase
                    .from('organizations')
                    .update(payload)
                    .eq('id', organization.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('organizations')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;
            toast.success('Configuración guardada exitosamente');
            fetchOrg();
        } catch (error: any) {
            toast.error('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
                <p className="text-slate-500">Ajusta los detalles de tu negocio y las reglas de la plataforma.</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                Perfil del Negocio
                            </CardTitle>
                            <CardDescription>
                                Información básica que verán tus clientes en el portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre comercial</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej. Barbería Los Tigres"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Nombre de usuario (URL slug)</Label>
                                    <div className="flex items-center">
                                        <span className="bg-slate-100 border border-r-0 px-3 py-2 rounded-l-md text-slate-500 text-sm">
                                            agendador.pro/
                                        </span>
                                        <Input
                                            id="slug"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                            className="rounded-l-none"
                                            placeholder="barberia-los-tigres"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">Número de WhatsApp (Notificaciones)</Label>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-green-500" />
                                    <Input
                                        id="whatsapp"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="Ej. +573001234567"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                Reglas de Tiempo
                            </CardTitle>
                            <CardDescription>
                                Configura tu zona horaria para que las citas coincidan con tu reloj local.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Zona Horaria</Label>
                                <Select value={timezone} onValueChange={setTimezone}>
                                    <SelectTrigger id="timezone">
                                        <SelectValue placeholder="Selecciona una zona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                                        <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                                        <SelectItem value="UTC">UTC (Universal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-purple-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-purple-900 text-lg">Tu Enlace Público</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-purple-700 mb-4">
                                Este es el enlace que debes compartir con tus clientes para que agenden sus citas.
                            </p>
                            <div className="bg-white p-3 rounded border border-purple-200 text-sm font-mono text-purple-600 break-all">
                                {slug ? `agendador.pro/${slug}` : 'Configura un slug arriba'}
                            </div>
                            {slug && (
                                <Button variant="link" className="mt-2 p-0 h-auto text-purple-700" asChild>
                                    <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        Vista previa del portal
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSave}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
}
