import React from "react";
import PaymentSettings from "./PaymentSettings/PaymentSettings";
import Integration from "./Integration/Integration";
import VerticalTabMenu from "../VerticalTabMenu";
import BlockedContentElement from "./BlockedContentElement/BlockedContentElement.jsx";

const labels = ["Payment Settings", "Integration","Blocked Content Element"];
export default function Settings() {
  return (
    <VerticalTabMenu title="Settings" labels={labels}>
      <PaymentSettings />
      <Integration />
      <BlockedContentElement />
    </VerticalTabMenu>
  );
}
