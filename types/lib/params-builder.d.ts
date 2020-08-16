export class ParamsBuilder<P = any> {
  // Add passed value to parameters
  // Returns a string name to put in an sql query
  add(value: any): string;

  // Generic building method that must return the parameters object
  build(): P;
}
