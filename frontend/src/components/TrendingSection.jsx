import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const TrendingSection = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  const trendingProjects = projects.slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-16 border-t border-white/10 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔥</span>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Trending Now
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Check out the hottest projects from the community
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trendingProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} isTrending={true} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
