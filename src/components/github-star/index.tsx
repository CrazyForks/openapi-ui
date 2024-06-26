import { Tooltip } from "antd";
import { useEffect, useState } from "react";

import { useConfigInfoStore } from "@/core/store";
import { darkTheme } from "@/core/style/defaultStyleConfig";

const GithubIcon = ({ size = "16", fill = "#333", ...other }) => {
  return (
    <svg height={size} viewBox="0 0 24 24" width={size} {...other}>
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill={fill}
      />
    </svg>
  );
};

let isFetchedGithubStar = false;
let star = 0;

export default function GithubStar() {
  const { configInfo } = useConfigInfoStore();
  const isDarkTheme = configInfo?.theme === "dark";
  const [, setCount] = useState(0);
  const isPackage = import.meta.env.MODE === "package";

  useEffect(() => {
    if (!isPackage && !isFetchedGithubStar) {
      (async () => {
        try {
          const res = await getStar();
          star = res.stargazers_count;
          isFetchedGithubStar = true;
          setCount((preCount) => preCount + 1);
        } catch (e) {
          console.log("fetch github info error:", e);
        }
      })();
    }
  }, [isPackage]);

  async function getStar() {
    const res = await fetch("https://api.github.com/repos/rookie-luochao/openapi-ui");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  }

  if (!isPackage && !isFetchedGithubStar) {
    return null;
  }

  const githubLink = (
    <a
      css={{ cursor: "pointer", opacity: 0.8, "&:hover": { opacity: 1 } }}
      href="https://github.com/rookie-luochao/openapi-ui"
      target="_blank"
    >
      <GithubIcon fill={isDarkTheme ? darkTheme.color.text : undefined} />
    </a>
  );

  return (
    <>
      {isPackage ? (
        githubLink
      ) : (
        <Tooltip
          title={
            <span>
              {`${star}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              <span style={{ color: "gold" }}>&#9733;</span>
            </span>
          }
        >
          {githubLink}
        </Tooltip>
      )}
    </>
  );
}
