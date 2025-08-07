'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch {
      setError('Ocurrió un error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        <div className="relative z-10">
        <CardHeader className="space-y-6 p-6">
          <div className="flex flex-col items-center justify-center mb-4 space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <Image
                src="/logo_operiq.webp"
                alt="OPERIQ Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">OPERIQ</CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Plataforma de gestión VTC
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-500 h-12 transition-all duration-200 focus:border-yellow-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-500 h-12 transition-all duration-200 focus:border-yellow-500/50"
              />
            </div>
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
        </div>
      </Card>
    </div>
  );
}