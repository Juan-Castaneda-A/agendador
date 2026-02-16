import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Smartphone, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header/Navbar */}
      <header className="px-6 py-4 md:px-12 md:py-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Agendador PRO
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">Características</Link>
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600">Iniciar Sesión</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 shadow-md">Comenzar Gratis</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:px-12 md:py-32 flex flex-col items-center text-center max-w-7xl mx-auto overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 -z-10 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-8 animate-bounce">
            <Zap className="w-3 h-3" />
            NUEVA VERSIÓN 1.0 DISPONIBLE
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            La forma más inteligente de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500">
              gestionar tu agenda.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Simplifica tus reservas, gestiona tu equipo y reduce inasistencias con recordatorios automáticos por WhatsApp. Todo en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-200 rounded-2xl transform transition-transform hover:scale-105 active:scale-95">
                Acceso Administrador
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl">
                Ver Demo Pública
              </Button>
            </Link>
          </div>

          {/* Feature Grid Quick View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
            {[
              { icon: CheckCircle, title: "Sincronización Real", desc: "Evita colisiones de horarios con nuestro motor de disponibilidad." },
              { icon: Smartphone, title: "Mobile First", desc: "Tus clientes pueden reservar desde cualquier lugar y dispositivo." },
              { icon: Zap, title: "WhatsApp Directo", desc: "Envía confirmaciones y recordatorios instantáneos sin esfuerzo." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 md:px-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 italic">Agendador PRO</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Agendador PRO. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-slate-400 hover:underline">Privacidad</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:underline">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
