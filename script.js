"use strict";
// let userJson = '{"user": "Ann", "age": 20, "isAdmin": true}';
// console.log(userJson);
// let user = JSON.parse(userJson);
// console.log(user);
// user.dateCreated = '2019-05-01';
// user.address = {
//   city: 'Moscow',
//   postalCode: 109400,
// };
// console.log(user);
// let editedUser = JSON.stringify(user, ["user", "age", "dateCreated", "isAdmin", "address", "city", "postalCode"], 2);
// console.log(editedUser);
// let newUser = JSON.parse(editedUser, (key, value) => {
//     if (key === 'dateCreated') return new Date(value);
//     return value;
// });
// console.log(newUser);

// const num = () => {
//     let b;
//     setTimeout(() => {
//         b = 20;
//     }, 500);
//     return b;
// };
// console.log(num());

// const num = (cb) => {
//     setTimeout(() => {
//         cb(20);
//     }, 1500);
// };
// num((data) => {
//     console.log(data);
// });

const num = (a) => {
    return new Promise((resolve, reject) => { 
        setTimeout(() => {
           if (a) resolve(20);
           else reject('No data');
        }, 1500);
    });
};

// function foo(a, b) { // resolve -> then, reject -> catch
//     setTimeout(() => {
//         if (a) a(20);
//         else b('No data');
//     }, 1500);
// }
// const num = (a) => {
//   return new Promise(foo);
// };
// console.log(num());
// num(1)
//     .then((data) => { // resolve
//         console.log(data);
//     })
//     .catch((err) => { // reject
//         console.log(err);
//     });


const foo = async (a) => {
    try {
        const result = await num(a);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

foo(10);

// document.getElementById('ajax-get').addEventListener('click', () => {
//     ES5
//     var xhr = new XMLHttpRequest();
//     console.log(xhr);

//     xhr.open('GET', 'tel.json', true);

//     xhr.onreadystatechange = () => {
//         // xhr.readyState
    
//         // 0 - запрос не инициализирован
//         // 1 - загрузка данных
//         // 2 - запрос принят сервером
//         // 3 - идет обмен данным
//         // 4 - запрос выполнен
    
//         if (xhr.readyState !== 4) return;
    
//         if (xhr.status !== 200) console.log('Error:', xhr.status, xhr.statusText);
//         else {
//             console.log(xhr.responseText);
//             var userData = JSON.parse(xhr.responseText);
//             console.log(userData);
    
//             document
//                 .getElementById('ajax-block')
//                 .insertAdjacentHTML('beforeend', '<div>' + userData.name + ' <strong>' + userData.tel + '</strong></div>')
//         }
//     } 
//     xhr.send();

//     fetch('tel.json', { method: 'GET' })
//         .then((response) => {
//             console.log(response);
//             return response.json();
//         })
//         .then((data) => {
//             console.log(data);
//             document
//                 .getElementById('ajax-block')
//                 .insertAdjacentHTML('beforeend', `<div>${data.name} <strong>${data.tel}</strong></div>`)
//         });
// });
