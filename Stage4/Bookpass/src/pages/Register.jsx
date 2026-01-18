import React from 'react';
import RegistrationWizard from '../components/features/RegistrationWizard';
import RegisterForm from '../components/features/RegisterForm';
import usePageTitle from '../hooks/usePageTitle';

const Register = () => {
  usePageTitle('تسجيل جديد');

  return (
    <RegistrationWizard>
      <RegisterForm />
    </RegistrationWizard>
  );
};

export default Register;
