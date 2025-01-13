import PeripheralInfo from "@/components/peripheralDetails/PeripheralInfo";
import SelectedPeripheralDetails from "@/components/peripheralDetails/SelectedPeripheralDetails";
import { FC } from "react";

const PeripheralDetails: FC = () => {
  return (
    <>
      <SelectedPeripheralDetails />
      <PeripheralInfo />
    </>
  );
};

export default PeripheralDetails;
