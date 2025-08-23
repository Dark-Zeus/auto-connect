import React from "react";
import searchingGirl from "../../assets/images/searching-girl.PNG";

const NoSimilarAds = () => (
  <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:bg-gray-50 tw:rounded-xl tw:shadow-sm">
    <img
      src={searchingGirl}
      alt="No similar ads"
      className="tw:w-48 tw:h-48 tw:object-contain tw:mb-6"
    />
    <div className="tw:text-xl tw:font-semibold tw:text-gray-700 tw:mb-2">
      No similar ads found!
    </div>
    {/* <div className="tw:text-base tw:text-gray-500 tw:text-center">
      Try changing your search or check back later.
    </div> */}
  </div>
);

export default NoSimilarAds;