import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Agendador PRO&nbsp;
          <code className="font-bold">v1.0</code>
        </p>
      </div>

      <div className="relative flex place-items-center flex-col gap-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-center">
          La forma más fácil de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            gestionar tu negocio.
          </span>
        </h1>
        <p className="text-xl text-center max-w-2xl opacity-90">
          Una plataforma SaaS potente y sencilla para agendar citas, gestionar clientes y automatizar recordatorios por WhatsApp.
        </p>

        <div className="flex gap-4">
          <Link href="/admin/login">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-full shadow-xl">
              Acceso Administrador
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-bold text-lg px-8 py-6 rounded-full">
              Ver Demo
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
