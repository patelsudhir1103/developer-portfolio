import { useEffect, useState } from "react";
import Projects from "./Projects";
import card1 from "../../assets/images/portfolio-images/card-1.png";
import card2 from "../../assets/images/portfolio-images/card-2.png";
import card3 from "../../assets/images/portfolio-images/card-3.png";
import card4 from "../../assets/images/portfolio-images/card-4.png";
import card5 from "../../assets/images/portfolio-images/card-5.png";
import card6 from "../../assets/images/portfolio-images/card-6.png";

const fallbackCards = [card1, card2, card3, card4, card5, card6];

const projectData = [
  {
    id: 1,
    image: card1,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "I focus on crafting smooth, responsive interfaces that balance aesthetic appeal with practical functionality.",
    link: "#!",
  },
  {
    id: 2,
    image: card2,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "Designed an intuitive dashboard for product management, emphasizing clarity and user efficiency.",
    link: "#!",
  },
  {
    id: 3,
    image: card3,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "Developed a modern admin panel with a focus on usability and seamless navigation for end users and so on.",
    link: "#!",
  },
  {
    id: 4,
    image: card4,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "Created a responsive dashboard layout that adapts smoothly across devices and screen sizes and so on.",
    link: "#!",
  },
  {
    id: 5,
    image: card5,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "Implemented interactive charts and widgets to visualize product data effectively for stakeholders.",
    link: "#!",
  },
  {
    id: 6,
    image: card6,
    category: "FULL-STACK DEVELOPMENT",
    title: "Product Admin Dashboard",
    description:
      "Enhanced user experience by streamlining workflows and optimizing interface components and so on.",
    link: "#!",
  },
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(projectData);
        }
      } catch (error) {
        console.warn("Could not load dynamic projects from server. Using offline mock projects.");
        setProjects(projectData);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    const handleRefresh = () => fetchProjects();
    window.addEventListener("refresh-projects", handleRefresh);
    return () => window.removeEventListener("refresh-projects", handleRefresh);
  }, []);

  return (
    <div
      className="content mt-10 md:mt-15 xl:mt-25 mb-10 md:mb-25 max-xxl:p-2"
      id="portfolio"
    >
      <div className="xl:mb-17.5 mb-5">
        <div className="max-sm:px-2 text-center mx-auto max-w-144.25">
          <p className="section-title text-black dark:text-white">Portfolio</p>
          <p className="font-normal text-[18px] max-sm:text-[14px] pt-6 text-gray-400">
            Here's a selection of my recent work, showcasing my skills in
            creating user-centric and visually appealing interfaces.
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-picto-primary"></span>
        </div>
      ) : (
        <div className="mx-auto flex justify-center">
          <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
            {projects.map((data, index) => {
              // Ensure we fallback to a static card if the image URL is mock or index-based
              const isFallbackImgNeeded = !data.image || data.image.startsWith("card") || (!data.image.startsWith("http") && !data.image.startsWith("/"));
              const displayImage = isFallbackImgNeeded
                ? fallbackCards[index % fallbackCards.length]
                : data.image;

              return (
                <Projects
                  data={{
                    ...data,
                    image: displayImage,
                  }}
                  key={data._id || data.id || index}
                />
              );
            })}
          </div>
        </div>
      )}
      
      <div className="text-center">
        <a
          href="#!"
          className="btn btn-primary py-3 px-6 mt-12.5 text-center text-[16px] font-semibold"
        >
          More Project
        </a>
      </div>
    </div>
  );
};

export default Portfolio;
