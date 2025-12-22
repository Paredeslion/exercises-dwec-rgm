/**
 * @author Raúl Gonzálvez Mondéjar
 * @email paredeslion@gmail.com
 * @create date 11-10-2025 21:42:24
 * @modify date 12-10-2025 01:43:32
 * @desc [Robot Class]
 */

export class Robot {
  #model;
  #battery;
  constructor(model) {
    this.#model = model;
    this.#battery = 100;
  }

  get model() {
    return this.#model;
  }

  get battery() {
    return this.#battery;
  }

  set battery(value) {
    if (value >= 0 && value <= 100) {
      this.#battery = value;
    } else {
      console.error("Battery value must be between 0 and 100.");
    }
  }
}
