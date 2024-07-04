"use client";

import { useState, useEffect, useRef } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];
const MAX_COLS = 3;

const splitArray = (array, numCols) => {
  if (numCols <= 0)
    throw new Error("Number of subarrays must be greater than zero");

  if (array.length === 0) return [];

  const chunkSize = Math.ceil(array.length / numCols);

  return array.reduce((acc, _, i) => {
    if (i % chunkSize === 0) acc.push(array.slice(i, i + chunkSize));
    return acc;
  }, []);
};
const ReviewColumn = ({ reviews, className, reviewClassName, msPerPx = 0 }) => {
  const columnRef = useRef(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPx}ms`;

  useEffect(() => {
    if (!columnRef.current) return;
    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current.offsetHeight ?? 0);
    });
    resizeObserver.observe(columnRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4")}
      style={{ "--marquee-duration": duration }}
    >
      {reviews.concat(reviews).map((source, reviewIndex) => (
        <Review
          key={reviewIndex}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={source}
        />
      ))}
    </div>
  );
};

const Review = ({ imgSrc, className, ...props }) => {
  const POSSIBLE_DELAYS = ["0s", "0.1s", "0.2s", "0.3s", "0.4s", "0.5s"];
  const animationDelay =
    POSSIBLE_DELAYS[Math.floor(Math.random * POSSIBLE_DELAYS.length)];
  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgsrc={imgSrc} />
    </div>
  );
};

const ReviewGrid = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(PHONES, MAX_COLS);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = columns[2];

  return (
    <div
      ref={containerRef}
      className="relative mt-16 -mx-4 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3, ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3.length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPx={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPx={15}
          />
          <ReviewColumn
            reviews={column3}
            className="hidden md:block"
            msPerPx={10}
          />
        </>
      ) : null}
    </div>
  );
};
export const Reviews = () => {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />
      <ReviewGrid />
    </MaxWidthWrapper>
  );
};
