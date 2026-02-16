import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function PublicLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = params;

    // Since this is a server component, we fetch metadata for the organization
    const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!organization) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative flex flex-col">
                {/* Mobile Header */}
                <header className="p-6 border-b text-center space-y-2">
                    {organization.logo_url ? (
                        <img
                            src={organization.logo_url}
                            alt={organization.name}
                            className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-purple-100"
                        />
                    ) : (
                        <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                            {organization.name.charAt(0)}
                        </div>
                    )}
                    <h1 className="text-xl font-bold">{organization.name}</h1>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Portal de Reservas</p>
                </header>

                <main className="flex-1 p-6">
                    {children}
                </main>

                <footer className="p-4 text-center border-t bg-slate-50">
                    <p className="text-[10px] text-slate-400">
                        Desarrollado con ❤️ por Agendador PRO
                    </p>
                </footer>
            </div>
        </div>
    );
}
