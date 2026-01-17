import React from 'react';
import RegistrationWizard from '../components/RegistrationWizard';
import RegisterForm from '../components/RegisterForm';
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
