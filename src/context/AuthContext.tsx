export type Role = 'Coordinator' | 'HOD' | 'Dean' | 'Head' | 'Admin';

export const ROLES: Role[] = ['Coordinator', 'HOD', 'Dean', 'Head', 'Admin'];

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    role: Role;
    setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('Coordinator');

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
