import React from "react";
import { Link } from "react-router-dom";
import Title from "./Title";

const Hero = () => {
  return (
    <div>
      <Title />
      <section className="dark:bg-gray-100 dark:text-gray-800">
        <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-32 md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-4xl font-bold leading-none sm:text-5xl">
            Welcome to Headless CMS
          </h1>
          <p className="px-8 mt-8 mb-12 text-lg">
            Create, Read, Update, and Delete entities and their data with ease.
            Define your entities and their attributes, and let the app handle
            the rest. Start building your content-driven application today!
          </p>
          <div className="flex flex-wrap justify-center">
            <Link to="/create">
              <button className="px-8 py-3 m-2 text-lg font-semibold rounded dark:bg-violet-600 dark:text-gray-50">
                Get Started
              </button>
            </Link>
            <Link to="/view">
              <button className="px-8 py-3 m-2 text-lg border rounded dark:text-gray-900 dark:border-gray-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
