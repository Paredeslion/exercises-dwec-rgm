/**
 * @author Raúl Gonzálvez Mondéjar
 * @email paredeslion@gmail.com
 * @create date 11-10-2025 22:09:51
 * @modify date 12-10-2025 01:47:48
 * @desc [Part 2 - Classes and Inheritance]
 */

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Robot } from "./robot.class.js";
import { MobileRobot } from "./mobile-robot.class.js";
import { FlyingRobot } from "./flying-robot.class.js";

const r1 = readline.createInterface({ input, output });
// The entire program
// Creating an array of robots with different models and capabilities
const robots = [
  new Robot("Basic Robot"),
  new MobileRobot("Mobile Robot", 50),
  new FlyingRobot("Flying Robot", 100),
];

let option = "";

while (option !== "0") {
  console.log(`
		--------------------------------
			MENU
		--------------------------------
		1) Show Mobile robots
		2) Show flying robots
		3) Create a robot
		4) Move robots
		5) Fly robots
		6) Show robot info
		0) Exit
		`);

  option = await r1.question("Select an option: ");

  switch (option) {
    case "1":
      const mobileRobots = robots.filter(
        (robot) => robot instanceof MobileRobot
      );
      mobileRobots.forEach((robot) => console.log(robot.toString()));
      break;
    case "2":
      const flyingRobots = robots.filter(
        (robot) => robot instanceof FlyingRobot
      );
      flyingRobots.forEach((robot) => console.log(robot.toString()));
      break;
    case "3":
      const type = await r1.question("Enter robot type (mobile/flying): ");
      const model = await r1.question("Enter robot model: ");
      if (type === "mobile") {
        const speed = await r1.question("Enter speed (km/h): ");
        robots.push(new MobileRobot(model, parseInt(speed)));
      } else if (type === "flying") {
        const altitude = await r1.question("Enter altitude (meters): ");
        robots.push(new FlyingRobot(model, parseInt(altitude)));
      } else {
        console.log("Invalid robot type.");
      }
      break;
    case "4":
      robots.forEach((robot) => {
        robot.move?.();
      });
      break;
    case "5":
      robots.forEach((robot) => {
        robot.fly?.();
      });
      break;
    case "6":
      const position = await r1.question("Enter robot position: ");
      const robotPosition = robots[parseInt(position)];
      console.log(
        robotPosition?.toString() ??
          "No robot found at this position " + position
      );
      break;
    case "0":
      console.log("Bye bye!");
      break;
    default:
      console.log("Invalid option, please try again.");
      break;
  }
}

r1.close(); // Finally we close the input/output stream

/* Question
If I try to use a basic robot using the option 6, it returns [object Object].
The exercise does not specify to create a toString method for the basic Robot class,
but it would be a good idea to implement it, don't you think?
*/