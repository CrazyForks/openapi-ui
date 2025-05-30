import { useTheme } from "@emotion/react";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import throttle from "lodash-es/throttle";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import LogoIcon from "@/assets/images/logo.png";
import LogoMiniIcon from "@/assets/images/logo_mini.svg";
import { Head } from "@/components/head";
import { defaultHeadTitleHeight } from "@/components/head/common";
import { ICPRegistration } from "@/components/icp-registration";
import { Env } from "@/config";
import { getConfig } from "@/core/http/config";
import { useConfigInfoStore } from "@/core/store";
import { ITheme } from "@/core/style/defaultStyleConfig";
import { ThemeType } from "@/core/style/themeConfig";
import { OperationList } from "@/pages/openapi/OperationList";
import { loginModulePath } from "@/router/config";

export interface ICollapsed {
  isCollapsed?: boolean;
}

const Logo = ({ isCollapsed }: ICollapsed) => {
  const navigate = useNavigate();
  const isPackage = import.meta.env.MODE === "package";

  return (
    <a
      className="logo"
      style={{
        height: defaultHeadTitleHeight,
        display: "flex",
        alignItems: "center",
        marginLeft: 24,
        cursor: isPackage ? "default" : "pointer",
      }}
      onClick={() => {
        if (!isPackage) {
          navigate(loginModulePath);
        }
      }}
    >
      <img alt="logo" src={isCollapsed ? LogoMiniIcon : LogoIcon} style={{ width: isCollapsed ? 32 : 128 }} />
    </a>
  );
};

export default function MainLayout() {
  const { configInfo } = useConfigInfoStore();
  const theme = useTheme() as ITheme;
  const [menuHeight, setMenuHeight] = useState(document.documentElement.clientHeight);
  const defaultContentHeight = menuHeight - defaultHeadTitleHeight;
  const isZh = getConfig().env === Env.zh;

  const throttledResizeHandler = useMemo(() => {
    return throttle(
      () => {
        setMenuHeight(globalThis.document.documentElement.clientHeight);
      },
      1200,
      { leading: true, trailing: true },
    );
  }, []);

  useEffect(() => {
    globalThis.addEventListener("resize", throttledResizeHandler);

    return () => {
      globalThis.removeEventListener("resize", throttledResizeHandler);
    };
  }, [throttledResizeHandler]);

  return (
    <Layout>
      <Sider theme={configInfo?.theme === "dark" ? ThemeType.dark : ThemeType.light} width={320}>
        <Logo isCollapsed={false} />
        <div style={{ height: defaultContentHeight, overflow: "auto" }}>
          <OperationList isCollapsed={false} />
        </div>
      </Sider>
      <Layout className="site-layout" style={{ backgroundColor: theme.color.bg }}>
        <Head />
        <div
          style={{
            height: defaultContentHeight,
            overflow: "auto",
            padding: 12,
            backgroundColor: theme.color.bgGray,
            borderRadius: "10px 0 0",
            paddingBottom: isZh ? 0 : 12,
          }}
        >
          <div style={isZh ? { minHeight: defaultContentHeight - 32 - 12 } : {}}>
            <Outlet />
          </div>
          {isZh && <ICPRegistration css={{ minWidth: 880 }} />}
        </div>
      </Layout>
    </Layout>
  );
}
