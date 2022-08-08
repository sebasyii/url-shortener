import React, { useState, useEffect, ReactElement, ReactNode } from "react";

import { AppProps } from "next/app";

import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";

import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";
import { useRouter } from "next/router";

import { pageView } from "@/lib/google-analytics/ga";
import Script from "next/script";
import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { containerStyles } from "@/styles/containerStyles";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = (props: AppPropsWithLayout) => {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  const router = useRouter();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || null;

  const getLayout = Component.getLayout ?? ((page) => page);

  const queryClient = new QueryClient();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <DefaultSeo {...SEO} />

      {/* Only Activates in production */}
      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaMeasurementId}');
        `}
          </Script>
        </>
      )}

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
            fontFamily: `Inter ,-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`,
            headings: {
              fontFamily: `Inter ,-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`,
              sizes: {
                h1: { fontSize: "2.986rem" },
                h2: { fontSize: "2.488rem", lineHeight: 1.2 },
                h3: { fontSize: "2.074rem" },
                h4: { fontSize: "1.728rem" },
                h5: { fontSize: "1.44rem" },
                h6: { fontSize: "1.2rem" },
              },
            },
            radius: {
              md: 6,
            },
            components: {
              Container: {
                defaultProps: containerStyles,
              },
            },
            colors: {
              black: [
                "#f7f7f7",
                "#e3e3e3",
                "#c8c8c8",
                "#a4a4a4",
                "#818181",
                "#666666",
                "#515151",
                "#434343",
                "#383838",
                "#000000",
              ],
            },
          }}
        >
          <Global
            styles={(theme) => ({
              "*, *::before, *::after": {
                boxSizing: "border-box",
              },

              body: {
                ...theme.fn.fontStyles(),
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,
                lineHeight: theme.lineHeight,
              },
            })}
          />
          <QueryClientProvider client={queryClient}>
            {getLayout(<Component {...pageProps} />)}
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default App;
