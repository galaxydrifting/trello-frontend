import { Link } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { LoginForm } from '../components/auth/LoginForm';

export default function LoginPage() {
  const loginMutation = useLoginMutation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-xl p-8 mx-2">
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">登入您的帳號</h2>
        </div>
        <LoginForm loginMutation={loginMutation} />
        <div className="text-center">
          <Link to="/register" className="text-indigo-600 hover:underline">還沒有帳號？註冊</Link>
        </div>
      </div>
    </div>
  );
}
