import * as React from "react";
import Menu from "@material-ui/core/Menu";

const MuiMenu = React.forwardRef((props, ref) => {
  return <Menu ref={ref} {...props} />;
});

export default MuiMenu;
