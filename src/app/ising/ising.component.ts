import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IsingModel } from './model/ising-model';
import { IsingModelDynamics } from './model/ising-model-dynamics';
import { IsingState } from './model/ising-state';

@Component({
  selector: 'app-ising',
  templateUrl: './ising.component.html',
  styleUrls: ['./ising.component.css']
})
export class IsingComponent implements OnInit, OnDestroy {

  /* Visualization parameters */
  @ViewChild('canvas', { static: true }) 
  visibleCanvas: ElementRef<HTMLCanvasElement>;
  offScreenCanvas: OffscreenCanvas;
  private context: CanvasRenderingContext2D;
  private osContext: OffscreenCanvasRenderingContext2D;
  public frame: number = 0;
  public flipAttempts: number = 0;
  public running: boolean = false;
  public repaintOnUpdate: boolean = true;
  private colors: string[] = ['red','blue','green'];
  private timer: any;
  public dynamicsOptions = [
    {label: 'Glauber', value: IsingModelDynamics.GLAUBER},
    {label: 'Kawasaki', value: IsingModelDynamics.KAWASAKI},
  ];

  /* Model Configuration Parameters*/
  temperature: number; // i.e. T
  boltzmann: number; // i.e. K
  interactionStrength: number; // i.e. J
  period: number; // ticks every N seconds
  frequency: number; // number of ticks per second
  dynamics: any; // method of determining sites to flip
  updatesPerTick: number; // how many site flips to attempt every tick
  totalEnergy: number;
  totalEnergyString: string;

  /* Model Initialization parameters */
  candidateSize: number = 50;
  modelWidth: number = 50;
  modelHeight: number = 50;
  isingModel: IsingModel;

  constructor() { }

  ngOnDestroy(): void {
    // kill the timer to ensure any running tasks end
    clearInterval(this.timer);
  }

  ngOnInit(): void {
    this.isingModel = new IsingModel(this.candidateSize, this.candidateSize);
    this.dynamics = this.dynamicsOptions[0];
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.temperature = this.isingModel.getTemperature();
    this.boltzmann = this.isingModel.getBoltzmannConstant();
    this.interactionStrength = this.isingModel.getInteractionStrength();
    this.updatesPerTick = this.isingModel.getUpdatesPerTick();
    this.logConfig();
    this.setFrequency(60);
    this.createOffscreenCanvas();
    this.context = this.visibleCanvas.nativeElement.getContext('2d');
    this.repaint();
  }

  setFrequency(frequency: number) {
    this.frequency = frequency; //hz
    this.period = 1000 / frequency;
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
            const isingCell = this.isingModel.sites[y][x];
            const state = isingCell.getState();
            color = this.getIsingStateColor(state);;
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

  getIsingStateColor(state: IsingState) {
    switch (state) {
      case IsingState.UP:
        return 'black';
      case IsingState.DOWN:
        return '#f7f7f7';
    }
  }
  randomColor() {
    let r = Math.floor(3.0 * Math.random());
    return this.colors[r];
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

  createOffscreenCanvas() {
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.offScreenCanvas = new OffscreenCanvas(width, height);
    this.osContext = this.offScreenCanvas.getContext("2d");
  }

  copyToOnScreen() {
    var onScreenContext = this.context;
    const width = this.visibleCanvas.nativeElement.width;
    const height = this.visibleCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    onScreenContext.fillRect(0,0,width,height);
    onScreenContext.drawImage(this.offScreenCanvas, 0, 0);
  }

  applySettings() {
    this.logConfig();
    console.log(this.dynamics);
    this.isingModel.setDynamics(this.dynamics.value);
    this.isingModel.setTemperature(this.temperature);
    this.isingModel.setBoltzmannConstant(this.boltzmann);
    this.isingModel.setInteractionStrength(this.interactionStrength);
    this.isingModel.setUpdatesPerTick(this.updatesPerTick);
  }

  logConfig() {
    console.log("temperature", this.temperature);
    console.log("boltzmann", this.boltzmann);
    console.log("interactionStrength", this.interactionStrength);
    console.log("updatesPerTick", this.updatesPerTick);
  }
  resetSettings() {
    this.isingModel.resetSettings();
    this.temperature = this.isingModel.getTemperature();
    this.boltzmann = this.isingModel.getBoltzmannConstant();
    this.interactionStrength = this.isingModel.getInteractionStrength();
    this.updatesPerTick = this.isingModel.getUpdatesPerTick();
    this.dynamics = this.isingModel.getDynamics();
  }
  
  reset() {
    clearInterval(this.timer);
    this.frame = 0;
    this.flipAttempts = 0;
    this.isingModel = new IsingModel(this.candidateSize, this.candidateSize);
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.running = false;
    this.applySettings();
    this.repaint();
  }

  tick() {
    this.isingModel.updateModel(this.updatesPerTick);
    this.flipAttempts += this.updatesPerTick;
    this.frame++;
    this.updateTotalEnergy();
    this.repaint();
  }

  updateTotalEnergy() {
    this.totalEnergy = this.isingModel.calculateTotalEnergy();
    this.totalEnergyString = this.totalEnergy.toFixed(2); //for the sake of convenience in display
  }
}