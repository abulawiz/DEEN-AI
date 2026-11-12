import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  RotateCcw,
  Clock,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ISLAMIC_COURSES } from '../../data/coursesData';
import { Course, CourseLesson, LearningProgress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/dbService';

export const LearningCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  useEffect(() => {
    if (selectedCourse && currentUser) {
      loadProgress(selectedCourse.id);
    }
  }, [selectedCourse, currentUser?.id]);

  const loadProgress = async (courseId: string) => {
    if (!currentUser) return;
    const p = await DBService.getLearningProgress(currentUser.id, courseId);
    setProgress(p);
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    setActiveLesson(lesson);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGradeQuiz = async () => {
    if (!activeLesson?.quiz || !selectedCourse || !currentUser) return;

    let correctCount = 0;
    activeLesson.quiz.forEach(q => {
      if (selectedQuizAnswers[q.id] === q.correct_index) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeLesson.quiz.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    await DBService.completeLesson(currentUser.id, selectedCourse.id, activeLesson.id);
    await DBService.saveQuizScore(currentUser.id, selectedCourse.id, activeLesson.id, scorePct);
    await loadProgress(selectedCourse.id);

    if (scorePct >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 dark:from-[#032014] dark:via-[#043322] dark:to-[#031d13] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 dark:bg-black/40 border border-emerald-600/40 text-amber-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Islamic Learning Centre (مركز التعليم الشرعي)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Structured Islamic Education Programmes
          </h1>
          <p className="text-sm text-emerald-100/90 dark:text-emerald-200 mt-2 leading-relaxed">
            Beginner, Intermediate, and Advanced tracks designed to impart foundational knowledge of Tawheed, Fiqh, Usul, and Hadith sciences with interactive verification quizzes and progress tracking.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 font-arabic text-8xl pointer-events-none select-none text-white">
          طلب العلم
        </div>
      </div>

      {/* VIEW 1: COURSES CATALOG */}
      {!selectedCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ISLAMIC_COURSES.map(course => {
            const isBeginner = course.level === 'Beginner';
            const isIntermediate = course.level === 'Intermediate';

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isBeginner
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : isIntermediate
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300'
                      }`}
                    >
                      {course.level} Level
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {course.estimated_hours} Hours
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="space-y-1.5 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Curriculum Highlights:
                    </p>
                    {course.modules.map(m => (
                      <div key={m.id} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveLesson(course.modules[0].lessons[0]);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-all shadow-sm flex items-center justify-center gap-2 group-hover:shadow"
                  >
                    <span>Start Learning Course</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: ACTIVE COURSE & LESSON VIEWER */
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-[#0b130e] rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                setSelectedCourse(null);
                setActiveLesson(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Courses</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">{selectedCourse.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
                {progress?.completed_lessons.length || 0} Lessons Completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Syllabus Modules & Lessons */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm space-y-4">
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Course Modules
                </h3>
              </div>

              {selectedCourse.modules.map(mod => (
                <div key={mod.id} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 px-2 py-1">
                    {mod.title}
                  </h4>
                  <div className="space-y-1">
                    {mod.lessons.map(lesson => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isDone = progress?.completed_lessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                            isActive
                              ? 'bg-emerald-700 dark:bg-emerald-800 text-white font-bold shadow-sm'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-400'}`} />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {isDone && (
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Active Lesson & Interactive Quiz */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm space-y-6">
              {activeLesson && (
                <>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Lesson Study
                    </span>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {activeLesson.title}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {activeLesson.summary}
                    </p>
                  </div>

                  {/* Arabic Quotes if any */}
                  {activeLesson.arabic_quotes && activeLesson.arabic_quotes.map((quote, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border-r-4 border-emerald-600 text-right">
                      <p className="font-arabic text-xl text-neutral-900 dark:text-neutral-100 leading-loose">
                        {quote.arabic}
                      </p>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 text-left mt-2 italic font-sans">
                        "{quote.translation}" — <span className="font-semibold text-emerald-900 dark:text-emerald-300">{quote.source}</span>
                      </p>
                    </div>
                  ))}

                  {/* Lesson Text */}
                  <div
                    className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-4 whitespace-pre-wrap font-sans border-t border-neutral-100 dark:border-neutral-800 pt-4"
                    dangerouslySetInnerHTML={{
                      __html: activeLesson.content
                        .replace(/### (.*?)\n/g, '<h4 class="text-base font-bold text-emerald-900 dark:text-emerald-300 mt-4 mb-2">$1</h4>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }}
                  />

                  {/* Interactive Verification Quiz */}
                  {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                    <div className="mt-8 pt-6 border-t-2 border-emerald-100 dark:border-neutral-800 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                            Knowledge Verification Quiz
                          </h3>
                        </div>
                        {quizScore !== null && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              quizScore >= 70
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            Score: {quizScore}% {quizScore >= 70 ? '• Passed' : '• Review & Retry'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-6">
                        {activeLesson.quiz.map((q, qIndex) => {
                          const selectedOption = selectedQuizAnswers[q.id];
                          const isCorrect = selectedOption === q.correct_index;

                          return (
                            <div key={q.id} className="space-y-2">
                              <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                {qIndex + 1}. {q.question}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIndex) => {
                                  const isSelected = selectedOption === optIndex;
                                  let btnClass = 'bg-white dark:bg-[#070d0a] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800';

                                  if (quizSubmitted) {
                                    if (optIndex === q.correct_index) {
                                      btnClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-bold';
                                    } else if (isSelected && !isCorrect) {
                                      btnClass = 'bg-red-100 dark:bg-red-950/80 border-red-500 text-red-950 dark:text-red-100 font-bold';
                                    }
                                  } else if (isSelected) {
                                    btnClass = 'bg-emerald-700 dark:bg-emerald-600 border-emerald-700 text-white font-bold';
                                  }

                                  return (
                                    <button
                                      key={optIndex}
                                      onClick={() => handleSelectQuizOption(q.id, optIndex)}
                                      disabled={quizSubmitted}
                                      className={`p-3 rounded-xl border text-xs text-left transition-all ${btnClass}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 pt-1 pl-1">
                                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Explanation:</span> {q.explanation}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        {quizSubmitted ? (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setSelectedQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
                          </button>
                        ) : (
                          <button
                            onClick={handleGradeQuiz}
                            disabled={Object.keys(selectedQuizAnswers).length < activeLesson.quiz.length}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-800 dark:hover:bg-emerald-500 disabled:opacity-50 shadow-sm"
                          >
                            Submit Answers for Evaluation
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
