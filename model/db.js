var userDb = [
  {
    id: 1,
    name: "test",
    password: "1234",
    email: "test@test.com",
    role: "member",
  },
  {
    id: 2,
    name: "test2",
    password: "1234",
    email: "test2@test.com",
    role: "admin",
  },
  {
    id: 3,
    name: "user1",
    password: "qwerty",
    email: "user1@example.com",
    role: "member",
  },
  {
    id: 4,
    name: "user4",
    password: "12345",
    email: "user4@example.com",
    role: "admin",
  },
  {
    id: 5,
    name: "johnDoe",
    password: "password123",
    email: "johndoe@example.com",
    role: "member",
  },
];

var table = [
  { id: 1, Name: "test1", Title: "test1 Title" },
  { id: 2, Name: "test2", Title: "test2 Title" },
  { id: 3, Name: "test3", Title: "test3 Title" },
  { id: 4, Name: "test4", Title: "test4 Title" },
  { id: 5, Name: "test5", Title: "test5 Title" },
  { id: 6, Name: "test6", Title: "test6 Title" },
  { id: 7, Name: "test7", Title: "test7 Title" },
  { id: 8, Name: "test8", Title: "test8 Title" },
  { id: 9, Name: "test9", Title: "test9 Title" },
  { id: 10, Name: "test10", Title: "test10 Title" },
  { id: 11, Name: "test11", Title: "test11 Title" },
  { id: 12, Name: "test12", Title: "test12 Title" },
  { id: 13, Name: "test13", Title: "test13 Title" },
  { id: 14, Name: "test14", Title: "test14 Title" },
  { id: 15, Name: "test15", Title: "test15 Title" },
  { id: 16, Name: "test16", Title: "test16 Title" },
  { id: 17, Name: "test17", Title: "test17 Title" },
  { id: 18, Name: "test18", Title: "test18 Title" },
  { id: 19, Name: "test19", Title: "test19 Title" },
  { id: 20, Name: "test20", Title: "test20 Title" },
];

var TitleWork = [
  {
    id: 1,
    topic: "hello",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 2,
    topic: "Hi",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 3,
    topic: "Test",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 4,
    topic: "Example",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 5,
    topic: "Project",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 6,
    topic: "Development",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 7,
    topic: "Testing",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 8,
    topic: "Release",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 9,
    topic: "Maintenance",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
  {
    id: 10,
    topic: "Update",
    performance: "perfomance",
    scheduleCompletion: "scheduleCompletion",
  },
];

var tableAddWork = [
  { id: 1, type: "Work 1", topic: "Update", name: "Update Name", time: "20" },
  { id: 2, type: "Work 2", topic: "Update", name: "Update Name", time: "60" },
  { id: 3, type: "Work 3", topic: "Update", name: "Update Name", time: "30" },
]

var tableWork = [
  { id: 1, type: "Work 1", topic: "Update", name: "Test", time: "90", timeWork: "90", timeUse: "20", values: "test", imgae: "test.jps" },
]

module.exports = {
  userDb,
  table,
  TitleWork,
  tableAddWork,
  tableWork,
};
