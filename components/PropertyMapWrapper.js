"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

const PropertyMapWrapper = ({ property }) => {
  return <PropertyMap property={property} />;
};

export default PropertyMapWrapper;
