import Footer from '../../components/Footer/Footer';
import NavBar from '../../components/NavBar/NavBar';
import classes from './Layout.module.scss';
import SnackBar from '../../components/common/SnackBar/SnackBar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../providers/ThemeProvider';

const Layout = () => {
  const { theme } = useTheme();
  return (
    <div id="layout-container" className={`${classes.layout} theme-${theme}`}>
      <SnackBar />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
