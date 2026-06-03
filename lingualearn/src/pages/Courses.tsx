import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { courses } from '../data/courses';
import { useLearning } from '../context/LearningContext';

const languages = [
  { key: '全部', emoji: '🌍' },
  { key: '英语', emoji: '🇬🇧' },
  { key: '日语', emoji: '🇯🇵' },
  { key: '韩语', emoji: '🇰🇷' },
];

const levels = ['全部', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Courses() {
  const [languageFilter, setLanguageFilter] = useState('全部');
  const [levelFilter, setLevelFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const { progress } = useLearning();

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchLang = languageFilter === '全部' || course.language === languageFilter;
      const matchLevel = levelFilter === '全部' || course.level === levelFilter;
      const matchSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.language.includes(searchQuery);
      return matchLang && matchLevel && matchSearch;
    });
  }, [languageFilter, levelFilter, searchQuery]);

  const getCourseProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const completed = course.modules.reduce((acc, mod) => {
      const modCompleted = Array.from({ length: mod.lessons }, (_, i) =>
        `${mod.id}-l${i + 1}`
      ).filter((lid) => progress.completedLessons.includes(lid)).length;
      return acc + modCompleted;
    }, 0);
    return course.totalLessons > 0 ? Math.round((completed / course.totalLessons) * 100) : 0;
  };

  const isEnrolled = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;
    return course.modules.some((mod) =>
      Array.from({ length: mod.lessons }, (_, i) => `${mod.id}-l${i + 1}`).some((lid) =>
        progress.completedLessons.includes(lid)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">探索课程</h1>
          <p className="text-slate-500">选择适合你的语言课程，开启学习之旅</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {languages.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setLanguageFilter(lang.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                languageFilter === lang.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span className="text-lg">{lang.emoji}</span>
              {lang.key}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                levelFilter === level
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">没有找到匹配的课程</h3>
            <p className="text-slate-400">试试调整筛选条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseProgress = getCourseProgress(course.id);
              const enrolled = isEnrolled(course.id);

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
                >
                  <div className={`${course.color} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                    <span className="text-4xl block mb-2">{course.icon}</span>
                    <div className="flex gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {course.language}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.totalLessons} 课时
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    </div>

                    {enrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>学习进度</span>
                          <span>{courseProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        enrolled
                          ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                          : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}
                    >
                      {enrolled ? '继续学习' : '开始学习'}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
