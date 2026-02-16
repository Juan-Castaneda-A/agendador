'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Search,
    User,
    Phone,
    Calendar,
    MoreVertical,
    ClipboardList
} from 'lucide-react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type Customer = Database['public']['Tables']['customers']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];

export default function ClientesPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerHistory, setCustomerHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        setLoading(true);
        try {
            const { data: orgs } = await supabase.from('organizations').select('id').limit(1);
            if (!orgs || orgs.length === 0) return;

            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('organization_id', orgs[0].id)
                .order('full_name');

            if (error) throw error;
            setCustomers(data || []);
        } catch (error: any) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCustomerDetails(customer: Customer) {
        setSelectedCustomer(customer);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
          *,
          services (name),
          professionals (name)
        `)
                .eq('customer_id', customer.id)
                .order('start_time', { ascending: false });

            if (error) throw error;
            setCustomerHistory(data || []);
        } catch (error: any) {
            toast.error('Error al cargar historial: ' + error.message);
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.whatsapp_number.includes(search)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
                <p className="text-slate-500">Gestiona la base de datos de tus clientes e historial de citas.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre o WhatsApp..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[600px] md:min-w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead>Última Cita</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                {customer.full_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone className="w-3.5 h-3.5" />
                                                {customer.whatsapp_number}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500">
                                            {/* Placeholder for real last appointment date logic */}
                                            Próximamente
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => fetchCustomerDetails(customer)}
                                            >
                                                Ver Historial
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCustomers.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                            No se encontraron clientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Customer Detail Dialog */}
            <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedCustomer?.full_name}</DialogTitle>
                        <DialogDescription>
                            WhatsApp: {selectedCustomer?.whatsapp_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-purple-600" />
                                Notas Internas
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-lg border text-sm text-slate-600 italic">
                                {selectedCustomer?.internal_notes || "Sin notas adicionales."}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                Historial de Citas
                            </h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {customerHistory.map((apt) => (
                                    <div key={apt.id} className="p-3 border rounded-lg flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium">{(apt.services as any)?.name}</p>
                                            <p className="text-slate-500">Con {(apt.professionals as any)?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {new Date(apt.start_time).toLocaleDateString()}
                                            </p>
                                            <p className={apt.status === 'completed' ? 'text-green-600' : 'text-slate-400'}>
                                                {apt.status === 'completed' ? 'Completado' : 'Pendiente'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {customerHistory.length === 0 && (
                                    <p className="text-center text-slate-500 py-4">Este cliente no tiene citas registradas.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
