import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { PottsModel } from './model/potts-model';
import { PottsModelDynamics } from './model/potts-model-dynamics';

@Component({
  selector: 'app-Potts',
  templateUrl: './Potts.component.html',
  styleUrls: ['./Potts.component.css']
})
export class PottsComponent implements OnInit, OnDestroy {

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
  private stateToColorMap: Map<number, string>;
  public dynamicsOptions = [
    {label: 'Glauber', value: PottsModelDynamics.GLAUBER},
    {label: 'Kawasaki', value: PottsModelDynamics.KAWASAKI},
  ];

  /* Model Configuration Parameters*/
  temperature: number; // i.e. T
  boltzmann: number; // i.e. K
  interactionStrength: number; // i.e. J
  period: number; // ticks every N seconds
  frequency: number; // number of ticks per second
  dynamics: any; // method of determining sites to flip
  updatesPerTick: number; // how many site flips to attempt every tick
  numberOfStates: number;
  totalEnergy: number;
  totalEnergyString: string;

  /* Model Initialization parameters */
  candidateSize: number = 50;
  modelWidth: number = 50;
  modelHeight: number = 50;
  pottsModel: PottsModel;

  constructor() { }

  ngOnDestroy(): void {
    // kill the timer to ensure any running tasks end
    clearInterval(this.timer);
  }

  ngOnInit(): void {
    this.pottsModel = new PottsModel(this.candidateSize, this.candidateSize);
    this.dynamics = this.dynamicsOptions[0];
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.temperature = this.pottsModel.getTemperature();
    this.boltzmann = this.pottsModel.getBoltzmannConstant();
    this.interactionStrength = this.pottsModel.getInteractionStrength();
    this.updatesPerTick = this.pottsModel.getUpdatesPerTick();
    this.numberOfStates = this.pottsModel.getNumberOfStates();
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
            const PottsCell = this.pottsModel.sites[y][x];
            const state = PottsCell.getState();
            color = this.stateToColorMap.get(state);;
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
    this.pottsModel.setDynamics(this.dynamics.value);
    this.pottsModel.setTemperature(this.temperature);
    this.pottsModel.setBoltzmannConstant(this.boltzmann);
    this.pottsModel.setInteractionStrength(this.interactionStrength);
    this.pottsModel.setUpdatesPerTick(this.updatesPerTick);
  }

  logConfig() {
    console.log("temperature", this.temperature);
    console.log("boltzmann", this.boltzmann);
    console.log("interactionStrength", this.interactionStrength);
    console.log("updatesPerTick", this.updatesPerTick);
  }
  resetSettings() {
    this.pottsModel.resetSettings();
    this.temperature = this.pottsModel.getTemperature();
    this.boltzmann = this.pottsModel.getBoltzmannConstant();
    this.interactionStrength = this.pottsModel.getInteractionStrength();
    this.updatesPerTick = this.pottsModel.getUpdatesPerTick();
    this.dynamics = this.pottsModel.getDynamics();
  }
  
  reset() {
    clearInterval(this.timer);
    this.frame = 0;
    this.flipAttempts = 0;
    this.pottsModel = new PottsModel(this.candidateSize, this.candidateSize);
    this.pottsModel.setNumberOfStates(this.numberOfStates);
    this.initStateToColorMapping();
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.running = false;
    this.applySettings();
    this.repaint();
  }

  /**
   * Maps a set of RGB color values from white to black based on the number of states
   */
  initStateToColorMapping() {
    this.stateToColorMap = new Map<number, string>();
    const intervalSize = Math.floor(255 / this.numberOfStates);
    this.stateToColorMap.set(0, 'rgb(0,0,0)');
    for (let i = 1; i < this.numberOfStates-1; i++) {
      const value = Math.floor(i * intervalSize).toFixed(0);
      const colorString = 'rgb(' + value + ',' + value + ',' + value + ')';
      this.stateToColorMap.set(i,colorString);
    }
    this.stateToColorMap.set(this.numberOfStates-1, 'rgb(255,255,255)');
  }

  tick() {
    this.pottsModel.updateModel(this.updatesPerTick);
    this.flipAttempts += this.updatesPerTick;
    this.frame++;
    this.updateTotalEnergy();
    this.repaint();
  }

  updateTotalEnergy() {
    this.totalEnergy = this.pottsModel.calculateTotalEnergy();
    this.totalEnergyString = this.totalEnergy.toFixed(2); //for the sake of convenience in display
  }

}