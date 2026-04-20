import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    nombreUsuario: string | null;
    iniciarSesion: (nombre: string, token: string) => void;
    cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

    useEffect(() => {
        const nombreGuardado = localStorage.getItem('nombreUsuario');
        if (nombreGuardado) {
            setNombreUsuario(nombreGuardado);
        }
    }, []);

    const iniciarSesion = (nombre: string, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('nombreUsuario', nombre);
        setNombreUsuario(nombre);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombreUsuario');
        setNombreUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ nombreUsuario, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth tiene que ser usado adentro de un AuthProvider");
    }
    return context;
};