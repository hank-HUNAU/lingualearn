import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronDown, ChevronUp, Play, ArrowLeft, Target, Award } from 'lucide-react';
import { courses } from '../data/courses';
import { useLearning } from '../context/LearningContext';
import ProgressRing from '../components/ProgressRing';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { progress, completeLesson } = useLearning();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const course = courses.find((c) => c.id === id);

  const courseProgress = useMemo(() => {
    if (!course) return 0;
    const completed = course.modules.reduce((acc, mod) => {
      const modCompleted = Array.from({ length: mod.lessons }, (_, i) =>
        `${mod.id}-l${i + 1}`
      ).filter((lid) => progress.completedLessons.includes(lid)).length;
      return acc + modCompleted;
    }, 0);
    return course.totalLessons > 0 ? Math.round((completed / course.totalLessons) * 100) : 0;
  }, [course, progress.completedLessons]);

  const getModuleProgress = (moduleId: string, lessonCount: number) => {
    const completed = Array.from({ length: lessonCount }, (_, i) =>
      `${moduleId}-l${i + 1}`
    ).filter((lid) => progress.completedLessons.includes(lid)).length;
    return lessonCount > 0 ? Math.round((completed / lessonCount) * 100) : 0;
  };

  const isModuleComplete = (moduleId: string, lessonCount: number) => {
    return getModuleProgress(moduleId, lessonCount) === 100;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleStartLesson = (lessonId: string) => {
    completeLesson(lessonId, 25);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">课程未找到</h2>
          <p className="text-slate-500 mb-6">请检查课程链接是否正确</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  const recommendedCourses = courses
    .filter((c) => c.language === course.language && c.id !== course.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className={`${course.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回课程列表
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <span className="text-7xl">{course.icon}</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  {course.language}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  {course.level}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  {course.code}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{course.title}</h1>
              <p className="text-white/80 text-lg max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2 text-white/90">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">{course.totalLessons} 课时</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">{course.modules.length} 模块</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">课程模块</h2>

            <div className="space-y-4">
              {course.modules.map((mod, index) => {
                const isExpanded = expandedModules.has(mod.id);
                const modProgress = getModuleProgress(mod.id, mod.lessons);
                const isComplete = isModuleComplete(mod.id, mod.lessons);

                return (
                  <div
                    key={mod.id}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            isComplete
                              ? 'bg-green-100 text-green-600'
                              : modProgress > 0
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isComplete ? '✓' : index + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-slate-800">{mod.title}</h3>
                          <p className="text-sm text-slate-400">{mod.lessons} 课时</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {modProgress > 0 && (
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="w-24 bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  isComplete ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${modProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-8">{modProgress}%</span>
                          </div>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100 p-5 pt-2">
                        <div className="space-y-2">
                          {Array.from({ length: mod.lessons }, (_, i) => {
                            const lessonId = `${mod.id}-l${i + 1}`;
                            const isLessonComplete = progress.completedLessons.includes(lessonId);

                            return (
                              <div
                                key={lessonId}
                                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                      isLessonComplete
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    {isLessonComplete ? '✓' : i + 1}
                                  </div>
                                  <span
                                    className={`text-sm ${
                                      isLessonComplete
                                        ? 'text-slate-400 line-through'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    第 {i + 1} 课
                                  </span>
                                </div>

                                {!isLessonComplete && (
                                  <button
                                    onClick={() => handleStartLesson(lessonId)}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    开始学习
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:w-80 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">学习进度</h3>
              <div className="flex justify-center mb-4">
                <ProgressRing progress={courseProgress} size={140} strokeWidth={10} color="#3b82f6" />
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-slate-500">
                  已完成 {Math.round((courseProgress / 100) * course.totalLessons)} / {course.totalLessons} 课时
                </p>
              </div>
              <button
                onClick={() => {
                  const firstIncomplete = course.modules
                    .flatMap((mod) =>
                      Array.from({ length: mod.lessons }, (_, i) => ({
                        id: `${mod.id}-l${i + 1}`,
                      }))
                    )
                    .find((l) => !progress.completedLessons.includes(l.id));
                  if (firstIncomplete) {
                    completeLesson(firstIncomplete.id, 25);
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                {courseProgress > 0 ? '继续学习' : '开始学习'}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                课程信息
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">语言</span>
                  <span className="text-slate-700 font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">等级</span>
                  <span className="text-slate-700 font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">总课时</span>
                  <span className="text-slate-700 font-medium">{course.totalLessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">预计时长</span>
                  <span className="text-slate-700 font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">模块数</span>
                  <span className="text-slate-700 font-medium">{course.modules.length}</span>
                </div>
              </div>
            </div>

            {recommendedCourses.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4">推荐下一步</h3>
                <div className="space-y-3">
                  {recommendedCourses.map((rc) => (
                    <Link
                      key={rc.id}
                      to={`/courses/${rc.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-2xl">{rc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{rc.title}</p>
                        <p className="text-xs text-slate-400">{rc.level} · {rc.totalLessons} 课时</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
