import * as yup from 'yup';

const registerSchema = yup.object({
  email: yup.string().email('請輸入有效的電子郵件').required('電子郵件為必填'),
  password: yup.string().min(6, '密碼至少 6 碼').required('密碼為必填'),
  name: yup.string().min(2, '用戶名稱至少 2 字').required('用戶名稱為必填'),
});

export default registerSchema;
