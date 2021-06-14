import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComplexNumber } from './complex-number';

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
  numberOfIterationsToReachThreshold: number = 1000;
  convergenceThreshold: number = 4.0;
  realMin: number = -1;
  realMax: number = 1;
  imaginaryMin: number = -1;
  imaginaryMax: number = 1;

  running: boolean = false;
  initialised: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    this.context = this.visibleCanvas.nativeElement.getContext('2d');
    this.reset();
    this.createOffscreenCanvas();
    this.initialised = true;
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

  converges(point: ComplexNumber): boolean {

    let mandelbrotValue = point;
    for (let i = 0; i < this.numberOfIterationsToReachThreshold; i++) {
      mandelbrotValue = this.mandelbrotIteration(mandelbrotValue,point);
      const magnitude = ComplexNumber.magnitude(mandelbrotValue);
      if (magnitude > this.convergenceThreshold) {
        return false;
      }
    }

    return true;
    // does this need to be checked every iteration?

  }

  repaint() {
    this.running = true;
    const width = this.visibleCanvas.nativeElement.width;
    const height =  this.visibleCanvas.nativeElement.height;
    const realRange = (this.realMax - this.realMin);
    const imaginaryRange = (this.imaginaryMax - this.imaginaryMin);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const xProp = (x / width);
        const yProp = (y / height);
        const real = this.realMin + (realRange * xProp);
        const imaginary = this.imaginaryMin + (imaginaryRange * yProp);
        const point: ComplexNumber = new ComplexNumber(real, imaginary);
        const converges = this.converges(point);
        let color = (converges ? 'black' : 'white');
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
    if (this.initialised) {
      this.repaint();
    }
  }
}
