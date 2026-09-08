import React, { createContext, useContext, useState, useEffect } from 'react';

export const SEMESTERS = [
  {
    id: 'sem-2',
    semester: 2,
    title: 'Semester 2',
    cohort: 'CS & AIML',
    focus: 'Data Structures, OOP in C++, DBMS & Web Dev',
    tag: 'Current Term 🚀',
  },
  {
    id: 'sem-1',
    semester: 1,
    title: 'Semester 1',
    cohort: 'CS & AIML',
    focus: 'Problem Solving in Python, C & Web Essentials',
    tag: 'Foundations',
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
  const [activeSemester, setActiveSemester] = useState(() => {
    const saved = localStorage.getItem('active_semester');
    return saved ? Number(saved) : 2;
  });

  useEffect(() => {
    localStorage.setItem('active_semester', String(activeSemester));
  }, [activeSemester]);

  const currentSem = SEMESTERS.find((s) => s.semester === activeSemester) || SEMESTERS[0];

  const setSemester = (sem) => {
    setActiveSemester(Number(sem));
  };

  return (
    <CourseContext.Provider
      value={{
        semesters: SEMESTERS,
        currentSem,
        activeSemester,
        setSemester,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
