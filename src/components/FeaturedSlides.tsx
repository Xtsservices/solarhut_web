import React from "react";

const slides = [
    {
        src: "/src/assets/SolarHutImages/solar1.jpeg",
        alt: "Featured Slide 1",
    },
    {
        src: "/src/assets/SolarHutImages/Solar2.jpeg",
        alt: "Featured Slide 2",
    },
     {
        src: "/src/assets/SolarHutImages/Solar3.jpeg",
        alt: "Featured Slide 3",
    },
     {
        src: "/src/assets/SolarHutImages/Solar4.jpeg",
        alt: "Featured Slide 4",
    },
];


const FeaturedSlides: React.FC = () => {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    console.log("Current slide:", current);

    return (
    <div className="w-full flex flex-col items-center justify-center mt-32 mb-8">
            <div className="w-full h-[500px] md:h-[700px] lg:h-[900px] bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl flex items-center justify-center shadow-lg mb-8">
                <img src={slides[current].src} alt={slides[current].alt} className="w-full h-full object-contain" />
            </div>
        </div>
    );
};

export default FeaturedSlides;
