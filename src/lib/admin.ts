import { getServerSession } from 'next-auth';

import { authOptions } from '../../libs/authOptions';

export async function isAdmin() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return false;
    }
    
    const role = (session.user as any).role;
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function requireAdmin() {
    const admin = await isAdmin();
    
    if (!admin) {
        throw new Error('Unauthorized: Admin access required');
    }
    
    return true;
}

export async function getAdminSession() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }
    
    const role = (session.user as any).role;
    
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Admin access required');
    }
    
    return session;
}

