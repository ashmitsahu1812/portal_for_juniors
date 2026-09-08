import React, { createContext, useContext, useState, useEffect } from 'react';

export const COURSES = [
  {
    id: 'nstp25-sem2',
    name: "NSTP'25-CS+AIML",
    semester: 2,
    subTitle: 'Semester 2 · Data Structures, OOP & Web',
    status: 'Enrolled',
    icon: 'Terminal',
  },
  {
    id: 'nstp25-sem1',
    name: "NSTP'25-CS+AIML",
    semester: 1,
    subTitle: 'Semester 1 · Python, C & Fundamentals',
    status: 'Enrolled',
    icon: 'Terminal',
  },
  {
    id: 'webdev-netflix',
    name: 'Web Development - Netflix Clone',
    semester: 2,
    subTitle: 'React, Node & Cloud Streaming',
    status: 'Enrolled',
    icon: 'Globe',
  },
  {
    id: 'cpp-beginners',
    name: 'C++ for Beginners',
    semester: 1,
    subTitle: 'Algorithms & Problem Solving',
    status: 'Enrolled',
    icon: 'Code2',
  },
];

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  // Read initial from localStorage or default to Sem 1 or 2
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    return localStorage.getItem('selected_course_id') || 'nstp25-sem2';
  });

  const [activeSemester, setActiveSemester] = useState(() => {
    const savedSem = localStorage.getItem('active_semester');
    return savedSem ? Number(savedSem) : 2;
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem('selected_course_id', selectedCourseId);
    localStorage.setItem('active_semester', String(activeSemester));
  }, [selectedCourseId, activeSemester]);

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const selectCourse = (course) => {
    setSelectedCourseId(course.id);
    if (course.semester) {
      setActiveSemester(course.semester);
    }
  };

  const setSemester = (sem) => {
    const semNum = Number(sem);
    setActiveSemester(semNum);
    const matchingCourse = COURSES.find((c) => c.semester === semNum && c.id.startsWith('nstp25'));
    if (matchingCourse) {
      setSelectedCourseId(matchingCourse.id);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses: COURSES,
        activeCourse,
        activeSemester,
        selectCourse,
        setSemester,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
