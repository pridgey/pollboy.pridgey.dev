import { ReactNode, useState, useEffect } from "react";
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
  // Recent polls
  const [recentPolls, setRecentPolls] = useState<any[]>([]);

  // React router history for redirecting
  const routerHistory = useHistory();

  // Grab the recently visited polls
  useEffect(() => {
    // Grab the recent polls from local storage
    const recentPollsStorage = localStorage.getItem("pb-recent-polls");
    const recentPollsResults: any[] = JSON.parse(recentPollsStorage ?? "[]");

    setRecentPolls(recentPollsResults);
  }, []);

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
            {recentPolls.map((Poll, index) => (
              <Navbutton
                key={`recent-poll-${index}`}
                onClick={() => {
                  setShowNav(false);
                  routerHistory.push(`/poll?slug=${Poll.Slug}`);
                }}
              >
                {Poll.Name}
              </Navbutton>
            ))}
          </LayoutNav>
          <Content>{children}</Content>
        </ContentContainer>
      </LayoutOverlay>
    </LayoutContainer>
  );
};
