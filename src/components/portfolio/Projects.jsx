import { faArrowRight, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Projects = ({ data }) => {
  return (
    <div className="max-w-106 rounded-2xl duration-300 transition-all shadow-sm hover:shadow-2xl shadow-gray-200 dark:shadow-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Project Thumbnail Image */}
        <div className="aspect-[372/220] overflow-hidden bg-gray-100 dark:bg-gray-850 relative group">
          <img 
            src={data?.image} 
            alt={`${data?.title} image`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 right-3 px-3 py-1 text-[11px] font-bold tracking-wider rounded-full bg-picto-primary text-white shadow">
            {data?.category?.toUpperCase()}
          </span>
        </div>

        {/* Card Content body */}
        <div className="p-5 xs:p-7">
          <h3 className="text-gray-900 dark:text-white text-lg xxs:text-xl font-bold pt-1 mb-2">
            {data?.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs xxs:text-[14px] leading-relaxed mb-4">
            {data?.description}
          </p>

          {/* Features Bullets list */}
          {data?.features && data.features.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Features</p>
              <ul className="text-xs text-gray-650 dark:text-gray-355 space-y-1.5 pl-4 list-disc">
                {data.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="leading-snug">{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack List pills */}
          {data?.techStack && data.techStack.length > 0 && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-1.5">
                {data.techStack.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button controls footer */}
      <div className="px-5 pb-5 xs:px-7 xs:pb-7 pt-2 border-t border-gray-100 dark:border-gray-850 flex flex-col gap-2.5">
        <div className="flex gap-2">
          {data?.githubLink && (
            <a
              href={data.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline flex-1 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer gap-1.5 py-2"
            >
              <FontAwesomeIcon icon={faGithub} />
              GitHub
            </a>
          )}
          {data?.liveLink && (
            <a
              href={data.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline flex-1 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer gap-1.5 py-2"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              Live Demo
            </a>
          )}
        </div>
        <Link
          to={`/project/${data?._id || data?.id}`}
          className="btn btn-sm btn-primary w-full text-white text-xs font-semibold cursor-pointer py-2 gap-1.5"
        >
          Case Study Details
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
};

export default Projects;
