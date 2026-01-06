const RibbonLogo = ({ positioning = "absolute" }) => {
    const wrapperClass = positioning === "absolute"
        ? "absolute left-0 top-8 z-30 drop-shadow-2xl"
        : "relative drop-shadow-2xl";

    return (
        <div className={wrapperClass}>
            <div className="relative flex items-center h-20">
                <svg className="absolute left-0 h-full w-auto" viewBox="0 0 537 188" fill="none">
                    <path d="M536.954 9.49459L0.14782 7.62939e-06L-3 177.972L533.807 187.467L416.727 95.1142L536.954 9.49459Z" fill="#C17554" />
                </svg>
                <div className="relative left-4 z-10 flex items-center gap-3 px-6" dir="ltr">
                    <img
                        src={new URL('../assets/white-logo.svg', import.meta.url).href}
                        alt="Book Pass Logo"
                        className="w-full h-full object-contain"
                    />
                    <h3 className="text-white font-bold text-7xl whitespace-nowrap z-10">Book Pass</h3>
                </div>
            </div>
        </div>
    );
};

export default RibbonLogo;