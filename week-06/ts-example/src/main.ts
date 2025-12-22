import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// TYPESCRIPT VARIABLE EXAMPLES
let numberA: number = 5;
let numberB: number = 10;
const stringA: string = "Hello, ";
const stringB: string = "world!";
let boolean: boolean = true;

console.log(stringA + stringB);

console.log(`The sum of ${numberA} and ${numberB} is ${numberA + numberB}.`);

numberA = 20;
numberB = 30;

boolean = false; // This should cause a TypeScript type error
// This should cause a TypeScript type error
// numberB = "Potatoe"; 

// ARRAYS
// Creating an array of numbers
const numberArray: number[] = [1, 2, 3, 4, 5];
console.log("Number Array:", numberArray);

// Creating an array of strings empty at first
const stringArray: Array<string> = [];
stringArray.push("TypeScript");
stringArray.push("is");
stringArray.push("fun!");
console.log("String Array:", stringArray);

// FUNCTIONS
// Function to multiply two numbers
function multiply(x: number, y: number): number {
	return x * y;
}

console.log(`The product of ${numberA} and ${numberB} is ${multiply(numberA, numberB)}.`);

/* If the function has to return something, it will force us to do so. 
Even if there are several paths in the code (if..else for example), it will check that in all situations the function always returns data of the specified type.
If the return type is void, it will prevent us from returning anything.
In terms of code documentation, it is easier to understand what the function returns.*/

function greetings(): void {
	console.log("Greetings from TypeScript!");
}

console.log(greetings());

// Function with type union
/* The parameter can be either a number or a string but the return type is always a number
because .length always returns a number. */
function length(digit: number | string): number {
	return String(digit).length;
}

console.log(`The length of numberA (${numberA}) is ${length(numberA)}.`);
console.log(`The length of stringB ("${stringB}") is ${length(stringB)}.`);

// Creating new types
// It is also possible to make a union of literal values
type Role = "admin" | "user" | "guest";

class Person {
    name: string;
    role: Role; // Can only be "admin", "user", or "guest"
    constructor(name: string, role: Role) {
        this.name = name;
        this.role = role;
    }
}

let p = new Person("Juan", "admin"); // OK
p = new Person("Pepe", "mago"); // ERROR: Argument of type '"mago"' is not assignable to parameter of type 'Role'

console.log(`Person Name: ${p.name}, Role: ${p.role}`);

// TUPLES example
// a tuple to store a pair of values: a string and a number
let tupleExample: [string, number];
tupleExample = ["Age", 30]; // Correct
// tupleExample = [30, "Age"]; // ERROR: Type 'number' is not assignable to type 'string'

console.log(`Tuple Example: ${tupleExample[0]} - ${tupleExample[1]}`);

// OBJECTS TYPE
// Defining an object of class type
class Car {
		manufacturer: string;
		model: string;
		year: number;

		constructor(manufacturer: string, model: string, year: number) {
				this.manufacturer = manufacturer;
				this.model = model;
				this.year = year;
		}
}

const myCar: Car = new Car("Toyota", "Corolla", 2020);
console.log(`Car: ${myCar.manufacturer} ${myCar.model}, Year: ${myCar.year}`);

// Defining an array of objects with json type
const people: { name: string; age: number }[] = [
		{ name: "Alice", age: 28 },
		{ name: "Bob", age: 34 },
		{ name: "Charlie", age: 22 }
];

console.log(people);

// For cleaner code, we can define an interface for the object type
interface PersonInterface {
		name: string;
		age: number;
}
// Array of people using the interface
const peopleInterface: PersonInterface[] = [
		{ name: "David", age: 30 },
		{ name: "Eva", age: 25 }
];

console.log(peopleInterface);

// ORIENTED OBJECT PROGRAMMING EXAMPLES

// Typed of atributtes and methods
class Animal {
    species: string;
    age: number;
		#region: string; // private attribute

    constructor(species: string, age: number, region: string = "Asia") {
        this.species = species;
        this.age = age;
				this.#region = region;
    }

		showRegion(): void {
			console.log(`This animal lives in ${this.#region}`);
		}

		getRegion(): string {
			return this.#region;
		}
}

const dog = new Animal("Dog", 5, "Europe");
// ERROR: Property '#region' is private and only accessible within class 'Animal'.
//console.log(dog.#region); 
Object.entries(dog).forEach(([key, value]) => console.log(`${key}: ${value}`)); // Not showing private attribute

//INTERFACES

interface Flyable {
		fly(): void;
}

// Implementing interface in a class because implements forces to define the method fly
class Bird extends Animal implements Flyable {
		constructor(species: string, age: number, region: string) {
				super(species, age, region);
		}
		fly(): void {
				console.log(`${this.species} is flying.`);
		}
}

const eagle = new Bird("Eagle", 3, "North America");
eagle.fly();
eagle.showRegion();

// Interfaces for object types

interface Address {
    street: string;
    number: number;
    cp: number;
}

interface Human {
		name: string;
		age: number;
		address: Address;
		telephones?: string[]; // optional property
}

const person1: Human = {
		name: "Laura",
		age: 29,
		address: {
				street: "Main St",
				number: 123,
				cp: 45678
		},
		telephones: ["123-456-7890", "987-654-3210"]
};

console.log(person1);

//POLYMORPHISM EXAMPLE

class Persona {
    nombre: string;
		edad: number;

		constructor(nombre: string, edad: number) {
			this.nombre = nombre;
			this.edad = edad;
		}
}

class Usuario extends Persona {
		email: string;
		password: string;

		constructor(nombre: string, edad: number, email: string, password: string) {
				super(nombre, edad);
				this.email = email;
				this.password = password;
		}
}

class Cliente extends Persona {
		vip: boolean;
    constructor(nombre: string, edad: number, vip: boolean) {
        super(nombre, edad);
				this.vip = vip;
    }
}

const p1: Persona = new Usuario("Juan", 35, "juan@email.com", "1234");
const p2: Persona = new Cliente("Pepe", 64, true);
const personas: Persona[] = [p1, p2];

// Declaraciones de clases anteriores

const p3: Persona = new Usuario("Juan", 35, "juan@email.com", "1234");

console.log(p3.email); // Error: Property 'email' does not exist on type 'Persona'

const usuario = p3 as Usuario; // Casting explícito
console.log(usuario.email); // OK

// ADVANCED TYPEDS FEATURES

// ? Operator example
function sayHi(name?: string) {
		if (!name) {
				console.log("Hi, stranger!");
		} else {
				console.log(`Hi, ${name}!`);
		}
}

sayHi(); // Hi, stranger!
sayHi("Alice"); // Hi, Alice!

interface Product {
		id: number;
		name: string;
		description?: string; // optional property
}

const product1: Product = {
		id: 1,
		name: "Laptop"
};

console.log(product1.description); // undefined

const randomArray: string[] = ["perro", "casa", "árbol", "mesa", "coche"];
const word = randomArray.find((w) => w.startsWith("z")); // word is of type string | undefined

//console.log(word.toUpperCase()); // This will cause a runtime error if word is undefined
console.log(word?.toUpperCase()); // Using ?. to avoid error if word is undefined

// Non-null "!" assertion operator example
// ONLY USE it when you are sure that the value is not null or undefined

const a = ["perro", "casa", "árbol", "mesa", "coche"];
const palabra = a.find((p) => p.startsWith("c")); // Returns string | undefined

//console.log(palabra.toLocaleUpperCase()); // ERROR: 'palabra' is possibly 'undefined'
console.log(palabra!.toLocaleUpperCase()); // Estamos seguros de que no es undefined (Cuidado!)

class Persona1 {
    nombre!: string; // Property 'nombre' has no initializer and is not definitely assigned in the constructor
    edad!: number; // Property 'edad' has no initializer and is not definitely assigned in the constructor

    private constructor() {} // Constructor privado, no se puede invocar fuera

    static crear(nombre: string, edad: number) { // Método constructor estático
        const p = new Persona1();
        p.nombre = nombre;
        p.edad = edad;
        return p;
    }

    toString() {
        return `${this.nombre} - ${this.edad}`;
    }
}

const personita = Persona1.crear("Juan", 23);
console.log(personita); // Juan - 23