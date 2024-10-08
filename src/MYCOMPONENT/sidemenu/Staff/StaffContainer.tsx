import Link from "next/link";
import StaffMedium from "./Staff";

const StaffContainer = () => {
  return (
    <div className="w-full space-y-4 text-lg font-bold">
      <h1>Staff Picks</h1>
      <StaffMedium />
      <Link href={"/"} className="mt-8 text-sm font-normal text-green-600">
        See the full list
      </Link>
    </div>
  );
};

export default StaffContainer;
