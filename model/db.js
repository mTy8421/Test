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
];

var table = [{ id: 1, Name: "test1", Title: "test1 Title" }];

var TitleWork = [
  {
    id: 1,
    topic: "hello",
    date: "2024-09-09",
    detail: "hello World",
    type: "money",
  },
];

var tableAddWork = [{ id: 1, topic: "hello", name: "Update Name", time: "20" }];

var tableWork = [
  {
    id: 1,
    time: "1234",
    valueTest: "valueTest",
    imgae: "test.jpg",
  },
];

module.exports = {
  userDb,
  table,
  TitleWork,
  tableAddWork,
  tableWork,
};
