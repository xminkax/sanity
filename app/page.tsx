import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            <div>
                <div className="mx-auto max-w-2xl">
                    <div className="text-center typewriter">
                        <h1 className="text-4xl font-bold tracking-tight text-white-900 sm:text-6xl">
                            Welcome!</h1>
                        <p className="mt-6 text-lg leading-8 text-white-600">Anim aute id magna aliqua ad ad non
                            deserunt
                            sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
                            aliqua.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a href="#"
                               className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get
                                started</a>
                            <a href="#" className="text-sm font-semibold leading-6 text-white-900">Learn more <span
                                aria-hidden="true">→</span></a>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true">
                    {/*bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]*/}
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
            <section>
                <div>games</div>
            </section>
            <section>
                <div>books</div>
            </section>
            <section>
                <div>cv/contact-me</div>
            </section>


        </main>
    );
}
