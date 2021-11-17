import React from "react";
import PaymentSettings from "./PaymentSettings/PaymentSettings";
import Integration from "./Integration/Integration";
import VerticalTabMenu from "../VerticalTabMenu";
import BlockedContentElement from "./BlockedContentElement/BlockedContentElement.jsx";
import Withdraw from "./Withdraw/Withdraw";

const labels = ["Payment Settings", "Integration","Blocked Content Element","Withdraw"];
export default function Settings() {
  return (
    <VerticalTabMenu title="Settings" labels={labels}>
      <PaymentSettings />
      <Integration />
      <BlockedContentElement />
      <Withdraw />
    </VerticalTabMenu>
  );
}
