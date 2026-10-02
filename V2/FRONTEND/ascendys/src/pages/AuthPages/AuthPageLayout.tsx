import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import React from "react";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {children}
        <div className="hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />

            <div className="flex max-w-md flex-col items-center px-8">
              <Link to="/" className="mb-6 block">
                <img
                  width={200}
                  height={60}
                  src="/ascendys_logo-removebg-preview.png"
                  alt="Ascendys Connect"
                  className="h-auto w-full"
                />
              </Link>

              <h2 className="mb-3 text-center text-title-md font-semibold text-white">
                Ascendys Connect
              </h2>
              <p className="text-center text-sm text-gray-300 dark:text-white/70">
                Plateforme d&apos;administration pour la gestion de vos formations, services et contenus digitaux
              </p>
            </div>
          </div>
        </div>

        <div className="fixed inset-e-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
