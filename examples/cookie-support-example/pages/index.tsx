import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { cx } from "@emotion/css";
import Contentstack from "contentstack";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next/types";
import { Fragment, useState } from "react";
import Toggle from "react-toggle";

import getConfig from "next/config";
import ArrowSvg from "../components/ArrowSvg";
import CookieSvg from "../components/CookieSvg";
import FeatureBlock from "../components/FeatureBlock";
import Footer from "../components/Footer";
import style from "../styles/home.module.css";
import Head from "next/head";

declare interface HomeOwnProps {
  initialTheme: string;
  entry: { [key: string]: any };
}

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

export default function Home(props: HomeOwnProps) {
  const { initialTheme, entry } = props;
  const [theme, setTheme] = useState(initialTheme);

  /**
   * Set the theme cookie to the opposite of the current theme.
   */
  function toggleTheme() {
    //  NOTE: We purposefully making this action in the server side, since cookie support worked previously in the client side.
    fetch("api/toggle-cookie").then(() => {
      setTheme(
        getCookie("theme", { sameSite: "none", secure: true }) as string
      );
    });
  }

  return (
    <Fragment>
      <Head>
        <title>Cookie support | Contentstack Live preview</title>
        <meta
          name="description"
          content="An example app that illustrates the cookie support in Live preview SSR"
        />
      </Head>
      <main>
        <section className={`${style["circular-background"]}`}>
          <div
            className={`mx-auto flex h-screen max-w-screen-xl items-center justify-between`}
          >
            <div className="max-w-lg">
              <h1
                className="text-4xl uppercase text-purple-800"
                {...entry?.$?.title}
              >
                {entry.title}
              </h1>
              <p
                className="text-2xl font-thin text-gray-600"
                {...entry?.$?.sub_title}
              >
                {entry.sub_title}
              </p>
            </div>
            <div className="flex flex-1 justify-end">
              <CookieSvg />
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-screen-xl items-center">
            {entry.features.map(
              (
                feature: {
                  title: string;
                  description: string;
                  image: { url: string };
                },
                idx: number
              ) => (
                <FeatureBlock details={feature || {}} idx={idx} key={idx} />
              )
            )}
          </div>
        </section>

        <section
          className={cx(style["linear-gradient-background"], "pt-16 pb-20")}
        >
          <div className="mx-auto max-w-screen-xl items-center">
            <h3
              className="linear-gradient-background mb-20 text-center text-2xl font-light"
              {...entry?.fun_part?.$?.title}
            >
              {entry.fun_part?.title}
            </h3>
            <div className="flex gap-8">
              <figure className="flex-1">
                <blockquote
                  className={cx(
                    "blockquote blockquote text-xl",
                    style["blockquote"]
                  )}
                  cite="https://developer.mozilla.org/samples/html/figure.html"
                  {...entry.fun_part?.$?.quote}
                >
                  {entry.fun_part?.quote}
                </blockquote>
                <figcaption
                  className={cx("text-right font-light italic", style.author)}
                  {...entry?.fun_part?.$?.author}
                >
                  {entry.fun_part?.author}
                </figcaption>
              </figure>
              <div className="flex flex-1 items-center">
                <div className="flex max-lg:flex-col max-lg:items-center">
                  <ArrowSvg />

                  <p className="max-w-sm text-justify text-sm font-light">
                    Let&apos;s fix this quote using Live preview. Open this page
                    within your Contentstack and initialize Live preview. Now,
                    change the
                    <strong> Science</strong> to<strong> Math</strong>. This
                    will ensure that the live preview is working as expected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={cx(
            "py-20",
            style[`theme-${theme}`],
            style["theme-section"]
          )}
        >
          <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-10">
            <Toggle
              onChange={toggleTheme}
              className={cx(style.toggle)}
              icons={false}
              checked={theme === "green"}
            ></Toggle>
            <p
              className={cx(
                "max-w-xl text-center font-light",
                style["cookie-toggle-help-text"]
              )}
              {...entry?.cookie_toggler?.$?.description}
            >
              {entry?.cookie_toggler?.description}
            </p>
          </div>
        </section>
      </main>
      <Footer details={entry?.footer || {}} />
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;

  const {
    CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_API_HOST,
    CONTENTSTACK_APP_HOST,
    CONTENTSTACK_ENABLE_LIVE_PREVIEW,
    CONTENTSTACK_MANAGEMENT_TOKEN,
  } = envConfig;

  if (
    !CONTENTSTACK_API_KEY ||
    !CONTENTSTACK_DELIVERY_TOKEN ||
    !CONTENTSTACK_ENVIRONMENT ||
    !CONTENTSTACK_MANAGEMENT_TOKEN ||
    !CONTENTSTACK_API_HOST
  ) {
    throw new Error("Missing Contentstack environment variables");
  }

  const Stack = Contentstack.Stack({
    api_key: CONTENTSTACK_API_KEY,
    delivery_token: CONTENTSTACK_DELIVERY_TOKEN,
    environment: CONTENTSTACK_ENVIRONMENT,
    live_preview: {
      enable: CONTENTSTACK_ENABLE_LIVE_PREVIEW === "true",
      host: CONTENTSTACK_API_HOST || "api.contentstack.io",
      management_token: CONTENTSTACK_MANAGEMENT_TOKEN,
    },
  });

  Stack.livePreviewQuery(query as any);

  ContentstackLivePreview.init({
    clientUrlParams: {
      host: CONTENTSTACK_APP_HOST || "app.contentstack.com",
    },
    // @ts-ignore
    debug: true,
    enable: true,
    stackDetails: {
      apiKey: CONTENTSTACK_API_KEY,
      environment: CONTENTSTACK_ENVIRONMENT,
    },
  });

  let entry = {};
  try {
    entry = await Stack.ContentType("home").Query().toJSON().findOne();

    //@ts-ignore
    Contentstack.Utils.addEditableTags(entry, "home", true);
  } catch (e) {
    console.error(e);
  }

  const initialTheme = getCookie("theme", {
    req,
    res,
    sameSite: "none",
    secure: true,
  });
  return { props: { initialTheme: initialTheme || "red", entry } };
};
