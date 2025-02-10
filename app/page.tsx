import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
             aria-hidden="true">
          <div
            // bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="mx-auto max-w-2xl py-16">
          <div className="" style={{display: "flex", justifyContent: "center"}}>
            <div className="typewriter">
              <h1 className="text-4xl font-bold text-white-900 sm:text-6xl">
                Welcome!</h1>
              <h1 className="text-4xl font-bold text-white-900 sm:text-6xl">
                I am Monika</h1>
              <h1 className="text-4xl font-bold text-white-900 sm:text-6xl">
                I enjoy coding</h1>
            </div>
          </div>
          <div>
            <div>
              <p className="mt-6 text-2xl leading-8 text-white-600 text-center">Can you catch the yellow
                star?
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="#"
                   className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">No
                  (coming soon)</a>
                <a href="#" className="text-sm font-semibold leading-6 text-white-900">Learn more (coming soon)<span
                  aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
