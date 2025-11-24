import React from "react";
import { HStack } from "../ui/hstack";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const EmployeeProfileSkeleton: React.FC = () => {
  return (
    <>
      <HStack style={{ alignItems: "center" }}>
        <Skeleton variant="circular" className="h-[128px] w-[130px] mr-4" />
        <SkeletonText _lines={2} gap={4} className="h-[28px] w-[500px]" />
      </HStack>

      <SkeletonText _lines={1} className="h-[23px] w-[414px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
      <Skeleton variant="rounded" className="h-[100px]" />
    </>
  );
};

export default EmployeeProfileSkeleton;
