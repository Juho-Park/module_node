export const DaysWeek = ['일', '월', '화', '수', '목', '금', '토']

// export const Activities = [
//     { idx: 1, emoji: '🧗', name: '클라이밍' },
//     { idx: 2, name: '🏃‍♂️ 러닝' }
// ]

export const Grades = [
    { id: 17, age: 17, label: '고1', schoolValue: '1' },
    { id: 18, age: 18, label: '고2', schoolValue: '2' },
    { id: 19, age: 19, label: '고3', schoolValue: '3' },
    { id: 20, age: 20, label: '졸업생', schoolValue: '졸업생' },
]
export const Semester = [
    { id: 1, label: '1학기' },
    { id: 2, label: '2학기' }
]
export const ExamTypes = [
    { id: 1, label: '중간고사' },
    { id: 2, label: '기말고사' }
]

// id = nth Grade + semester + exam
export const ReportCards: Constant.ReportCard[] = [
    { id: 1011, grade: 10, age: 17, semester: 1, exam: 1, label: "1학년 1학기 중간고사" },
    { id: 1012, grade: 10, age: 17, semester: 1, exam: 2, label: "1학년 1학기 기말고사" },
    { id: 1021, grade: 10, age: 17, semester: 2, exam: 1, label: "1학년 2학기 중간고사" },
    { id: 1022, grade: 10, age: 17, semester: 2, exam: 2, label: "1학년 2학기 기말고사" },
    { id: 1111, grade: 11, age: 18, semester: 1, exam: 1, label: "2학년 1학기 중간고사" },
    { id: 1112, grade: 11, age: 18, semester: 1, exam: 2, label: "2학년 1학기 기말고사" },
    { id: 1121, grade: 11, age: 18, semester: 2, exam: 1, label: "2학년 2학기 중간고사" },
    { id: 1122, grade: 11, age: 18, semester: 2, exam: 2, label: "2학년 2학기 기말고사" },
    { id: 1211, grade: 12, age: 19, semester: 1, exam: 1, label: "3학년 1학기 중간고사" },
    { id: 1212, grade: 12, age: 19, semester: 1, exam: 2, label: "3학년 1학기 기말고사" },
    { id: 1221, grade: 12, age: 19, semester: 2, exam: 1, label: "3학년 2학기 중간고사" },
    { id: 1222, grade: 12, age: 19, semester: 2, exam: 2, label: "3학년 2학기 기말고사" }
]

export const Essay = [
    { idx: 1, keyword: 'math', label: '수리', }
]
export const Mui = {
    color: {
        primary: '#2196f3'
    }
}