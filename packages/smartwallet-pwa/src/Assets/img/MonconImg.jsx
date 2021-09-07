import React from "react";
import Image from "./moncon.png";

const MonconImg = () => {
  return (
    <div>
      <img src={Image} style={{ width: "50px", borderRadius: "9999px" }} />
    </div>
  );
};
export default MonconImg;
