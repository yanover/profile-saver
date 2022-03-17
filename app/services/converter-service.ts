interface Value {
  data: number;
  unit: string;
}

class ByteConverter {
  private value?: Value;
  private factor?: number;
  private operator?: string;
  private units?: string[] = ["B", "KB", "MB", "GB", "TB"];

  constructor(input: string, output: string, value: number) {
    if (value <= 0 || input == undefined || output == undefined) {
      throw new TypeError("Invalid parameters");
    }

    input = input.toUpperCase();
    output = output.toUpperCase();

    if (this.units!.indexOf(input) < 0 || this.units!.indexOf(output) < 0) {
      throw new TypeError("The format supplied is invalid");
    }

    if (input == output) throw TypeError("Input and output cannot be equal");

    this.value = {} as Value;
    this.value!.data = value;
    this.value!.unit = output;
    this.factor = this.setFactor(input, output, this.units!);
    this.operator = this.setOperator(input, output, this.units!);
  }

  private setFactor(input: string, output: string, units: string[]): number {
    let inputIdx = units.indexOf(input);
    let outputIdx = units.indexOf(output);
    let factor = 0;

    if (inputIdx > outputIdx) {
      factor = inputIdx - outputIdx;
    }
    if (inputIdx < outputIdx) {
      factor = outputIdx - inputIdx;
    }

    return factor;
  }

  private setOperator(input: string, output: string, units: string[]): string {
    return units.indexOf(input) > units.indexOf(output) ? "*" : "/";
  }

  public getUnit(): string {
    return this.value!.unit;
  }

  public convert(): number | void {
    let execute: any = (looper: number, treatment: number) => {
      if (looper == 0) return treatment;

      let newTreatment = +parseFloat(eval(`${treatment} ${this.operator} 1024`)).toFixed(2);

      if (Math.sign(newTreatment) < 0) {
        console.log(`newTreatment is negative`);
        return treatment;
      }
      return execute(looper - 1, newTreatment);
    };
    return execute(this.factor, this.value!.data);
  }
}