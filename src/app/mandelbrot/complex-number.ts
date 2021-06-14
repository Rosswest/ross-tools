export class ComplexNumber {
    real: number;
    imaginary: number;

    constructor(real: number, imaginary: number) {
        this.real = real;
        this.imaginary = imaginary;
    }

    public static add(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
        const real = first.real + second.real;
        const imaginary = first.imaginary + second.imaginary;
        const result: ComplexNumber = new ComplexNumber(real, imaginary);
        return result;
    }

    public static subtract(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
        const real = first.real - second.real;
        const imaginary = first.imaginary - second.imaginary;
        const result: ComplexNumber = new ComplexNumber(real, imaginary);
        return result;
    }

    public static multiply(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
        const real = (first.real * second.real) - (first.imaginary * second.imaginary);
        const imaginary = (first.real * second.imaginary) + (second.real * first.imaginary);
        const result: ComplexNumber = new ComplexNumber(real, imaginary);
        return result;
    }

    public static magnitude(value: ComplexNumber): number {
        const result = Math.sqrt((value.real * value.real) + (value.imaginary * value.imaginary));
        return result;
    }

}