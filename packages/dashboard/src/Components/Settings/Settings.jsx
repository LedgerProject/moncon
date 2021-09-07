import React from "react";
import PaymentSettings from "./PaymentSettings/PaymentSettings";
import Integration from "./Integration/Integration";
import VerticalTabMenu from "../VerticalTabMenu";

const labels = ["Payment Settings", "Integration"];
export default function Settings() {
  return (
    <VerticalTabMenu title="Settings" labels={labels}>
      <PaymentSettings />
      <Integration />
    </VerticalTabMenu>
  );
}
