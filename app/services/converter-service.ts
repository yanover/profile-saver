import { IStorageValue } from "../models/IStorageValue";

enum Units {
  B = "B",
  KB = "KB",
  MB = "MB",
  GB = "GB",
  TB = "TB",
}

export class ByteConvertor {
  private value?: IStorageValue;
  private factor?: number;
  private operator?: string;

  private setFactor(inputIdx: number, outputIdx: number): number {
    return inputIdx > outputIdx ? inputIdx - outputIdx : outputIdx - inputIdx;
  }

  private setOperator(inputIdx: number, outputIdx: number): string {
    return inputIdx > outputIdx ? "*" : "/";
  }

  private getUnit(): string {
    return this.value!.unit;
  }

  private process(): number {
    let execute: any = (looper: number, treatment: number) => {
      if (looper == 0) return treatment;

      let newTreatment = +parseFloat(eval(`${treatment} ${this.operator} 1024`)).toFixed(2);

      if (Math.sign(newTreatment) < 0) {
        return treatment;
      }
      return execute(looper - 1, newTreatment);
    };
    return execute(this.factor, this.value!.data);
  }

  public convert(value: number, input: string, output: string): IStorageValue {
    // Convert values in upperCase
    input = input.toUpperCase();
    output = output.toUpperCase();

    // Input and output must be in enum, if not, throw a TypeError
    if (!(input in Units) || !(output in Units)) {
      throw new TypeError(
        "Invalid parameters : Unit value not found in available conversions ('B','KB','MB','GB','TB')"
      );
    }

    // If value is < 0, return it as it is with the corresponding output
    if (value <= 0) return { data: 0, unit: output };

    // Search index position from input and output according to the Units enum
    let inputIdx = Object.keys(Units).indexOf(input);
    let outputIdx = Object.keys(Units).indexOf(output);

    // Build stuff
    this.value = {} as IStorageValue;
    this.value!.data = value;
    this.value!.unit = output;
    this.factor = this.setFactor(inputIdx, outputIdx);
    this.operator = this.setOperator(inputIdx, outputIdx);
    // Return data as IStorageValue, process the conversion
    return { data: this.process(), unit: this.getUnit() };
  }
}
