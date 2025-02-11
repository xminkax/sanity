import React from "react";

const welcomeTexts: string[] = [
  "Welcome!",
  "I am monika",
  "I enjoy coding"
]
export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <section>
        <div className="flex justify-center">
          <div className="typewriter">
            {welcomeTexts.map((item: string) =>
              <h1 key={item} className="font-bold text-4xl sm:text-6xl">
                {item}
              </h1>
            )}
          </div>
        </div>
        <div>
          <p className="mt-6 text-2xl leading-8 text-center">Can you catch the yellow
            star?
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#"
               className="z-2 inline-block px-6 py-3 text-white font-semibold text-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 hover:shadow-xl">
              No-coming soon<span
              aria-hidden="true">→</span></a>
            <a href="#"
               className="inline-block px-6 py-3 text-white font-semibold text-lg bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-lg shadow-lg transform transition-all hover:scale-105 hover:from-gray-800 hover:via-gray-900 hover:to-black hover:shadow-xl">
              Learn More-coming soon<span
              aria-hidden="true">→</span></a>

          </div>
        </div>
      </section>
    </main>
  )
    ;
}
