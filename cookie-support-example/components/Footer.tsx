import { cx } from "@emotion/css";
import React from "react";

import ContentstackIcon from "./ContentstackLogo";

declare interface FooterOwnProps {
  details: {
    additional_links?: {
      link?: {
        title?: string;
        href?: string;
        [key: string]: any;
      };
      [key: string]: any;
    }[];
    title?: string;
    fun_fact?: string;
    [key: string]: any;
  };
}

function Footer(props: FooterOwnProps) {
  const { details } = props;
  return (
    <footer>
      <section className={cx("bg-slate-600 py-14 text-white")}>
        <div className="mx-auto flex max-w-screen-xl justify-between gap-20 max-lg:items-center">
          <div className="w-80">
            <div className="flex flex-col items-center">
              <div className="mb-5">
                <ContentstackIcon />
              </div>
              <h3 className=" text-center text-lg font-light">
                {details.title}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex gap-2 max-lg:flex-col max-lg:gap-12">
            <div className="w-80">
              <h4 className="mb-2 font-medium">Additional links</h4>
              <nav>
                <ul className="text-sm font-light">
                  {details.additional_links?.map((link, idx) => {
                    const { title, href } = link.link || {};
                    return (
                      <li key={idx}>
                        <a
                          href={href}
                          className="hover:underline"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            <div className="w-80">
              <h4 className="mb-2 font-medium">
                Fun fact from Live preview&apos;s PM
              </h4>
              <p className="text-sm font-light">{details.fun_fact}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={cx("bg-slate-800 py-3 text-center font-light text-white")}
      >
        <p className="text-sm">
          Designed & developed by Dev team at Contentstack
        </p>
      </section>
    </footer>
  );
}

export default Footer;
