// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCookie, setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  theme: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const theme = getCookie("theme", { req, res }) || "red";

  if (theme === "red") {
    setCookie("theme", "green", { req, res, sameSite: "none", secure: true });
  } else {
    setCookie("theme", "red", { req, res, sameSite: "none", secure: true });
  }
  res.status(200).json({
    theme: getCookie("theme", {
      req,
      res,
      sameSite: "none",
      secure: true,
    }) as string,
  });
}
