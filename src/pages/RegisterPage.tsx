import { RegisterForm } from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-xl p-8 mx-2">
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">註冊新帳號</h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export { RegisterPage };
