import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { clearUser } from '../../store/userSlice';

// Navbar 元件，底色與 body (gray-100/#f3f4f6) 一致，僅顯示名字與登出按鈕
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
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-end bg-gray-100 p-4 text-gray-800">
      {name ? (
        <div className="flex items-center gap-4">
          <span>{name}</span>
          <button
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
