// components/AuthProvider.tsx
"use client"

import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ВНИМАНИЕ: НЕЛЬЗЯ использовать useSession() здесь,
  // так как SessionProvider должен быть корневым!
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider;