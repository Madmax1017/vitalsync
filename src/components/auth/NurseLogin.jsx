import React from 'react';
import LoginCard from './LoginCard';
import { FiHeart } from 'react-icons/fi';

const NurseLogin = () => {
    return (
        <LoginCard
            roleTitle="Nurse Login"
            rolePath="/nurse"
            icon={FiHeart}
            gradient="from-rose-500 to-pink-600"
        />
    );
};

export default NurseLogin;
