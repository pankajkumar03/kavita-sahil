import { invitation } from "../config/invitation";
import { Lotus } from "./decor";

export function Footer() {
  return (
    <footer className="footer">
      <Lotus className="footer__lotus" />
      <p className="footer__note">{invitation.text.footerNote}</p>
    </footer>
  );
}
