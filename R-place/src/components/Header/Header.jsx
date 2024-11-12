import Logo from "../../assets/rPlaceLogo.jpeg";
import "./Header.scss";

function Header() {
  return (
    <div className="header">
      <div className="header__container">
        <a className="header__link" href="https://rplace-c.co.jp/">
          <img src={Logo} alt="logo" className="header__logo" />
        </a>
        <h3 className="header__heading">採用力診断</h3>
      </div>
    </div>
  );
}

export default Header;
