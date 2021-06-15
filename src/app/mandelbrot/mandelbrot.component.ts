import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComplexNumber } from './complex-number';
import { JuliaSetColorGenerator } from './model/julia-set-color-generator';

@Component({
  selector: 'app-mandelbrot',
  templateUrl: './mandelbrot.component.html',
  styleUrls: ['./mandelbrot.component.css']
})
export class MandelbrotComponent implements OnInit {


  /* Visualization parameters */
  @ViewChild('canvas', { static: true }) 
  visibleCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas', { static: true }) 
  selectorCanvas: ElementRef<HTMLCanvasElement>;
  offScreenCanvas: OffscreenCanvas;
  private context: CanvasRenderingContext2D;
  private osContext: OffscreenCanvasRenderingContext2D;

  /* Simulation Parameters */
  numberOfIterationsToReachThreshold: number;
  convergenceThreshold: number;
  realMin: number;
  realMax: number;
  imaginaryMin: number;
  imaginaryMax: number;

  isJuliaSet: boolean;
  juliaReal: number;
  juliaImaginary: number;

  running: boolean = false;
  initialised: boolean = false;

  colorConvergentPoints: boolean;
  colorDivergentPoints: boolean;
  colorMode: string;
  colorGenerator: JuliaSetColorGenerator;

  constructor() { }

  ngOnInit(): void {
    this.context = this.visibleCanvas.nativeElement.getContext('2d');
    this.reset();
    this.colorConvergentPoints = true;
    this.colorDivergentPoints = true;
    this.colorMode = 'distinct';
    this.colorGenerator = new JuliaSetColorGenerator();
    this.createOffscreenCanvas();
    this.drawReadyScreen();
    this.initialised = true;

  }

  drawReadyScreen() {
    var x = this.visibleCanvas.nativeElement.width / 2;
    var y = this.visibleCanvas.nativeElement.height / 2;

    this.context.font = '30pt Calibri';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'black';
    this.context.fillText('Ready to calculate!', x, y);
  }

  createOffscreenCanvas() {
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.offScreenCanvas = new OffscreenCanvas(width, height);
    this.osContext = this.offScreenCanvas.getContext("2d");
  }

  mandelbrotIteration(z: ComplexNumber, c: ComplexNumber) {
    const zSquared = ComplexNumber.multiply(z, z);
    const result = ComplexNumber.add(zSquared, c);
    return result;
  }

  /**
   * 
   * @param point The point to converge via iteration
   * @returns The number of iterations run prior to convergence. -1 indicates no convergence
   */
  attemptToConverge(point: ComplexNumber): number {
    const values = [];

    let mandelbrotValue = point;
    let iterationValue = null;
    let c = null;
    if (this.isJuliaSet) {
      c = new ComplexNumber(this.juliaReal, this.juliaImaginary);
      iterationValue = point;
    } else {
      // mandelbrot set
      c = point;
      iterationValue = new ComplexNumber(0,0);
    }
    
    for (let i = 0; i < this.numberOfIterationsToReachThreshold; i++) {
      mandelbrotValue = this.mandelbrotIteration(mandelbrotValue,c);
      const magnitude = ComplexNumber.magnitude(mandelbrotValue);
      if (magnitude > this.convergenceThreshold) {
        return i;
      }
      values.push(magnitude);
    }

    let sum = 0;
    for (const value of values) {
      sum += value;
    }
    const average = sum / values.length;
    return -1.0 * average;
    // does this need to be checked every iteration?

  }

  generateConvergentColor(averageValue: number) {
    if (this.colorConvergentPoints) {
      const prop = averageValue / this.convergenceThreshold;
      const i = this.numberOfIterationsToReachThreshold * prop;
      // console.log(averageValue, i);
      const n = 255 * (averageValue / this.convergenceThreshold);
      let color = null;
      if (this.colorMode == 'distinct') {
        color = this.colorGenerator.generateColor(i, 1.0);
      } else if (this.colorMode == 'grayscale') {
        color = 'rgb(' + n + ','+ n + ','+ n + ')';
      }
      return color;
    } else {
      return 'black';
    }
    
  }

  generateDivergentColor(iterationsToDiverge: number) {
    if (this.colorDivergentPoints) {

      const prop = iterationsToDiverge / this.numberOfIterationsToReachThreshold;
      let color = null;
      if (this.colorMode == 'distinct') {
        const opacity = 1.0 - prop;
        color = this.colorGenerator.generateColor(iterationsToDiverge, opacity);
      } else if (this.colorMode == 'grayscale') {
        const n = (255 * prop)
        color = 'rgb(' + n + ','+ n + ','+ n + ')';
      }

      return color;
    } else {
      return '#f7f7f7';
    }
  }

  repaint() {
    this.running = true;
    const width = this.visibleCanvas.nativeElement.width;
    const height =  this.visibleCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    this.osContext.fillRect(0,0,width,height);
    const realRange = (this.realMax - this.realMin);
    const imaginaryRange = (this.imaginaryMax - this.imaginaryMin);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const xProp = (x / width);
        const yProp = (y / height);
        const real = this.realMin + (realRange * xProp);
        const imaginary = this.imaginaryMin + (imaginaryRange * yProp);
        const point: ComplexNumber = new ComplexNumber(real, imaginary);
        const convergence = this.attemptToConverge(point);
        let color = null;
        
        if (convergence < 0) {
          const averageValue = Math.abs(convergence);
          color = this.generateConvergentColor(averageValue);
        } else {
          color = this.generateDivergentColor(convergence);
        }
        this.osContext.fillStyle = color;
        const actualY = height-y; //y is inverted
        this.osContext.fillRect(x,actualY,1,1);
      }
    }

    this.copyToOnScreen();
    this.running = false;
  }

  copyToOnScreen() {
    var onScreenContext = this.context;
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    onScreenContext.fillRect(0,0,width,height);
    onScreenContext.drawImage(this.offScreenCanvas, 0, 0);
  }

  reset() {
    this.realMin = -2;
    this.realMax = 2;
    this.imaginaryMin = -2;
    this.imaginaryMax = 2;
    this.numberOfIterationsToReachThreshold = 100;
    this.convergenceThreshold = 4.0;
    this.isJuliaSet = false;
    this.juliaReal = 0.45;
    this.juliaImaginary = 0.57;
    if (this.initialised) {
      this.repaint();
    }
  }

}
