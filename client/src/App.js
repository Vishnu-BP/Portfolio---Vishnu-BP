import React, { useState, useEffect, useCallback } from 'react';
import { 
    Home, User, Code, Mail, LogIn, Sun, Moon, Filter, CheckCircle, XCircle, 
    Github, Send, Briefcase, BookOpen, Trash2, Edit, Save, Plus, X, List, Hash,
    Twitter, Linkedin, Instagram, LogOut
} from 'lucide-react';

// --- CONFIGURATION ---
// Set the base URL for your Express backend
const API_BASE_URL = 'https://portfolio-vishnu-bp.onrender.com';

// --- MOCK DATA (Fallback if API is down) ---
const mockProjects = [
  {
    _id: '1',
    name: 'MERN Stack E-commerce Platform',
    description: 'A full-featured e-commerce site with product catalog, cart, checkout, and integrated Stripe payment processing. Features JWT authentication for secure access.',
    tags: ['React', 'Express', 'MongoDB', 'Node.js', 'Stripe'],
    category: 'Web',
    liveLink: '#',
    githubLink: 'https://github.com/user/ecommerce-mock',
    imageUrl: 'https://placehold.co/400x250/2563EB/ffffff?text=E-Commerce+App'
  },
  {
    _id: '2',
    name: 'Predictive ML Model Deployment',
    description: 'Developed a machine learning model to predict housing prices and deployed it using Flask, with a simple React front end for user input.',
    tags: ['Python', 'Scikit-learn', 'Flask', 'React', 'Deployment'],
    category: 'ML/AI',
    liveLink: '#',
    githubLink: 'https://github.com/user/ml-predictor-mock',
    imageUrl: 'https://placehold.co/400x250/10B981/ffffff?text=ML+Model+Dashboard'
  },
];

const mockBlogs = [
  {
    _id: 'b1',
    title: 'The Future of Serverless Computing',
    slug: 'future-serverless-computing',
    summary: 'Exploring how AWS Lambda and Google Cloud Functions are changing deployment workflows and cost models for modern applications.',
    date: '2024-10-15T00:00:00.000Z',
    content: 'This is the detailed markdown content for the blog post. In a real application, this would be retrieved from MongoDB and rendered using a library like `react-markdown`.'
  },
  {
    _id: 'b2',
    title: 'Optimizing React Performance with Memoization',
    slug: 'optimizing-react-performance',
    summary: 'A deep dive into `useMemo` and `useCallback` to prevent unnecessary re-renders in large React applications.',
    date: '2024-09-28T00:00:00.000Z',
    content: 'Details on performance optimization techniques...'
  }
];

const mockExperience = [
//   { type: 'Work', title: 'Senior Software Engineer', company: 'Tech Corp', years: '2022 - Present', description: 'Led development of microservices using Node.js and deployed applications on Kubernetes.' },
//   { type: 'Work', title: 'Junior Developer', company: 'Startup XYZ', years: '2020 - 2022', description: 'Contributed to the initial build-out of a SaaS platform using React and Django.' },
  { type: 'Education', title: 'Bachelor of Engineering (BE)', company: 'Visvesvaraya Technological University, Hassan', years: '2022 - Present', description: 'Specialized in Computer Science and Engineering.' },
  { type: 'Education', title: 'Intermediate', company: 'ASC Independent PU Collage, Bengaluru', years: '2019 - 2021', description: 'Science' },
  { type: 'Education', title: 'Matriculation', company: 'JSS Public School Bage, Hassan', years: '2009 - 2019', description: 'General Studies.' }
];

// --- UTILITY FUNCTIONS ---

// Helper function to fetch data and include JWT token if available
const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    
    // Check for unauthorized access
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
    }

    return response;
};

// --- UTILITY COMPONENTS ---

const ProjectCard = ({ project }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1">
    <img 
        src={project.imageUrl} 
        alt={project.name} 
        className="w-full h-40 object-cover rounded-lg mb-4" 
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/6B7280/ffffff?text=Image+Missing'; }}
    />
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.tags && project.tags.map(tag => (
        <span key={tag} className="px-3 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full dark:bg-cyan-900 dark:text-cyan-200">
          {tag}
        </span>
      ))}
    </div>
    <div className="flex space-x-4">
      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-200 font-semibold transition-colors">
        <List size={16} />
        <span>Live Demo</span>
      </a>
      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-300 font-semibold transition-colors">
        <Github size={16} />
        <span>GitHub</span>
      </a>
    </div>
  </div>
);

const TimelineItem = ({ item }) => (
  <div className="relative pl-8 sm:pl-16 py-6 group">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">{item.title}</h3>
      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{item.years}</span>
    </div>
    <p className="text-base text-cyan-600 dark:text-cyan-400 font-medium">{item.company}</p>
    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">{item.description}</p>
    
    {/* Timeline Dot and Line */}
    <div className="absolute left-0 top-0 mt-6 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
    <div className={`absolute left-0 top-6 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 ${item.type === 'Work' ? 'bg-cyan-500' : 'bg-indigo-500'} -translate-x-1/2`}></div>
  </div>
);

const Notification = ({ message, type, onClose }) => {
    const icon = type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white ${bgColor} flex items-center space-x-3 transition-opacity duration-300 z-50`}>
            {icon}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-75 hover:opacity-100">
                <X size={16} />
            </button>
        </div>
    );
};

// --- ADMIN SUB-COMPONENTS (CRUD Management) ---

const ProjectManager = ({ onNotify, refreshData, projects }) => {
    const initialFormState = { name: '', description: '', tags: '', category: 'Web', imageUrl: '', liveLink: '#', githubLink: '#' };
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const categories = ['Web', 'ML/AI', 'Mobile', 'Design', 'Other'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            ...project,
            // Convert tags array back to comma-separated string for editing
            tags: project.tags.join(', ')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const response = await authFetch(`${API_BASE_URL}/projects/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onNotify('Project deleted successfully!', 'success');
                refreshData();
            } else {
                onNotify('Failed to delete project.', 'error');
            }
        } catch (error) {
            onNotify('Network error during deletion.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const projectData = {
            ...formData,
            // Convert tags string to array
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        };

        const method = editingProject ? 'PUT' : 'POST';
        const url = editingProject ? `${API_BASE_URL}/projects/${editingProject._id}` : `${API_BASE_URL}/projects`;

        try {
            const response = await authFetch(url, {
                method: method,
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                onNotify(`Project ${editingProject ? 'updated' : 'created'} successfully!`, 'success');
                setFormData(initialFormState);
                setEditingProject(null);
                refreshData();
            } else {
                const errorData = await response.json();
                onNotify(errorData.message || `Failed to ${editingProject ? 'update' : 'create'} project.`, 'error');
            }
        } catch (error) {
            onNotify('Network error during submission.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Project Form */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-6">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Name and Category */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Project Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Tags */}
                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (e.g., React, Node.js, MongoDB - comma-separated)"
                        value={formData.tags}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />

                    {/* Links */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            type="url"
                            name="liveLink"
                            placeholder="Live Demo URL (e.g., https://example.com)"
                            value={formData.liveLink}
                            onChange={handleInputChange}
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                         <input
                            type="url"
                            name="githubLink"
                            placeholder="GitHub URL (e.g., https://github.com/user/repo)"
                            value={formData.githubLink}
                            onChange={handleInputChange}
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    
                    {/* Image URL */}
                    <input
                        type="url"
                        name="imageUrl"
                        placeholder="Image URL (from Cloudinary or similar service)"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Detailed Project Description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                    ></textarea>
                    
                    {/* Actions */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex justify-center items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors disabled:bg-cyan-400"
                        >
                            {isSubmitting ? 'Saving...' : (editingProject ? <><Save size={20} /> <span>Update Project</span></> : <><Plus size={20} /> <span>Add Project</span></>)}
                        </button>
                        {editingProject && (
                            <button
                                type="button"
                                onClick={() => { setEditingProject(null); setFormData(initialFormState); }}
                                className="px-6 py-3 border border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} className="inline mr-2" /> Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Project List */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Existing Projects ({projects.length})</h3>
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                            <span className="font-medium text-gray-800 dark:text-white truncate pr-4">{project.name}</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {projects.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">No projects found. Use the form above to add one!</p>
                )}
            </div>
        </div>
    );
};

const BlogManager = ({ onNotify, refreshData, blogs }) => {
    const initialFormState = { title: '', summary: '', content: '', tags: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            ...blog,
            tags: blog.tags.join(', ')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const response = await authFetch(`${API_BASE_URL}/blogs/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onNotify('Blog post deleted successfully!', 'success');
                refreshData();
            } else {
                onNotify('Failed to delete blog post.', 'error');
            }
        } catch (error) {
            onNotify('Network error during deletion.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const blogData = {
            ...formData,
            // Convert tags string to array
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        };

        // Note: The backend model generates the slug on POST/PUT
        const method = editingBlog ? 'PUT' : 'POST';
        const url = editingBlog ? `${API_BASE_URL}/blogs/${editingBlog._id}` : `${API_BASE_URL}/blogs`;

        try {
            const response = await authFetch(url, {
                method: method,
                body: JSON.stringify(blogData),
            });

            if (response.ok) {
                onNotify(`Blog post ${editingBlog ? 'updated' : 'created'} successfully!`, 'success');
                setFormData(initialFormState);
                setEditingBlog(null);
                refreshData();
            } else {
                const errorData = await response.json();
                onNotify(errorData.message || `Failed to ${editingBlog ? 'update' : 'create'} blog post.`, 'error');
            }
        } catch (error) {
            onNotify('Network error during submission.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Blog Form */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-6">
                    {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Title and Summary */}
                    <input
                        type="text"
                        name="title"
                        placeholder="Blog Title (will auto-generate slug)"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                        name="summary"
                        placeholder="Short Summary for the Blog Listing"
                        rows="2"
                        value={formData.summary}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                    ></textarea>

                    {/* Content (Markdown Editor Placeholder) */}
                    <textarea
                        name="content"
                        placeholder="Full Blog Content (use Markdown formatting)"
                        rows="10"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    ></textarea>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Note: Full Markdown rendering for preview is not implemented but content will be saved as Markdown text.
                    </p>

                    {/* Tags */}
                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (e.g., React, Serverless, Python - comma-separated)"
                        value={formData.tags}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />

                    {/* Actions */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex justify-center items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors disabled:bg-cyan-400"
                        >
                            {isSubmitting ? 'Saving...' : (editingBlog ? <><Save size={20} /> <span>Update Blog</span></> : <><Plus size={20} /> <span>Add Blog</span></>)}
                        </button>
                        {editingBlog && (
                            <button
                                type="button"
                                onClick={() => { setEditingBlog(null); setFormData(initialFormState); }}
                                className="px-6 py-3 border border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} className="inline mr-2" /> Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Blog List */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Existing Blog Posts ({blogs.length})</h3>
                <div className="space-y-4">
                    {blogs.map(blog => (
                        <div key={blog._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                            <span className="font-medium text-gray-800 dark:text-white truncate pr-4">{blog.title}</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(blog)}
                                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {blogs.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">No blog posts found. Use the form above to add one!</p>
                )}
            </div>
        </div>
    );
};


// --- CORE APPLICATION COMPONENTS ---

const HomeSection = ({ navigate }) => {
  const [typedText, setTypedText] = useState('');
  const tagline = "Fuull Stack Developer | ML Enthusiast | Creator";
  const speed = 75; // milliseconds per character

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < tagline.length) {
        setTypedText(prev => prev + tagline.charAt(i));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, speed);
    return () => clearInterval(typingEffect);
  }, []);
  
  const coreTech = [
    { name: 'MongoDB', iconClass: 'text-emerald-500', icon: <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><ellipse cx="128" cy="128" rx="104" ry="40" fill="currentColor" opacity="0.2"/><ellipse cx="128" cy="128" rx="104" ry="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M24,128v48c0,22.09,46.53,40,104,40s104-17.91,104-40V128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M24,128c0-22.09,46.53-40,104-40s104,17.91,104,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M24,80v48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M232,80v48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M24,80c0-22.09,46.53-40,104-40s104,17.91,104,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg> },
    { name: 'Express.js', iconClass: 'text-cyan-500', icon: <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" opacity="0.2"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M128,64c-35.35,0-64,28.65-64,64s28.65,64,64,64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M192,128c0-35.35-28.65-64-64-64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg> },
    { name: 'React', iconClass: 'text-blue-500', icon: <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" opacity="0.2"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><circle cx="128" cy="128" r="12" fill="currentColor"/><ellipse cx="128" cy="128" rx="88" ry="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><ellipse cx="128" cy="128" rx="32" ry="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><ellipse cx="128" cy="128" rx="80" ry="80" transform="rotate(60 128 128)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><ellipse cx="128" cy="128" rx="80" ry="80" transform="rotate(120 128 128)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg> },
    { name: 'Node.js', iconClass: 'text-green-500', icon: <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" opacity="0.2"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="64" x2="128" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="192" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="168" y1="96" x2="88" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="88" y1="96" x2="168" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg> },
  ];

  return (
    <section id="home" className="min-h-screen pt-16 flex items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-xl font-medium text-cyan-600 dark:text-cyan-400 animate-fadeInUp delay-100">Hi, I'm</p>
        <h1 className="text-7xl sm:text-8xl font-extrabold text-gray-900 dark:text-white leading-tight animate-fadeInUp delay-200">
          Vishnu BP
        </h1>
        <h2 className="text-3xl sm:text-4xl font-light text-gray-700 dark:text-gray-300 h-10 animate-fadeInUp delay-300">
          {typedText}
          <span className="inline-block w-1 bg-cyan-500 animate-blink">|</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fadeInUp delay-400">
          Crafting scalable and user-friendly digital experiences with a focus on clean code and robust MERN stack architecture.
        </p>
        
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 pt-2 text-gray-700 dark:text-gray-300 animate-fadeInUp delay-450">
            <a href="https://github.com/Vishnu-BP" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors"><Github size={28} /></a>
            <a href="https://www.linkedin.com/in/vishnu-bp/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors"><Linkedin size={28} /></a>
            <a href="vishnubp71@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors"><Twitter size={28} /></a>
            <a href="https://www.instagram.com/vishnu.beinghimself/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors"><Instagram size={28} /></a>
        </div>

        <div className="flex justify-center space-x-4 pt-4 animate-fadeInUp delay-500">
          <button
            onClick={() => navigate('contact')}
            className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-700 transition-colors transform hover:scale-105"
          >
            Hire Me
          </button>
          <a
            href="https://drive.google.com/file/d/1F3JxLp2JbNDviBGWe_3kEo8IDE2WCKHN/view?usp=drive_link" // Replace with actual resume link
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-cyan-600 text-cyan-600 dark:text-cyan-400 font-semibold rounded-full hover:bg-cyan-100 dark:hover:bg-gray-800 transition-colors transform hover:scale-105"
          >
            View Resume
          </a>
        </div>
        
        {/* Core Technologies Showcase */}
        <div className="flex justify-center space-x-10 pt-16 animate-fadeInUp delay-600">
            {coreTech.map(tech => (
                <div key={tech.name} className={`flex flex-col items-center ${tech.iconClass} transition-transform hover:scale-110 duration-300`}>
                    {tech.icon}
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">{tech.name}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
    const skills = [
        { name: 'React', level: 95, color: 'cyan' },
        { name: 'Node.js/Express', level: 85, color: 'cyan' },
        { name: 'MongoDB', level: 90, color: 'cyan' },
        { name: 'Git/CRUD operations', level: 95, color: 'cyan' },
        { name: 'Python/ML', level: 80, color: 'cyan' },
        { name: 'Programming - Python/Java', level: 85, color: 'cyan' },
    ];
    
    const SkillBar = ({ name, level, color }) => (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-900 dark:text-white">{name}</span>
                <span className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>{level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                    className={`h-2.5 rounded-full bg-${color}-600 transition-all duration-1000 ease-out`} 
                    style={{ width: `${level}%` }}
                ></div>
            </div>
        </div>
    );
    
    return (
        <section id="about" className="py-20 px-8 bg-white dark:bg-gray-800 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
                    About <span className="text-cyan-600 dark:text-cyan-400">Me</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Profile */}
                    <div className="md:col-span-1 space-y-6">
                        <img 
                            src="/images/profile.png" 
                            alt="Profile" 
                            className="w-full max-w-xs md:max-w-none rounded-2xl shadow-xl mx-auto"
                        />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vishnu BP, The Developer</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            A passionate and forward-thinking Computer Science Engineer with a strong foundation in Machine Learning and Web Development. Willing to apply analytical thinking and creative design skills to build intelligent, user-centric applications. Seeking an opportunity to work on impactful projects that harness data-driven insights and modern web technologies. Dedicated to continuous learning and contributing to innovative solution  in dynamic, team-oriented environments. Skilled in developing scalable ML models and responsive web interfaces using industry-standard tools and frameworks.
                        </p>
                        <a href="https://drive.google.com/file/d/1F3JxLp2JbNDviBGWe_3kEo8IDE2WCKHN/view" className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                           <Briefcase size={20} />
                           <span>Download Full Resume</span>
                        </a>
                    </div>
                    
                    {/* Skills */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Technical Skills</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {skills.map(skill => <SkillBar key={skill.name} {...skill} />)}
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Experience & Education</h3>
                        <div className="border-l-4 border-cyan-500 dark:border-cyan-700 space-y-8">
                            {mockExperience.map((item, index) => (
                                <TimelineItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ProjectsSection = () => {
  const categories = ['All', 'Web', 'ML/AI', 'Mobile', 'Design'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState(mockProjects); // Start with mock data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch projects from the API
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.length > 0 ? data : mockProjects);
        setError(false);
      } else {
        setError(true);
        setProjects(mockProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError(true);
      setProjects(mockProjects);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter logic
  const filteredProjects = projects.filter(project => 
    activeFilter === 'All' || project.category === activeFilter
  );

  return (
    <section id="projects" className="py-20 px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
            My <span className="text-cyan-600 dark:text-cyan-400">Projects</span>
        </h2>
        
        {/* API Status Message */}
        {error && (
            <div className="mb-8 p-4 text-center text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-lg">
                <p>Could not connect to the backend server. Displaying mock projects as a fallback.</p>
            </div>
        )}

        {/* Project Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md ${
                activeFilter === cat 
                  ? 'bg-cyan-600 text-white shadow-cyan-500/50' 
                  : 'bg-white text-gray-800 hover:bg-cyan-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter size={16} className="inline-block mr-2" />
              {cat}
            </button>
          ))}
        </div>
        
        {/* Loading Indicator */}
        {loading && initialLoad && (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading projects...</p>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-600 dark:text-gray-400 text-lg">No projects found in the selected category.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const BlogsSection = ({ navigate, onSelectBlog }) => {
    const [blogs, setBlogs] = useState(mockBlogs); // Start with mock data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Fetch blogs from the API
    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/blogs`);
            if (response.ok) {
                const data = await response.json();
                setBlogs(data.length > 0 ? data : mockBlogs);
                setError(false);
            } else {
                setError(true);
                setBlogs(mockBlogs);
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            setError(true);
            setBlogs(mockBlogs);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return (
        <section id="blogs" className="py-20 px-8 bg-white dark:bg-gray-800 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
                    Latest <span className="text-cyan-600 dark:text-cyan-400">Articles</span>
                </h2>
                
                {/* API Status Message */}
                {error && (
                    <div className="mb-8 p-4 text-center text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-lg">
                        <p>Could not connect to the backend server. Displaying mock articles as a fallback.</p>
                    </div>
                )}
                
                {/* Loading Indicator */}
                {loading && initialLoad && (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading articles...</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogs.map(blog => (
                        <div 
                            key={blog._id} 
                            className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => onSelectBlog(blog)}
                        >
                            {/* Format date from ISO string (or other backend format) */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(blog.date || blog.createdAt).toLocaleDateString()}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                                {blog.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{blog.summary}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags && blog.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                        <Hash size={10} className="inline mr-1" />{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
                                <BookOpen size={16} />
                                <span>Read More</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BlogDetail = ({ blog, onBack }) => (
    <section className="min-h-screen py-20 px-8 bg-white dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={onBack} 
                className="mb-8 px-4 py-2 text-sm text-cyan-600 dark:text-cyan-400 border border-cyan-600 dark:border-cyan-400 rounded-full hover:bg-cyan-50 dark:hover:bg-gray-700 transition-colors"
            >
                &larr; Back to Articles
            </button>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Published on {new Date(blog.date || blog.createdAt).toLocaleDateString()}</p>
            
            <div className="prose dark:prose-invert max-w-none">
                {/* Note: In a real app, this would use a library like react-markdown to render blog.content */}
                {/* The whitespace-pre-wrap utility preserves formatting in the textarea content */}
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                        {blog.tags && blog.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const ContactSection = ({ onNotify }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onNotify('Message sent successfully! I will be in touch soon.', 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        onNotify(errorData.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      onNotify('An unexpected error occurred. Check your network.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
            Get In <span className="text-cyan-600 dark:text-cyan-400">Touch</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              name="message"
              id="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-colors"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors disabled:bg-cyan-400"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send Message</span>
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              I will respond to your query within 24 hours.
          </p>
        </form>
      </div>
    </section>
  );
};

const AdminPanel = ({ onLoginSuccess, isAuthenticated, navigate }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [adminView, setAdminView] = useState('dashboard'); // 'dashboard', 'projects', 'blogs'
    
    // States to pass down to managers
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    // Helper to refresh all content data
    const refreshData = useCallback(async () => {
        // Fetch Projects
        try {
            const projectsResponse = await fetch(`${API_BASE_URL}/projects`);
            if (projectsResponse.ok) {
                const data = await projectsResponse.json();
                setProjects(data);
            }
        } catch (e) {
            console.error('Failed to fetch projects in Admin:', e);
        }

        // Fetch Blogs
        try {
            const blogsResponse = await fetch(`${API_BASE_URL}/blogs`);
            if (blogsResponse.ok) {
                const data = await blogsResponse.json();
                setBlogs(data);
            }
        } catch (e) {
            console.error('Failed to fetch blogs in Admin:', e);
        }
    }, []);

    // Load data on component mount or authentication change
    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        }
    }, [isAuthenticated, refreshData]);

    const handleNotify = (message, type) => setNotification({ message, type });
    const clearNotification = () => setNotification({ message: '', type: '' });


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                onLoginSuccess(true);
                setCredentials({ username: '', password: '' });
                handleNotify('Logged in successfully!', 'success');
            } else {
                const errorData = await response.json();
                setLoginError(errorData.message || 'Invalid credentials.');
            }
        } catch (error) {
            setLoginError('Could not connect to the authentication server.');
        } finally {
            setIsLoggingIn(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        onLoginSuccess(false);
        handleNotify('Logged out successfully.', 'success');
        navigate('home');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <Notification message={notification.message} type={notification.type} onClose={clearNotification} />
                <form onSubmit={handleLogin} className="w-full max-w-md p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Admin Login</h2>
                    {loginError && <p className="text-red-500 text-center">{loginError}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-cyan-400"
                    >
                        {isLoggingIn ? 'Logging In...' : <><LogIn size={20} className="inline mr-2" /> Log In</>}
                    </button>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Use your temporary admin credentials to log in.
                    </p>
                </form>
            </div>
        );
    }
    
    // Authenticated Admin Dashboard View
    const renderAdminContent = () => {
        if (adminView === 'projects') {
            return <ProjectManager onNotify={handleNotify} refreshData={refreshData} projects={projects} />;
        }
        if (adminView === 'blogs') {
            return <BlogManager onNotify={handleNotify} refreshData={refreshData} blogs={blogs} />;
        }
        
        // Dashboard View
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-green-500">
                        <p className="text-gray-500 dark:text-gray-400">Total Projects</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-yellow-500">
                        <p className="text-gray-500 dark:text-gray-400">Total Blogs</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{blogs.length}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-blue-500">
                        <p className="text-gray-500 dark:text-gray-400">New Messages (Mock)</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">Use Light Theme for Best Experience</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <button 
                        onClick={() => setAdminView('projects')}
                        className="p-8 bg-cyan-600 text-white rounded-xl shadow-lg hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-3 text-xl font-semibold"
                    >
                        <Code size={24} /> <span>Manage Projects</span>
                    </button>
                    <button 
                        onClick={() => setAdminView('blogs')}
                        className="p-8 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-3 text-xl font-semibold"
                    >
                        <BookOpen size={24} /> <span>Manage Articles</span>
                    </button>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="mt-8 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Log Out
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-20 px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <Notification message={notification.message} type={notification.type} onClose={clearNotification} />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
                        {adminView === 'dashboard' ? 'Admin Dashboard' : 
                         adminView === 'projects' ? 'Project Manager' : 'Article Manager'}
                    </h2>
                    {adminView !== 'dashboard' && (
                         <button 
                            onClick={() => setAdminView('dashboard')}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            &larr; Back to Dashboard
                        </button>
                    )}
                </div>
                
                {renderAdminContent()}
            </div>
        </div>
    );
};


const Navigation = ({ currentPage, navigate, toggleTheme, isDarkMode, isAuthenticated, onAdminClick, onLogout }) => {
    const navItems = [
        { name: 'Home', icon: Home, route: 'home' },
        { name: 'About', icon: User, route: 'about' },
        { name: 'Projects', icon: Code, route: 'projects' },
        { name: 'Blogs', icon: BookOpen, route: 'blogs' },
        { name: 'Contact', icon: Mail, route: 'contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-40 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm transition-colors duration-500">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo/Name */}
                <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 cursor-pointer" onClick={() => navigate('home')}>
                    Vishnu<span className="text-gray-900 dark:text-white">BP</span>
                </span>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <button
                            key={item.route}
                            onClick={() => navigate(item.route)}
                            className={`flex items-center space-x-2 text-sm font-medium py-1 border-b-2 transition-all duration-300 
                                ${currentPage === item.route 
                                    ? 'border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400' 
                                    : 'border-transparent text-gray-600 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </button>
                    ))}
                    
                    {/* Admin Access / Dark Mode */}
                    <button onClick={isAuthenticated ? onLogout : onAdminClick} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        {isAuthenticated ? <LogOut size={20} title="Log Out" /> : <LogIn size={20} title="Admin Login" />}
                    </button>

                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* Mobile Menu (Simplified for single-file) */}
                <div className="flex items-center md:hidden space-x-3">
                    <button onClick={isAuthenticated ? onLogout : onAdminClick} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        {isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
        </header>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return true; 
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
  
  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Custom navigation logic to handle Admin route and Blog detail
  const navigate = useCallback((route) => {
    setCurrentPage(route);
    setSelectedBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Handlers
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const handleSelectBlog = (blog) => {
      setSelectedBlog(blog);
      setCurrentPage('blogDetail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle navigation to admin which only shows the login screen if not authenticated
  const handleAdminClick = () => {
      navigate('admin');
  };

  // Logout handler passed to Navigation
  const handleLogout = () => {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      navigate('home');
  };

  // Render based on current page state
  const renderContent = () => {
    if (currentPage === 'blogDetail' && selectedBlog) {
        return <BlogDetail blog={selectedBlog} onBack={() => navigate('blogs')} />;
    }
    
    switch (currentPage) {
      case 'home':
        return <HomeSection navigate={navigate} />;
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'blogs':
        return <BlogsSection navigate={navigate} onSelectBlog={handleSelectBlog} />;
      case 'contact':
        // The ContactSection requires a notification handler, which AdminPanel provides.
        // We need a proper handler here or pass a dummy function that logs.
        return <ContactSection onNotify={(msg, type) => console.log(`Notification: ${type} - ${msg}`)} />;
      case 'admin':
        return <AdminPanel isAuthenticated={isAuthenticated} onLoginSuccess={setIsAuthenticated} navigate={navigate} />;
      default:
        return <HomeSection navigate={navigate} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Notification system is handled inside AdminPanel and ContactSection for simplicity, 
          but ideally, it should live here in App */}
      
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        navigate={navigate} 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        isAuthenticated={isAuthenticated}
        onAdminClick={handleAdminClick} 
        onLogout={handleLogout}
      />
      
      {/* Main Content Render */}
      <div className="pt-16">
        {renderContent()}
      </div>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white dark:bg-gray-900 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-8 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Vishnu BP. Designed & Built with React and Tailwind CSS.
          </div>
      </footer>
    </div>
  );
};

export default App;
