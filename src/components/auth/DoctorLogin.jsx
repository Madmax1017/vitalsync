import React from 'react';
import LoginCard from './LoginCard';
import { FiClipboard } from 'react-icons/fi';

const DoctorLogin = () => {
    return (
        <LoginCard
            roleTitle="Doctor Login"
            rolePath="/doctor"
            icon={FiClipboard}
            gradient="from-violet-600 to-indigo-600"
            expectedRole="doctor"
        />
    );
};

export default DoctorLogin;
