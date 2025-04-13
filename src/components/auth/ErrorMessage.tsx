import { LoginError } from './types';

const getErrorMessage = (error: LoginError): string => {
    if (!error.response) {
        return '無法連接到伺服器，請檢查網路連線';
    }

    const status = error.response.status;
    switch (status) {
        case 400:
            return '請求格式錯誤';
        case 401:
            return '帳號或密碼錯誤';
        case 422:
            return error.response.data?.message || '輸入資料格式不正確';
        case 429:
            return '請求次數過多，請稍後再試';
        case 500:
        case 502:
        case 503:
        case 504:
            return '伺服器暫時無法處理請求，請稍後再試';
        default:
            return '登入失敗，請稍後再試';
    }
};

interface ErrorMessageProps {
    error: LoginError | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
    if (!error) return null;

    return (
        <div className="text-red-500 text-sm text-center">
            {getErrorMessage(error)}
        </div>
    );
};