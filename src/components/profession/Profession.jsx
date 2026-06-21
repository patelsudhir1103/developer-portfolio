import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCode, 
  faServer, 
  faDatabase, 
  faTools, 
  faShieldAlt 
} from "@fortawesome/free-solid-svg-icons";

const skillsData = [
  {
    category: "Frontend",
    icon: faCode,
    skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
    colorClass: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
  },
  {
    category: "Backend",
    icon: faServer,
    skills: ["Node.js", "Express.js"],
    colorClass: "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400"
  },
  {
    category: "Database",
    icon: faDatabase,
    skills: ["MongoDB", "MySQL"],
    colorClass: "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400"
  },
  {
    category: "Tools & Systems",
    icon: faTools,
    skills: ["Git", "GitHub", "VS Code", "Postman"],
    colorClass: "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400"
  },
  {
    category: "Other Methodologies",
    icon: faShieldAlt,
    skills: ["REST API", "Authentication", "Responsive Design"],
    colorClass: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"
  }
];

const Profession = () => {
  return (
    <div
      className="content py-10 md:py-15 lg:py-24 px-4"
      id="services"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="section-title text-black dark:text-white">Technical Skills</h2>
        <p className="font-normal text-[18px] text-gray-400 pt-4">
          My primary technologies and toolsets organized by stack category. I focus on modern Javascript ecosystems.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {skillsData.map((data, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${data.colorClass}`}>
                <FontAwesomeIcon icon={data.icon} className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {data.category}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {data.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-50 dark:bg-gray-800 text-gray-750 dark:text-gray-350 border border-gray-150 dark:border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profession;
