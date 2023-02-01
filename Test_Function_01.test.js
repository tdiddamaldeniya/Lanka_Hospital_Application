const Patient_Function = require('./Test_Function_01');

test(' System will display all patinet  count in hospital. in this case 100 patient in ward and 4 wards in hospital ', () => {
  expect(Patient_Function(4, 100)).toBe(400);
});