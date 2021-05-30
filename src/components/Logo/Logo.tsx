import { StyledLogo } from "./Logo.styles";
import { useHistory } from "react-router-dom";

export const Logo = () => {
  const routerHistory = useHistory();

  return (
    <StyledLogo onClick={() => routerHistory.push("/")}>Pollboy</StyledLogo>
  );
};
