/**
 * @author Raúl Gonzálvez Mondéjar
 * @email paredeslion@gmail.com
 * @create date 11-10-2025 21:42:10
 * @modify date 11-10-2025 21:42:45
 * @desc [Part 1 - Array Methods and Iterators]
 */

/* Create a file called part1.js and import users array from file users.js. Let's
split the code into 4 different sections (it displays text in the console to indicate
the start of each section). It's important to note that the original user array
should not be modified at no time for any of the operations we carry out. */
import { users } from "./users.js";
console.log("---- Default Parameters ----");

function imprimirUsuario(user, mensaje = "User") {
	console.log(`${mensaje}: ${user.name} (${user.email})`);
	// If there is no second argument, it uses the default value "User"
}
imprimirUsuario(users[0]); // Uses the default value
imprimirUsuario(users[1], "Admin"); // Uses the provided value

// Section 1

const threeYoungestAdmins = Array.from(users.values()) // Converts the iterator to an array
	.filter(user => user.role === "admin")
	.slice()
	.sort((a, b) => a.age - b.age)
	.slice(0, 3)
	.map(user => ({ email: user.email, password: user.password }));

console.log(threeYoungestAdmins);

// Section 2

// I don't understand why this line shows Object [Iterator Helper] in the console
console.log(Iterator.from(users).filter(user => user.authorizations.includes("PC1")).map(user => user.name));

const usersPC1 = users.filter(user => user.authorizations.includes("PC1")).map(user => user.name);

const usersPC9 = users.filter(user => user.authorizations.includes("PC9")).map(user => user.name);

const usersPC1orPC9 = users.filter(user => user.authorizations.includes("PC1") && user.authorizations.includes("PC9")).map(user => user.name);

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

console.log(`PC1: ${formatter.format(usersPC1)}`);
console.log(`PC9: ${formatter.format(usersPC9)}`);
console.log(`PC1 y PC9: ${formatter.format(usersPC1orPC9)}`);

// Section 3
/* Generate an array of users with more or less secure passwords. To do so,
they must meet the following requirements:
• Minimum length 5 characters
• At least one lowercase letter
[a-z]
• At least one capital letter
[A-Z]
• At least one number
[0-9]
• At least one non-alphanumeric character (letter or number)
[^A-Za-z0-9]
*/

const securePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
const secureUsers = Array.from(users).filter(user => securePattern.test(user.password)).map(user => `${user.name} -> ${user.password}`);

// Alternative version without iterator
// const secureUsers = users.filter(user => securePattern.test(user.password)).map(user => ({ name: user.name, password: user.password }));

console.log("Users with secure passwords:");
console.log(secureUsers);

// Section 4

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const randomIndex = getRandomInt(users.length);
const randomUser = users[randomIndex];
const now = new Date();

// (09/18/2025, 11:05:20)
const userWithLastAccess = {
	...randomUser,
	lastAccess: new Intl.DateTimeFormat("en-GB", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).format(now)
};

console.log("User with last access:");
console.log(userWithLastAccess);
console.log("Original user (should not have lastAccess property):");
console.log(randomUser);