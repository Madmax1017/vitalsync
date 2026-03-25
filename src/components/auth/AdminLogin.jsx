import React from 'react';
import LoginCard from './LoginCard';
import { FiShield } from 'react-icons/fi';

const AdminLogin = () => {
    return (
        <LoginCard
            roleTitle="Admin Login"
            rolePath="/admin"
            icon={FiShield}
            gradient="from-indigo-600 to-purple-700"
        />
    );
};

export default AdminLogin;
