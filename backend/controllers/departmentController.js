import { initialData } from '../data/mockDb.js';

let departments = [...initialData.departments];
let courses = [...initialData.courses];

export const getDepartments = (req, res) => {
  res.json({ success: true, data: departments });
};

export const getCourses = (req, res) => {
  const { departmentId } = req.query;
  let result = [...courses];
  if (departmentId) {
    result = result.filter(c => c.departmentId === departmentId);
  }
  res.json({ success: true, data: result });
};

export const createDepartment = (req, res) => {
  const { name, code, icon } = req.body;
  const newDept = {
    id: `dep-${Date.now()}`,
    name,
    code: code.toUpperCase(),
    icon: icon || "BookOpen",
    coursesCount: 0,
    resourcesCount: 0
  };
  departments.push(newDept);
  res.status(201).json({ success: true, data: newDept });
};

export const createCourse = (req, res) => {
  const { name, code, departmentId, semester, instructor } = req.body;
  const newCourse = {
    id: `course-${Date.now()}`,
    name,
    code: code.toUpperCase(),
    departmentId,
    semester: Number(semester) || 1,
    instructor: instructor || "Faculty Member",
    resourcesCount: 0
  };
  courses.push(newCourse);
  res.status(201).json({ success: true, data: newCourse });
};
