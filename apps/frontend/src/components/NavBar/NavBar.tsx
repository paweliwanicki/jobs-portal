import classes from "./NavBar.module.scss";
import logoImage from "../../assets/logos/logo.png";
import Switch from "../common/Switch/Switch";
import SvgIcon from "../common/SvgIcon/SvgIcon";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../providers/ThemeProvider";
import { useUser } from "../../providers/UserProvider";
import ContextMenu, {
  ContextMenuOption,
} from "../common/ContextMenu/ContextMenu";
import { useSignForm } from "../../hooks/useSignForm";

const NavBar = () => {
  const { handleSignOut } = useSignForm();
  const navigate = useNavigate();

  const USER_MENU_OPTIONS: ContextMenuOption[] = [
    {
      label: "User Panel",
      action: () => navigate("/user"),
    },
    {
      label: "Archive",
      action: () => navigate("/offer/archive"),
    },
    {
      label: "Sign out",
      action: () => handleSignOut(),
    },
  ];

  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const handleChangeThemeContext = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className={classes.navBar}>
      <div className={classes.content}>
        <Link to="/">
          <img className={classes.logo} src={logoImage} alt="website logo" />
        </Link>
        <div className={classes.userMenu}>
          <Switch
            id="theme-switch"
            checked={theme === "dark"}
            onChange={handleChangeThemeContext}
            leftLabel={<SvgIcon id="icon-sun" height={22} width={22} />}
            rightLabel={<SvgIcon id="icon-moon" height={18} width={18} />}
          />
          {user ? (
            <ContextMenu
              classNames={classes.userContextMenu}
              options={USER_MENU_OPTIONS}
              id="user-menu"
              iconId="icon-user"
              width={48}
              height={48}
            />
          ) : (
            <Link to="login">
              <SvgIcon
                id="icon-login"
                height={48}
                width={48}
                elementId="icon-login"
              />
              <Tooltip
                anchorSelect={`#icon-login`}
                place="bottom-end"
                variant="info"
                content="Log in!"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
