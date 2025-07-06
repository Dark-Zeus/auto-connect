import { Link } from "react-router-dom";

function UserCategoryCard({ label, to, image, icon }) {
  return (
    <Link
      to={to}
      className="
        tw:relative
        tw:flex tw:flex-col tw:items-center tw:justify-center
        tw:p-6 tw:rounded-3xl tw:shadow-lg
        tw:border tw:border-blue-100
        hover:tw:shadow-2xl hover:tw:-translate-y-2
        tw:transition-all tw:duration-300 tw:cursor-pointer
        tw:min-w-[250px] tw:min-h-[280px] tw:max-w-[280px] tw:overflow-hidden
      "
    >
      {/* Background image covering entire card */}
      {image && (
        <img
          src={image}
          alt={label}
          className="
            tw:absolute tw:inset-0 tw:w-full tw:h-full
            tw:object-cover tw:rounded-3xl tw:opacity-80
            tw:z-0
          "
        />
      )}

      {/* If using icon instead of image */}
      {icon && (
        <div className="tw:text-blue-700 tw:text-6xl tw:z-10">
          {icon}
        </div>
      )}

      {/* Label overlaid at bottom-left */}
      <span className="
        tw:absolute tw:bottom-4 tw:left-4
        tw:text-2xl tw:font-bold tw:text-white tw:tracking-wide tw:z-10
        tw:drop-shadow-lg
      ">
        {label}
      </span>
    </Link>
  );
}

export default UserCategoryCard;
