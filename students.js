const names = ['Dodong', 'Maria', 'Diday', 'Juan'];
const students = [
    { fname: names[0], age: 22, course: 'BSCS'},
    { fname: names[1], age: 21, course: 'BSDS'},
    { fname: names[2], age: 22, course: 'BSIS'},
    { fname: names[3], age: 21, course: 'BSIT'}
]
const greet = function (str = null) {
    console.log(`Hello ${str}`);
}

module.exports = { names, students, greet };