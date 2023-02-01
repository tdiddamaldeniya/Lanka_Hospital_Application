const Room_Function = require('./Test_Function_02');

test(' When system admin assign room from hospital. System will display available rooms.  In this case  there are four rooms,  system user will assign one room from hospatal  ', () => {
  expect(Room_Function(4, 1)).toBe(3);
});