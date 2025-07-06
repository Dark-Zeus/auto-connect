import { Link } from "react-router-dom";

function UserCategoryCard({ label, to, icon }) {
  return (
    <Link
      to={to}
      className="
        tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-6
        tw:rounded-2xl tw:shadow-md tw:bg-white
        hover:tw:bg-blue-100 hover:tw:shadow-lg
        tw:transition-all tw:duration-300 tw:cursor-pointer
        tw:text-center tw:text-blue-800 tw:font-semibold
      "
    >
      {icon && <div className="tw:mb-4 tw:text-4xl">{icon}</div>}
      <span className="tw:text-xl tw:font-bold">{label}</span>
    </Link>
  );
}

export default UserCategoryCard;
