import { cx } from "@emotion/css";
import Image from "next/image";
import React from "react";

declare interface FeatureBlockOwnProps {
  idx: number;
  details: {
    title: string;
    description: string;
    image: {
      url: string;
    };
    [key: string]: any;
  };
}

declare interface DescriptionBlockOwnProps {
  details: { title: string; description: string; [key: string]: any };
  className?: string;
}

declare interface ImageBlockOwnProps {
  details: { url: string; [key: string]: any };
  className?: string;
}

function DescriptionBlock(props: DescriptionBlockOwnProps) {
  const { details, className = "" } = props;
  const { title, description } = details;

  return (
    <div className={cx("max-w-2lg", "flex-1", className)}>
      <div>
        <h3
          className="mb-5 text-center text-xl font-medium"
          {...details?.$.title}
        >
          {title}
        </h3>
        <p className=" text-justify" {...details?.$.description}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ImageBlock(props: ImageBlockOwnProps) {
  const { details, className = "" } = props;
  const { url } = details;

  return (
    <div className={cx("flex flex-1", className)}>
      <Image
        src={url}
        alt="image"
        width={200}
        height={80}
        {...details?.$.url}
      />
    </div>
  );
}

function FeatureBlock(props: FeatureBlockOwnProps) {
  const { idx, details } = props;

  return (
    <div className="my-10 flex w-full items-center">
      {idx % 2 ? (
        <>
          <ImageBlock details={details.image || {}} className="justify-start" />
          <DescriptionBlock details={details} />
        </>
      ) : (
        <>
          <DescriptionBlock details={details} />
          <ImageBlock details={details.image || {}} className="justify-end" />
        </>
      )}
    </div>
  );
}

export default FeatureBlock;
