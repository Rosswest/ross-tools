import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SirsModel } from './model/sirs-model';
import { SirsState } from './model/sirs-state';
import { SirsModelConfiguration } from './model/sirs-model-configuration';

@Component({
  selector: 'app-sirs',
  templateUrl: './sirs.component.html',
  styleUrls: ['./sirs.component.css']
})
export class SirsComponent implements OnInit {

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
  private colorStateMap: Map<SirsState, string> = new Map<SirsState, string>();
  private timer: any;

  /* Model Configuration Parameters*/

  config: SirsModelConfiguration = new SirsModelConfiguration();
  period: number; // ticks every N seconds
  frequency: number; // number of ticks per second
  enableImmunity: boolean = false;
  updatesPerTick: number; // how many site flips to attempt every tick

  /* Model Initialization parameters */
  candidateSize: number = 50;
  modelWidth: number = 50;
  modelHeight: number = 50;
  sirsModel: SirsModel;

  constructor() { }

  ngOnInit(): void {
    this.resetConfig();
    this.sirsModel = new SirsModel(this.candidateSize, this.candidateSize, this.config);
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.resetSettings();
    this.updatesPerTick = this.sirsModel.getUpdatesPerTick();
    this.initMaps();
    this.logConfig();
    this.setFrequency(60);
    this.createOffscreenCanvas();
    this.context = this.visibleCanvas.nativeElement.getContext('2d');
    this.repaint();
  }

  initMaps() {
    this.colorStateMap.set(SirsState.SUSCEPTIBLE, '#f7f7f7');
    this.colorStateMap.set(SirsState.INFECTED, '#ff2626');
    this.colorStateMap.set(SirsState.RECOVERED, '#37eb34');
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
        for (let y = 0; y < this.modelHeight; y++) {
          for (let x = 0; x < this.modelWidth; x++) {
            const sirsCell = this.sirsModel.sites[y][x];
            const state = sirsCell.getState();
            const color = this.colorStateMap.get(state);
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


  logConfig() {
    console.log("S -> I", this.config.susceptibleToInfectedProbability);
    console.log("I -> R", this.config.infectedToRecoveredProbability);
    console.log("R -> S", this.config.recoveredToSusceptibleProbability);
  }

  resetSettings() {
    this.sirsModel.resetSettings();
    this.resetConfig();
    this.updatesPerTick = this.sirsModel.getUpdatesPerTick();
  }
  
  resetConfig() {
    this.config.reset();
    this.config.initialImmuneWeight = 0;
    this.config.initialSusceptibleWeight = 100
    this.config.initialInfectedWeight = 1;
    this.config.initialRecoveredWeight = 0;
  }

  reset() {
    clearInterval(this.timer);
    this.frame = 0;
    this.flipAttempts = 0;
    this.sirsModel = new SirsModel(this.candidateSize, this.candidateSize, this.config);
    this.modelWidth = this.candidateSize;
    this.modelHeight = this.candidateSize;
    this.running = false;
    this.repaint();
  }

  tick() {
    this.sirsModel.updateModel(this.updatesPerTick);
    this.flipAttempts += this.updatesPerTick;
    this.frame++;
    this.repaint();
  }

  applySettings() {
    this.sirsModel.setConfig(this.config);
  }
}