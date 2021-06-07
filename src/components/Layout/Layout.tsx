import { ReactNode, useState } from "react";
import { Background } from "./../Background";
import {
  LayoutContainer,
  LayoutOverlay,
  LayoutHeader,
  ContentContainer,
  LayoutNav,
  Content,
  HeaderLogo,
  MenuButton,
  Navbutton,
  NavBreaker,
} from "./Layout.styles";
import { CgMenuLeftAlt, CgClose } from "react-icons/cg";
import { useHistory } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  // Nav slider state
  const [showNav, setShowNav] = useState(false);

  // React router history for redirecting
  const routerHistory = useHistory();

  return (
    <LayoutContainer>
      <Background />
      <LayoutOverlay>
        <LayoutHeader>
          <MenuButton onClick={() => setShowNav(!showNav)}>
            {showNav ? <CgClose /> : <CgMenuLeftAlt />}
          </MenuButton>
          <HeaderLogo>Pollboy</HeaderLogo>
        </LayoutHeader>
        <ContentContainer ShowNav={showNav}>
          <LayoutNav>
            <Navbutton
              onClick={() => {
                setShowNav(false);
                routerHistory.push("/");
              }}
            >
              List My Polls
            </Navbutton>
            <Navbutton
              onClick={() => {
                setShowNav(false);
                routerHistory.push("/create");
              }}
            >
              Create New Poll
            </Navbutton>
            <NavBreaker />
          </LayoutNav>
          <Content>{children}</Content>
        </ContentContainer>
      </LayoutOverlay>
    </LayoutContainer>
  );
};
