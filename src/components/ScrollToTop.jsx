import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Khi pathname thay đổi, scroll về đầu trang
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Không cần render gì
};

export default ScrollToTop;
