export type Role = 'Coordinator' | 'HOD' | 'Dean' | 'Head' | 'Admin';

export const ROLES: Role[] = ['Coordinator', 'HOD', 'Dean', 'Head', 'Admin'];

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    role: Role;
    userId: string;
    department?: string; // For Coordinator and HOD
    school?: string; // For Dean
    setRole: (role: Role) => void;
    setUserContext: (userId: string, department?: string, school?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('Coordinator');
    const [userId, setUserId] = useState<string>('coord-1'); // Default user
    const [department, setDepartment] = useState<string>('CSE'); // Default department
    const [school, setSchool] = useState<string>('Engineering'); // Default school

    const setUserContext = (newUserId: string, newDepartment?: string, newSchool?: string) => {
        setUserId(newUserId);
        if (newDepartment) setDepartment(newDepartment);
        if (newSchool) setSchool(newSchool);
    };

    return (
        <AuthContext.Provider value={{ role, userId, department, school, setRole, setUserContext }}>
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
