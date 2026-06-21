import person from "../../assets/images/person2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialMedia from "../common/socialMedia/SocialMedia";
import { Link as ScrollLink } from "react-scroll";

const Profile = () => {
  return (
    <div
      className={`relative mx-4 xxl:mx-0.5 -bottom-20 lg:-bottom-28 z-10 rounded-2xl bg-white dark:bg-gray-900 drop-shadow-2xl max-xl:mb-5 shadow-white dark:shadow-none border border-gray-150 dark:border-gray-800 xl:p-28 lg:p-20 md:p-16 sm:p-10 p-4`}
      id="profile"
    >
      <div className="flex max-md:flex-col justify-between items-center gap-6">
        {/* Profile image */}
        <div className="xxl:max-w-106 w-auto h-auto xxl:max-h-126">
          <div className="max-w-106 h-117 object-fill overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
            <img
              className="h-[120%] w-full object-cover"
              src={person}
              alt="Patel Sudhir Profile"
            />
          </div>
          {/* Social media section */}
          <div className="relative bottom-9">
            <div className="flex justify-center">
              <div className="px-6 max-w-66 py-3 z-50 text-center bg-white dark:bg-gray-850 rounded-[4px] center shadow-2xl border border-gray-100 dark:border-gray-700">
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>

        <div className="max-sm:w-full w-[33rem]">
          <h2
            className={`text-2xl xxs:text-3xl sm:text-4xl lg:text-[38px] text-[min(24px,38px)] max-md:text-center font-bold mb-6 text-gray-900 dark:text-white`}
          >
            Passionate Full Stack Developer
          </h2>
          <div
            className={`text-xs xs:text-[16px] lg:text-lg font-normal max-md:text-center text-gray-600 dark:text-gray-300 space-y-4`}
          >
            <p>
              I am an aspiring Full Stack Developer who enjoys building end-to-end web applications. 
              My expertise covers constructing interactive frontend user interfaces with React and Tailwind CSS, 
              as well as configuring robust server-side systems with Node.js and Express.js.
            </p>
            <p>
              I design structured databases using MongoDB and MySQL, implement secure JWT-based user authentication, 
              build modular RESTful APIs, and handle deployments. I am passionate about learning new software engineering 
              patterns and ready for internship or entry-level opportunities.
            </p>
          </div>
          <div className="mt-8 flex max-md:justify-center gap-4">
            <ScrollLink
              className="btn xxs:btn-lg px-6 max-xs:px-2 xxs:py-3 btn-primary text-xs xxs:text-[14px] sm:text-[16px] text-white cursor-pointer"
              to="portfolio"
              smooth={true}
              duration={900}
              offset={-100}
            >
              My Projects
            </ScrollLink>
            <a
              className={`btn xxs:btn-lg px-6 max-xs:px-2 xxs:py-3 border-2 border-picto-primary text-picto-primary hover:bg-picto-primary hover:text-white bg-transparent duration-300 transition-all text-xs xxs:text-[14px] sm:text-[16px] font-semibold`}
              href="/api/resume/download"
              download
            >
              <FontAwesomeIcon icon={faDownload} className="mr-1.5" /> Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
