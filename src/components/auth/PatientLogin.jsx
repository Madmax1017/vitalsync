import React from 'react';
import { Link } from 'react-router-dom';
import LoginCard from './LoginCard';
import { FiUser } from 'react-icons/fi';

const PatientLogin = () => {
    return (
        <LoginCard
            roleTitle="Patient Login"
            rolePath="/patient/dashboard"
            expectedRole="patient"
            icon={FiUser}
            gradient="from-teal-500 to-emerald-600"
        >
            <div className="mt-6 text-center">
                <p className="text-[#6b7280] text-sm font-medium">
                    New to VitalSync?{' '}
                    <Link to="/signup/patient" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </LoginCard>
    );
};

export default PatientLogin;
