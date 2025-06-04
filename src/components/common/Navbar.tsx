import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { clearUser } from '../../store/userSlice';

// Navbar 元件，顯示用戶資訊與登出按鈕
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="w-full flex items-center justify-end bg-gray-800 p-4 text-white">
      {name ? (
        <div className="flex items-center gap-4">
          <span>{name}</span>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded" onClick={handleLogout}>
            登出
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
