import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/catalog" className="btn btn-ghost text-xl text-primary">
          🧶 shop-mvp
        </Link>
      </div>
      <div className="flex-none gap-2">
        <Link to="/catalog" className="btn btn-ghost">
          Catálogo
        </Link>
        <Link to="/profile" className="btn btn-ghost">
          Perfil
        </Link>
      </div>
    </div>
  );
}
