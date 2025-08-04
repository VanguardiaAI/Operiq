import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import dbConnect from '@/lib/mongodb';
// import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        // SIMULACIÓN: Aceptar cualquier email con password "admin123"
        // O específicamente admin@operiq.com con cualquier password
        if (
          (credentials.email === 'admin@operiq.com' && credentials.password) ||
          (credentials.email && credentials.password === 'admin123')
        ) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Administrador',
            role: 'admin',
          };
        }

        throw new Error('Credenciales incorrectas');

        // CÓDIGO ORIGINAL CON BASE DE DATOS (DESACTIVADO)
        // await dbConnect();
        // const user = await User.findOne({ email: credentials.email });
        // if (!user) {
        //   throw new Error('Usuario no encontrado');
        // }
        // const isPasswordValid = await user.comparePassword(credentials.password);
        // if (!isPasswordValid) {
        //   throw new Error('Contraseña incorrecta');
        // }
        // return {
        //   id: user._id.toString(),
        //   email: user.email,
        //   name: user.name,
        //   role: user.role,
        // };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};