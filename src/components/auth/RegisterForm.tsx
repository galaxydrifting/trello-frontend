import useRegisterMutation from '../../hooks/useRegisterMutation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import registerSchema from './registerSchema';
import { RegisterForm as IRegisterForm } from './types';
import { SubmitButton } from './SubmitButton';

export const RegisterForm = () => {
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: IRegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch {
      // 錯誤已由 mutation 處理
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            電子郵件
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="電子郵件"
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">
            用戶名稱
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="用戶名稱"
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="sr-only">
            密碼
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="密碼"
          />
          {errors.password && (
            <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>
          )}
        </div>
      </div>
      <SubmitButton isPending={registerMutation.isPending} isSuccess={registerMutation.isSuccess} />
      {registerMutation.isError && (
        <div className="text-red-500 text-xs mt-2">
          {registerMutation.error?.response?.data?.message || '註冊失敗'}
        </div>
      )}
    </form>
  );
};
