import person from "../../assets/images/person.png";
import "./introduction.css";
import InformationSummary from "./InformationSummary";
import { Link as ScrollLink } from "react-scroll";

// Information summary data
const informationSummaryData = [
  {
    id: 1,
    title: "Experience",
    description: "1-2 Y.",
  },
  {
    id: 2,
    title: "Projects Completed",
    description: "10+",
  },
  {
    id: 3,
    title: "Happy Clients",
    description: "5+",
  },
];

const Introduction = () => {
  return (
    <div
      className="flex max-lg:flex-col-reverse sm:justify-between pt-10 lg:pt-31.5 lg:mb-27.5 max-xl:gap-2 p-2 max-xxl:px-4"
      id="introduction"
    >
      <div className="w-full flex flex-col justify-between max-lg:text-center">
        <div className="pt-13 me-31.5 w-full lg:w-auto transition-all duration-500">
          <p className="text-xs font-semibold text-picto-primary tracking-widest uppercase mb-3">Hello, I’m Patel Sudhir</p>
          <h1 className="text-4xl xxs:text-5xl sm:max-xl:text-6xl xl:text-7xl font-extrabold w-full text-black dark:text-white leading-tight">
            Full Stack Developer
          </h1>
          <p className="text-xs xxs:text-lg lg:text-[18px] text-gray-500 dark:text-gray-400 my-6 max-w-xl leading-relaxed">
            I build responsive, modern, and scalable web applications using frontend and backend technologies.
          </p>
          <div className="text-center lg:text-start flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
            <ScrollLink
              className="btn btn-primary btn-sm xxs:btn-lg text-white cursor-pointer"
              to="portfolio"
              smooth={true}
              duration={900}
              offset={-100}
            >
              View Projects
            </ScrollLink>
            <a
              className="btn btn-outline btn-sm xxs:btn-lg border-2 border-picto-primary text-picto-primary hover:bg-picto-primary hover:text-white hover:border-picto-primary"
              href="/api/resume/download"
              download
            >
              Download Resume
            </a>
            <ScrollLink
              className="btn btn-ghost btn-sm xxs:btn-lg text-gray-700 dark:text-gray-300 hover:text-picto-primary cursor-pointer border border-gray-300 dark:border-gray-700"
              to="contact"
              smooth={true}
              duration={900}
              offset={-100}
            >
              Contact Me
            </ScrollLink>
          </div>
        </div>
        <div className="mx-auto lg:mx-0 relative">
          <div className="grid max-xxs:grid-flow-col grid-cols-3 w-fit mt-10 gap-1">
            {informationSummaryData.map((item) => (
              <InformationSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`max-w-134 w-full h-full max-lg:mx-auto aspect-[536/636] relative`}
      >
        <img
          className={`shadow-2xl shadow-gray-200 w-full h-full absolute bottom-0 object-cover bg-white rounded-3xl`}
          src={person}
          alt="person"
        />
      </div>
    </div>
  );
};

export default Introduction;
