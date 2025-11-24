import React from "react";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { HStack } from "../ui/hstack";

const EmployeeSkeleton = () => {
  return (
    <>
      <HStack style={{ width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
        <SkeletonText _lines={1} className="h-[28px] w-[248px]" />
        <Skeleton variant="rounded" className="h-[44px] w-[322px]" />
      </HStack>
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
    </>
  );
};

export default EmployeeSkeleton;
