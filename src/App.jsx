import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Database, 
  LineChart, 
  Users, 
  Mail, 
  Github, 
  Linkedin, 
  ChevronRight, 
  Code2, 
  Cpu, 
  LayoutDashboard, 
  Map, 
  Target, 
  Award,
  ArrowRight,
  Menu,
  X,
  Phone,
  MapPin,
  Trophy,
  Zap,
  Globe,
  Search,
  Users2,
  ShieldCheck,
  PieChart,
  FlaskConical,
  ClipboardList,
  Coffee,
  FileSpreadsheet,
  Brain,
  Sparkles,
  Monitor,
  Webhook,
  Cloud,
  BookOpen,
  Terminal,
  Table,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interactive Chart Component ---
const ProjectChart = ({ type, data, colors, labels, yAxisLabel }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  const width = 400;
  const height = 140; 
  const paddingX = 50;
  const paddingY = 40;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Scaling logic
  const maxDataVal = type === 'bar' 
    ? Math.max(...(data.values || []))
    : Math.max(...(data.members || []), ...(data.casuals || []));
    
  const maxVal = Math.ceil((maxDataVal || 100) * 1.2 / 100) * 100;

  const gridSteps = 4;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => Math.round((maxVal / gridSteps) * i));

  const getX = (index) => {
    if (type === 'line') {
      return (index / (labels.length - 1)) * chartWidth + paddingX;
    } else {
      const barSpace = chartWidth / data.values.length;
      return (index * barSpace) + (barSpace / 2) + paddingX;
    }
  };

  const getY = (val) => {
    // Standardized vertical mapping for both grid and data
    return height - paddingY - (val / maxVal) * chartHeight;
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    
    const barSpace = chartWidth / labels.length;
    const index = Math.floor((mouseX - paddingX) / barSpace);
    
    if (index >= 0 && index < labels.length) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-zinc-950/95 rounded-t-lg border-b border-zinc-800 p-1 pt-6 overflow-hidden group/chart cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid Lines (except 0) & Y-Axis Labels */}
        {gridValues.map(val => val !== 0 && (
          <g key={val}>
            <line 
              x1={paddingX} y1={getY(val)} 
              x2={width - paddingX} y2={getY(val)} 
              stroke="#27272a" strokeDasharray="6 4" strokeWidth="0.8"
            />
            <text x={paddingX - 10} y={getY(val) + 2} fill="#a1a1aa" fontSize="8" fontWeight="bold" textAnchor="end">
              {val}
            </text>
          </g>
        ))}

        {/* X-Axis Labels */}
        {labels.map((l, i) => (
          <text 
            key={l} 
            x={getX(i)} 
            y={height - 8} 
            fill={hoveredIndex === i ? "#fff" : "#a1a1aa"} 
            fontSize="8" 
            fontWeight="bold" 
            textAnchor="middle"
            className="transition-colors duration-200 uppercase tracking-wider"
          >
            {l}
          </text>
        ))}

        {type === 'line' ? (
          <>
            <motion.path 
              d={labels.map((_, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(data.members[i])}`).join(' ')} 
              fill="none" stroke={colors.members} strokeWidth="2" filter="url(#glow)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} 
            />
            <motion.path 
              d={labels.map((_, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(data.casuals[i])}`).join(' ')} 
              fill="none" stroke={colors.casuals} strokeWidth="2" filter="url(#glow)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} 
            />
            {hoveredIndex !== null && (
              <g>
                <line x1={getX(hoveredIndex)} y1={paddingY} x2={getX(hoveredIndex)} y2={height - paddingY} stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />
                <circle cx={getX(hoveredIndex)} cy={getY(data.members[hoveredIndex])} r="4" fill="#fff" stroke={colors.members} strokeWidth="2" />
                <circle cx={getX(hoveredIndex)} cy={getY(data.casuals[hoveredIndex])} r="4" fill="#fff" stroke={colors.casuals} strokeWidth="2" />
              </g>
            )}
          </>
        ) : (
          data.values.map((v, i) => {
            const barW = (chartWidth / data.values.length) * 0.65;
            const x = getX(i) - barW / 2;
            const y = getY(v);
            const h = height - paddingY - y;
            const r = 6; // Corner radius
            
            // Path for top-rounded bar
            // If height is small, adjust radius
            const effR = Math.min(r, h/2);
            
            // Construct path d attribute
            // Start bottom-left, go up to top-left radius, curve, line to top-right radius, curve, down to bottom-right, close
            const pathD = `
              M ${x},${height - paddingY}
              L ${x},${y + effR}
              Q ${x},${y} ${x + effR},${y}
              L ${x + barW - effR},${y}
              Q ${x + barW},${y} ${x + barW},${y + effR}
              L ${x + barW},${height - paddingY}
              Z
            `;

            return (
              <g key={i}>
                {/* Visual Focus Background */}
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.rect 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      x={getX(i) - (chartWidth / data.values.length) / 2} 
                      y={paddingY - 20} 
                      width={chartWidth / data.values.length} 
                      height={chartHeight + 40} 
                      fill="#ffffff" 
                      fillOpacity="0.08" 
                      rx="24" 
                    />
                  )}
                </AnimatePresence>
                <motion.path 
                  d={pathD}
                  fill="url(#barGradient)"
                  initial={{ d: `
                    M ${x},${height - paddingY}
                    L ${x},${height - paddingY}
                    Q ${x},${height - paddingY} ${x + effR},${height - paddingY}
                    L ${x + barW - effR},${height - paddingY}
                    Q ${x + barW},${height - paddingY} ${x + barW},${height - paddingY}
                    L ${x + barW},${height - paddingY}
                    Z
                  `}}
                  animate={{ d: pathD }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
                />
              </g>
            );
          })
        )}

        {/* Baseline (0 value) - Drawn last to be on top */}
        <g>
          <line 
            x1={paddingX} y1={getY(0)} 
            x2={width - paddingX} y2={getY(0)} 
            stroke="#52525b" strokeWidth="1"
          />
          <text x={paddingX - 10} y={getY(0) + 2} fill="#a1a1aa" fontSize="8" fontWeight="bold" textAnchor="end">
            0
          </text>
        </g>
      </svg>

      {/* Floating Insight Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-8 right-8 bg-zinc-900/95 backdrop-blur-3xl border border-zinc-700/50 p-4 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.7)] z-20 pointer-events-none min-w-[240px]"
          >
            <p className="text-zinc-500 font-black text-[9px] uppercase tracking-[0.3em] mb-2">{labels[hoveredIndex]}</p>
            {type === 'line' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-8">
                  <span style={{ color: colors.members }} className="text-[10px] font-black uppercase">Members (K) :</span>
                  <span className="text-white font-black text-xl tracking-tighter">{data.members[hoveredIndex]}</span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span style={{ color: colors.casuals }} className="text-[10px] font-black uppercase">Casual (K) :</span>
                  <span className="text-white font-black text-xl tracking-tighter">{data.casuals[hoveredIndex]}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-8">
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{yAxisLabel} :</span>
                <span className="text-white font-black text-2xl tracking-tighter">{data.values[hoveredIndex]}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main App Component
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState('All');
  const [expandedProject, setExpandedProject] = useState(null);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const skillCategories = ['All', 'Marketing & Business', 'Data & Technical', 'Platforms & Tools'];

  const skills = [
    { name: 'Marketing Analytics & Insights', category: 'Marketing & Business', icon: BarChart3 },
    { name: 'Campaign Performance Analysis', category: 'Marketing & Business', icon: Target },
    { name: 'Customer Behavior Analysis', category: 'Marketing & Business', icon: Users },
    { name: 'A/B Testing & Experimentation', category: 'Marketing & Business', icon: FlaskConical },
    { name: 'Data Visualization & Storytelling', category: 'Marketing & Business', icon: LayoutDashboard },
    { name: 'Market Segmentation', category: 'Marketing & Business', icon: PieChart },
    { name: 'Growth Strategy', category: 'Marketing & Business', icon: Zap },
    { name: 'KPI Tracking & Reporting', category: 'Marketing & Business', icon: ClipboardList },
    { name: 'Python', category: 'Data & Technical', icon: Code2 },
    { name: 'SQL', category: 'Data & Technical', icon: Database },
    { name: 'R', category: 'Data & Technical', icon: Code2 },
    { name: 'Java', category: 'Data & Technical', icon: Coffee },
    { name: 'Pandas & NumPy', category: 'Data & Technical', icon: Table },
    { name: 'Matplotlib & Seaborn', category: 'Data & Technical', icon: LineChart },
    { name: 'Scikit-learn', category: 'Data & Technical', icon: Cpu },
    { name: 'Power BI', category: 'Data & Technical', icon: BarChart3 },
    { name: 'Tableau', category: 'Data & Technical', icon: PieChart },
    { name: 'Excel', category: 'Data & Technical', icon: FileSpreadsheet },
    { name: 'Machine Learning', category: 'Data & Technical', icon: Brain },
    { name: 'Generative AI & LLMs', category: 'Data & Technical', icon: Sparkles },
    { name: 'Streamlit Dashboards', category: 'Platforms & Tools', icon: Monitor },
    { name: 'REST APIs', category: 'Platforms & Tools', icon: Webhook },
    { name: 'AWS Basics', category: 'Platforms & Tools', icon: Cloud },
    { name: 'Azure Basics', category: 'Platforms & Tools', icon: Cloud },
    { name: 'Git & GitHub', category: 'Platforms & Tools', icon: Github },
    { name: 'Jupyter Notebooks', category: 'Platforms & Tools', icon: BookOpen },
    { name: 'VS Code', category: 'Platforms & Tools', icon: Terminal },
    { name: 'Google Analytics', category: 'Platforms & Tools', icon: Search },
  ];

  const projects = [
    {
      id: 'mobility',
      type: 'line',
      title: "Urban Mobility & Ridership Analysis",
      subtitle: '"How do rider behaviors differ across user segments and time periods in a major city transit system?"',
      tags: ["1M+ Records Analyzed", "User Behavior Segmentation", "Geospatial Viz"],
      insight: "Identified seasonal ridership patterns and behavioral differences between member and casual riders, enabling targeted engagement strategies.",
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartData: {
        members: [45, 42, 60, 95, 120, 130, 125, 118, 90, 70, 55, 48],
        casuals: [10, 8, 20, 35, 50, 60, 65, 58, 45, 30, 15, 12]
      },
      colors: { members: '#3b82f6', casuals: '#ec4899' }
    },
    {
      id: 'decarbonization',
      type: 'bar',
      title: "Chicago Building Decarbonization",
      subtitle: '"Which building segments contribute most to carbon emissions, and how can targeted interventions drive measurable impact?"',
      tags: ["5,000+ Properties", "Market Segmentation", "Impact Modeling"],
      insight: "Built performance metrics to identify top and bottom emission segments, demonstrating how targeted changes in industrial and commercial sectors drive the highest ROI on decarbonization efforts.",
      labels: ['Commercial', 'Residential', 'Industrial', 'Mixed Use'],
      chartData: {
        values: [850, 620, 1100, 480]
      },
      yAxisLabel: "Emissions (tons)",
      colors: { main: 'url(#barGradient)' }
    }
  ];

  const filteredSkills = activeSkillCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeSkillCategory);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-3 md:px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl md:text-2xl font-black tracking-tighter">PRADEEPYA<span className="text-blue-500">.</span></motion.div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{link.name}</a>
            ))}
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 bg-zinc-950 pt-24 px-6 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-xl md:text-3xl font-bold tracking-tight hover:text-blue-500 transition-colors">{link.name}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="py-12 px-3 pt-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Zap size={14} className="fill-current" />
                <span>CS Senior @ Illinois Tech</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black leading-[0.9] mb-4 md:mb-6 tracking-tighter uppercase tracking-[-0.04em]">Marketing / <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Business Analyst</span></h1>
              <p className="text-sm md:text-base text-zinc-400 max-w-lg mb-6 md:mb-8 leading-relaxed font-medium">Turning complex datasets into growth-driving narratives. I blend logical Computer Science depth with high-energy business intuition.</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4">
                <a href="#projects" className="px-4 md:px-8 py-2 md:py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-lg md:rounded-xl transition-all transform hover:scale-105 flex items-center justify-center group">View Work <ChevronRight size={14} className="md:size-[18px] ml-1 group-hover:translate-x-1 transition-transform" /></a>
                <a href="#contact" className="px-4 md:px-8 py-2 md:py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-lg md:rounded-xl border border-zinc-800 transition-all">Connect</a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 2.6, scale: 0.9 }} animate={{ opacity: 2.6, scale: 1 }} transition={{ duration: 1 }} className="relative justify-self-end">
              <div className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden transition-all duration-700 relative group border-2 border-zinc-800 shadow-2xl shadow-blue-500/10 max-w-xs h-80 md:h-96">
                <img src="milli_3.png" alt="Pradeepya Reddy" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-260" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6"><p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-1 md:mb-2">Chicago Based</p><p className="font-black tracking-tighter" style={{fontSize: '1.7rem'}}>Pradeepya Reddy Gadipally</p></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 md:py-16 px-3 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 md:mb-12 gap-3 md:gap-6">
              <div><h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter">Expertise<span className="text-blue-500">.</span></h2><p className="text-xs md:text-sm text-zinc-400 font-medium">Data storytelling, technical depth, and strategic growth optimization.</p></div>
              <div className="flex flex-wrap bg-zinc-900 p-2 rounded-2xl border border-zinc-800 gap-2 shadow-2xl">
                {skillCategories.map((cat) => (
                  <button key={cat} onClick={() => setActiveSkillCategory(cat)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSkillCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => (
                  <motion.div key={skill.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 hover:border-blue-500/50 transition-all group relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity"><skill.icon size={50} /></div>
                    <div className="flex items-center gap-2 mb-3"><div className="p-2 bg-zinc-950 rounded-lg group-hover:text-blue-400 transition-colors shadow-inner"><skill.icon size={16} /></div><span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] group-hover:text-zinc-400 transition-colors">{skill.category}</span></div>
                    <h3 className="text-sm font-black leading-tight tracking-tight">{skill.name}</h3>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-12 md:py-16 px-3 md:px-6 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12"><h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter">Experience<span className="text-green-500">.</span></h2><p className="text-xs md:text-sm text-zinc-400">Professional and Academic milestones in data and research.</p></div>
            <div className="space-y-8">
              {[
                { role: "Administrator", company: "Chicago Public Schools (CPS)", period: "2025 – Present", highlights: "Managing critical data workflows for over 10,000 students. Ensuring 100% compliance through marketing-ops style management and process optimization.", stats: "10K+ Student Records", icon: Database },
                { role: "Research Assistant", company: "Illinois Tech (Prof. Minxuan Zhou)", period: "Sep 2024 – Aug 2025", highlights: "Worked on Privacy-Preserving Computing through tensors and high-performance Python libraries for secure data analysis.", stats: "Privacy Computing", icon: ShieldCheck },
                { role: "Teaching Assistant", company: "Illinois Institute of Technology", period: "2023 – Present", highlights: "Led technical mentoring in Data Structures and Algorithms while driving professional development initiatives to improve students' coding skills and career readiness. Under the guidance of Prof. Shouvik Roy and Prof. Bauer.", stats: "100+ Students Mentored", icon: Code2 }
              ].map((exp, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex flex-col md:flex-row gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl group-hover:border-green-500/30 transition-all shadow-2xl">
                    <div className="md:w-1/4"><div className="flex items-center space-x-2 text-green-400 mb-3"><exp.icon size={20} /><span className="font-black tracking-[0.2em] uppercase text-[10px]">{exp.period}</span></div><h3 className="text-xl font-black mb-2 leading-tight tracking-tighter">{exp.role}</h3><p className="text-zinc-500 font-bold text-xs tracking-widest uppercase">{exp.company}</p></div>
                    <div className="md:w-1/2"><p className="text-zinc-400 leading-relaxed font-medium text-sm">{exp.highlights}</p></div>
                    <div className="md:w-1/4 flex items-center justify-end"><div className="text-right p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-green-500/20 shadow-inner"><div className="text-xl font-black text-white mb-1 tracking-tighter">{exp.stats}</div><div className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">Milestone Impact</div></div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

       {/* Experience Section */}
        <section id="experience" className="py-12 md:py-16 px-3 md:px-6 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12"><h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter">Exec Member<span className="text-green-500">.</span></h2><p className="text-xs md:text-sm text-zinc-400">Professional and Academic milestones in data and research.</p></div>
            <div className="space-y-8">
              {[
                { role: "Vice-President of Diversity, Equity, and Inclusion (DEI)", company: "SGA, Illinois Tech", period: "Jul 2025 – Present", highlights: "Led campus-wide DEI initiatives, amplified marginalized voices to foster cultural belonging", stats: "Organize Budget for 250+ Clubs", icon: Database },
                { role: "Vice-President of Culture Club", company: "Illinois Tech", period: "Mar 2025 – Present", highlights: "Organized multiple cross-cultural events and built an inclusive community that celebrates traditions.", stats: "5+ Events Organized", icon: ShieldCheck },
              ].map((exp, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex flex-col md:flex-row gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl group-hover:border-green-500/30 transition-all shadow-2xl">
                    <div className="md:w-1/4"><div className="flex items-center space-x-2 text-green-400 mb-3"><exp.icon size={20} /><span className="font-black tracking-[0.2em] uppercase text-[10px]">{exp.period}</span></div><h3 className="text-xl font-black mb-2 leading-tight tracking-tighter">{exp.role}</h3><p className="text-zinc-500 font-bold text-xs tracking-widest uppercase">{exp.company}</p></div>
                    <div className="md:w-1/2"><p className="text-zinc-400 leading-relaxed font-medium text-sm">{exp.highlights}</p></div>
                    <div className="md:w-1/4 flex items-center justify-end"><div className="text-right p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-green-500/20 shadow-inner"><div className="text-xl font-black text-white mb-1 tracking-tighter">{exp.stats}</div><div className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">Milestone Impact</div></div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        

        {/* Projects Section with Correct Bar Proportions */}
        <section id="projects" className="py-12 md:py-16 px-3 md:px-6 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12"><h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter">Data Narratives<span className="text-orange-500">.</span></h2><p className="text-xs md:text-sm text-zinc-400">Turning raw numbers into interactive, growth-driving insights.</p></div>
            <div className="grid lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <motion.div key={project.id} layout className="bg-zinc-900 border border-zinc-800 rounded-xl md:rounded-2xl overflow-hidden flex flex-col shadow-2xl group border-t-zinc-700/50">
                  <ProjectChart type={project.type} data={project.chartData} colors={project.colors} labels={project.labels} yAxisLabel={project.yAxisLabel} />
                  <div className="p-4 lg:p-8 flex flex-col flex-grow bg-zinc-900/80">
                    <h3 className="text-2xl lg:text-3xl font-black mb-3 tracking-tighter leading-none">{project.title}</h3>
                    <p className="text-zinc-500 italic mb-6 text-xs lg:text-sm leading-relaxed tracking-tight">{project.subtitle}</p>
                    <div className="flex flex-wrap gap-2 mb-6">{project.tags.map(tag => (<span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-500/20 shadow-2xl">{tag}</span>))}</div>
                    <div className="mt-auto border-l-4 border-pink-500 bg-pink-500/10 p-4 rounded-r-lg shadow-2xl">
                      <div className="flex items-center gap-2 mb-3 text-zinc-100 font-black"><Lightbulb className="text-yellow-400 fill-yellow-400/20" size={18} /><span className="text-xs uppercase tracking-[0.2em]">Insight & Impact</span></div>
                      <p className="text-zinc-300 text-xs leading-relaxed font-semibold">{project.insight}</p>
                    </div>
                    <button onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)} className="mt-6 py-3 px-4 bg-zinc-950 border border-zinc-800 rounded-lg font-black uppercase tracking-[0.5em] text-[10px] hover:bg-zinc-100 hover:text-zinc-950 transition-all flex items-center justify-center gap-2 shadow-2xl">
                      {expandedProject === project.id ? 'Hide' : 'Details'} <ArrowRight size={14} className={expandedProject === project.id ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    </button>
                    <AnimatePresence>
                      {expandedProject === project.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-4 border-t border-zinc-800 mt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner"><p className="text-[7px] font-black text-zinc-600 uppercase mb-2 tracking-[0.5em]">Dataset Size</p><p className="font-black text-lg tracking-tighter">{project.id === 'mobility' ? '1.2M+ Rows' : '5,000+ Properties'}</p></div>
                              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner"><p className="text-[7px] font-black text-zinc-600 uppercase mb-2 tracking-[0.5em]">Tech Stack</p><p className="font-black text-lg tracking-tighter">SQL / Python / Pandas</p></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-16 px-3 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
              <div><h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 leading-[1] tracking-tighter uppercase">LET'S<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Optimize</span><br/>YOUR DATA.</h2>
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-12"><div className="flex items-center space-x-3 md:space-x-4 group"><div className="p-3 md:p-4 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-blue-500/50 transition-all shadow-2xl"><Mail className="text-blue-400" size={18} /></div><div><p className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Email Me</p><p className="font-black text-sm md:text-base tracking-tight break-all">gpradeepyar@gmail.com</p></div></div><div className="flex items-center space-x-3 md:space-x-4 group"><div className="p-3 md:p-4 bg-zinc-900 rounded-lg border border-zinc-800 group-hover:border-green-500/50 transition-all shadow-2xl"><Phone className="text-green-400" size={18} /></div><div><p className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Call Me</p><p className="font-black text-sm md:text-base tracking-tight">(470) 445-5881</p></div></div></div>
                <div className="flex space-x-3 md:space-x-4">{[{ icon: Github, link: "https://github.com/GPradeepyaReddy" }, { icon: Linkedin, link: "https://www.linkedin.com/in/pradeepya-reddy-gadipally-39b568254/" }, { icon: Mail, link: "mailto:gpradeepyar@gmail.com" }].map((social, idx) => (<a key={idx} href={social.link} target="_blank" className="p-3 md:p-4 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"><social.icon size={18} className="md:size-[20px]" /></a>))}</div>
              </div>
              <div className="bg-zinc-900 p-6 md:p-8 rounded-lg md:rounded-2xl border border-zinc-800 shadow-2xl">
                <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6"><div className="space-y-1 md:space-y-2"><label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Full Name</label><input type="text" className="w-full bg-zinc-950 border border-zinc-800 p-2 md:p-3 rounded-lg focus:border-blue-500 outline-none transition-all font-bold text-xs md:text-sm" placeholder="John Doe" /></div><div className="space-y-1 md:space-y-2"><label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Email Address</label><input type="email" className="w-full bg-zinc-950 border border-zinc-800 p-2 md:p-3 rounded-lg focus:border-blue-500 outline-none transition-all font-bold text-xs md:text-sm" placeholder="john@example.com" /></div></div>
                  <div className="space-y-1 md:space-y-2"><label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Service Category</label><select className="w-full bg-zinc-950 border border-zinc-800 p-2 md:p-3 rounded-lg focus:border-blue-500 outline-none transition-all font-black text-xs md:text-sm appearance-none uppercase tracking-widest"><option>Marketing Analytics</option><option>Data Visualization</option><option>Campaign Audit</option><option>Other</option></select></div>
                  <button className="w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.6em] text-[10px] md:text-xs rounded-lg transition-all shadow-xl shadow-blue-900/40 active:scale-[0.97]">Submit Inquiry</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 md:py-12 px-3 md:px-6 border-t border-zinc-800 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6"><p className="text-zinc-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-center md:text-left">© {new Date().getFullYear()} Pradeepya Reddy Gadipally<span className="text-blue-500 mx-2">/</span>CS + Business Intent</p>
          <div className="flex space-x-3 md:space-x-6 text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] text-zinc-600"><a href="#" className="hover:text-white transition-colors">Privacy</a><a href="#" className="hover:text-white transition-colors">Terms</a><a href="#home" className="hover:text-white transition-colors flex items-center">Back to Top <ChevronRight size={12} className="md:size-[14px] -rotate-90 ml-1" /></a></div>
        </div>
      </footer>
    </div>
  );
}
