'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Search,
    MoreVertical,
    Trash2,
    Pencil,
    Briefcase,
    Users,
    Clock,
    DollarSign
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];
type Professional = Database['public']['Tables']['professionals']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];

export default function CatalogoPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
    const [isProfessionalDialogOpen, setIsProfessionalDialogOpen] = useState(false);

    // Form states
    const [serviceName, setServiceName] = useState('');
    const [serviceDuration, setServiceDuration] = useState('30');
    const [servicePrice, setServicePrice] = useState('');
    const [profName, setProfName] = useState('');
    const [profColor, setProfColor] = useState('#3b82f6');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            // 1. Get Organization
            const { data: orgs, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .limit(1);

            if (orgError) throw orgError;

            if (orgs && orgs.length > 0) {
                setOrganization(orgs[0]);

                // 2. Get Services
                const { data: srvs, error: srvError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('organization_id', orgs[0].id)
                    .order('name');

                if (srvError) throw srvError;
                setServices(srvs || []);

                // 3. Get Professionals
                const { data: pros, error: proError } = await supabase
                    .from('professionals')
                    .select('*')
                    .eq('organization_id', orgs[0].id)
                    .order('name');

                if (proError) throw proError;
                setProfessionals(pros || []);
            }
        } catch (error: any) {
            toast.error('Error al cargar datos: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;

        try {
            const { data, error } = await supabase
                .from('services')
                .insert([
                    {
                        organization_id: organization.id,
                        name: serviceName,
                        duration_minutes: parseInt(serviceDuration),
                        price: parseFloat(servicePrice),
                    }
                ])
                .select();

            if (error) throw error;

            toast.success('Servicio creado correctamente');
            setServices([...services, data[0]]);
            setIsServiceDialogOpen(false);
            setServiceName('');
            setServicePrice('');
        } catch (error: any) {
            toast.error('Error: ' + error.message);
        }
    };

    const handleCreateProfessional = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;

        try {
            const { data, error } = await supabase
                .from('professionals')
                .insert([
                    {
                        organization_id: organization.id,
                        name: profName,
                        color_code: profColor,
                    }
                ])
                .select();

            if (error) throw error;

            toast.success('Profesional añadido correctamente');
            setProfessionals([...professionals, data[0]]);
            setIsProfessionalDialogOpen(false);
            setProfName('');
        } catch (error: any) {
            toast.error('Error: ' + error.message);
        }
    };

    const createInitialOrg = async () => {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .insert([{ name: 'Mi Negocio', slug: 'mi-negocio' }])
                .select();
            if (error) throw error;
            setOrganization(data[0]);
            toast.success('Organización inicial creada');
        } catch (error: any) {
            toast.error('Error al crear organización: ' + error.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando catálogo...</div>;

    if (!organization) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <h2 className="text-2xl font-bold">¡Bienvenido!</h2>
                <p className="text-slate-500">Primero necesitamos configurar tu negocio.</p>
                <Button onClick={createInitialOrg}>Crear Perfil del Negocio</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Catálogo</h1>
                    <p className="text-slate-500">Gestiona tus servicios y el equipo de trabajo.</p>
                </div>
            </div>

            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="services" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Servicios
                    </TabsTrigger>
                    <TabsTrigger value="professionals" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Equipo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Buscar servicio..." className="pl-10" />
                        </div>
                        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Servicio
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateService} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del servicio</Label>
                                        <Input
                                            id="name"
                                            placeholder="Ej. Corte de Cabello"
                                            value={serviceName}
                                            onChange={(e) => setServiceName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duración (minutos)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={serviceDuration}
                                                onChange={(e) => setServiceDuration(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Precio ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={servicePrice}
                                                onChange={(e) => setServicePrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="bg-purple-600 w-full">Guardar Servicio</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <Card key={service.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg">{service.name}</h3>
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
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {services.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed rounded-xl">
                                No hay servicios creados todavía.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="professionals" className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Buscar profesional..." className="pl-10" />
                        </div>
                        <Dialog open={isProfessionalDialogOpen} onOpenChange={setIsProfessionalDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Profesional
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Nuevo Profesional</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateProfessional} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="prof-name">Nombre completo</Label>
                                        <Input
                                            id="prof-name"
                                            placeholder="Ej. Juan Pérez"
                                            value={profName}
                                            onChange={(e) => setProfName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color identificador</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="color"
                                                type="color"
                                                className="w-12 p-1"
                                                value={profColor}
                                                onChange={(e) => setProfColor(e.target.value)}
                                            />
                                            <Input
                                                value={profColor}
                                                onChange={(e) => setProfColor(e.target.value)}
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="bg-purple-600 w-full">Añadir al Equipo</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {professionals.map((pro) => (
                            <Card key={pro.id} className="overflow-hidden">
                                <div
                                    className="h-2 w-full"
                                    style={{ backgroundColor: pro.color_code }}
                                />
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold">{pro.name}</h3>
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8 px-2">
                                            <Pencil className="w-3.5 h-3.5 mr-1" />
                                            Editar
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {professionals.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed rounded-xl">
                                No hay profesionales en el equipo.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
