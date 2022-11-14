import ContentstackLivePreview from "@contentstack/live-preview-utils";
import "@contentstack/live-preview-utils/dist/main.css";
import type { AppProps } from "next/app";
import getConfig from "next/config";
import "react-toggle/style.css";

import "../styles/globals.css";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const {
  CONTENTSTACK_API_KEY,
  CONTENTSTACK_ENVIRONMENT,
  CONTENTSTACK_APP_HOST,
  CONTENTSTACK_ENABLE_LIVE_PREVIEW,
} = envConfig;

ContentstackLivePreview.init({
  clientUrlParams: {
    host: CONTENTSTACK_APP_HOST || "app.contentstack.com",
  },
  // @ts-ignore
  debug: true,
  enable: CONTENTSTACK_ENABLE_LIVE_PREVIEW === "true",
  stackDetails: {
    apiKey: CONTENTSTACK_API_KEY,
    environment: CONTENTSTACK_ENVIRONMENT,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
