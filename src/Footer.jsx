import { Link } from "react-router-dom";
import "./styles/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2>JetLink</h2>
          <p>Discover. Book. Enjoy Crete.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/Heraklion">Heraklion</Link>
          <Link to="/Chania">Chania</Link>
          <Link to="/Rethymno">Rethymno</Link>
          <Link to="/account-type">Login / Register</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} JetLink. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
