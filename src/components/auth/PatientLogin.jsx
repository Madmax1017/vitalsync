import React from 'react';
import LoginCard from './LoginCard';
import { FiUser } from 'react-icons/fi';

const PatientLogin = () => {
    return (
        <LoginCard
            roleTitle="Patient Login"
            rolePath="/patient"
            icon={FiUser}
            gradient="from-emerald-500 to-teal-600"
            expectedRole="patient"
        />
    );
};

export default PatientLogin;
