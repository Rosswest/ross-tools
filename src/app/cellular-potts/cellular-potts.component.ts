import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CellularPottsModel } from './model/cellular-potts-model';

@Component({
  selector: 'app-cellular-potts',
  templateUrl: './cellular-potts.component.html',
  styleUrls: ['./cellular-potts.component.css']
})
export class CellularPottsComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) 
  visibleCanvas: ElementRef<HTMLCanvasElement>;
  offScreenCanvas: OffscreenCanvas;
  private context: CanvasRenderingContext2D;
  private osContext: OffscreenCanvasRenderingContext2D;

  updatesPerTick: number;
  numberOfStates: number;
  period: number;
  frequency: number;
  private timer: any;

  candidateSize: number = 50;
  modelWidth: number = 50;
  modelHeight: number = 50;
  cellularPottsModel: CellularPottsModel;

  running: boolean;
  repaintOnUpdate: boolean;
  flipAttempts: number;
  frame: number;

  constructor() { }

  ngOnInit(): void {
    this.cellularPottsModel = new CellularPottsModel(this.candidateSize, this.candidateSize);
    this.updatesPerTick = 1000;
    this.numberOfStates= 4;
    this.running = false;
    this.repaintOnUpdate = true;
    this.candidateSize = 50;
    this.flipAttempts = 0;
    this.frame = 0;
    this.context = this.visibleCanvas.nativeElement.getContext('2d');
    this.createOffscreenCanvas();
    this.repaint();
  }

  createOffscreenCanvas() {
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.offScreenCanvas = new OffscreenCanvas(width, height);
    this.osContext = this.offScreenCanvas.getContext("2d");
  }

  ngOnDestroy(): void {
    // kill the timer to ensure any running tasks end
    clearInterval(this.timer);
  }

  resetSettings() {
    this.updatesPerTick = this.cellularPottsModel.getUpdatesPerTick();
  }
  
  setFrequency(frequency: number) {
    this.frequency = frequency; //hz
    this.period = 1000 / frequency;
  }


  reset() {
    clearInterval(this.timer);
    this.frame = 0;
    this.flipAttempts = 0;
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.running = false;
    this.applySettings();
    this.repaint();
  }

  applySettings() {
    this.cellularPottsModel.setUpdatesPerTick(this.updatesPerTick);
  }

  tick() {
    this.cellularPottsModel.updateModel(this.updatesPerTick);
    this.flipAttempts += this.updatesPerTick;
    this.frame++;
    this.repaint();
  }

  toggleRunning() {
    this.running = !this.running;
    if (this.running) {
      this.timer = setInterval(()=>{
        this.tick();
      }, this.period);
    } else {
      clearInterval(this.timer);
    }
  }

  repaint() {
    if (this.repaintOnUpdate) {
      const width = this.visibleCanvas.nativeElement.width;
      const height = this.visibleCanvas.nativeElement.height;
      this.osContext.fillStyle = 'white';
      this.osContext.fillRect(0,0,width,height);
      const squareWidth = width / this.modelWidth;
      const squareHeight = height / this.modelHeight;
      let startX = 0;
      let startY = 0;
      let color: string = 'green';
        for (let y = 0; y < this.modelHeight; y++) {
          for (let x = 0; x < this.modelWidth; x++) {
            const cell = this.cellularPottsModel.sites[y][x];
            const state = cell.getState();
            color = this.getStateColor(state);;
            this.osContext.fillStyle = color;
            this.osContext.fillRect(startX,startY,squareWidth+0.5,squareHeight+0.5); // extra size to account for rendering gaps
            startX += squareWidth;
          }
          startY += squareHeight;
          startX = 0;
        }
        this.copyToOnScreen();  
    }
  }

  getStateColor(state: number) {
    if (state == 0) {
      return 'white';
    } else if (state == 1) {
      return 'green';
    } else if (state == 2) {
      return 'blue';
    } else if (state == 3) {
      return 'black';
    } else {
      return 'grey';
    }
  }

  copyToOnScreen() {
    var onScreenContext = this.context;
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    onScreenContext.fillRect(0,0,width,height);
    onScreenContext.drawImage(this.offScreenCanvas, 0, 0);
  }
}
