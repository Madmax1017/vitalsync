import React from 'react';
import axios from 'axios';
import LoginCard from './LoginCard';
import { FiShield } from 'react-icons/fi';
import { setAuthSession } from '../../utils/auth';

const loginAdmin = async ({ email, password }) => {
    const { data } = await axios.post('/api/auth/admin/login', {
        email,
        password,
    });

    setAuthSession({
        token: data.token,
        role: data.role,
        email: data.email,
    });
};

const AdminLogin = () => {
    return (
        <LoginCard
            roleTitle="Admin Login"
            rolePath="/admin"
            icon={FiShield}
            gradient="from-indigo-600 to-purple-700"
            onSubmit={loginAdmin}
        />
    );
};

export default AdminLogin;
