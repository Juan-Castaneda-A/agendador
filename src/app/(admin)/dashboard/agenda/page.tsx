export default function AgendaPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Agenda Maestra</h1>
                <p className="text-slate-500">Visualiza y gestiona las citas de hoy.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        {/* Calendar Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-800">Calendario en construcción</h3>
                        <p className="text-slate-500 max-w-sm">
                            Estamos preparando la vista maestra de citas con funcionalidad de drag & drop.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
