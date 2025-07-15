import { useNavigate } from 'react-router';

interface ButtonProps {
  label: string;
  href: string;
}

const NavButton = ({ label, href }: ButtonProps) => {
  const navigate = useNavigate();
  return (
    <button type="button" className="nav-button" onClick={() => navigate(href)}>
      {label}
    </button>
  );
};
export default NavButton;
