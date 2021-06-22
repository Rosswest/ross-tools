import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utils } from '../shared/utils';
import { BruteForceHull } from './model/brutce-force-hull';
import { DivideAndConquerHull } from './model/divide-and-conquer-hull';
import { Explanation } from './model/explanation';
import { GrahamScanHull } from './model/graham-scan-hull';
import { QuickHull } from './model/quick-hull';
import { Vector2D } from './model/vector2D';

@Component({
  selector: 'app-geometry',
  templateUrl: './geometry.component.html',
  styleUrls: ['./geometry.component.css']
})
export class GeometryComponent implements OnInit {

  /* Visualization parameters */
  @ViewChild('canvas', { static: true }) 
  pointsCanvas: ElementRef<HTMLCanvasElement>;
  // @ViewChild('overlay', { static: true }) 
  // overlayCanvas: ElementRef<HTMLCanvasElement>;
  offScreenCanvas: OffscreenCanvas;
  private context: CanvasRenderingContext2D;
  private osContext: OffscreenCanvasRenderingContext2D;

  points: Vector2D[];
  convexHullPoints: any[];

  selectedCalculation: any;
  calculationOptions: any[] = [
    {label: 'Convex Hull', value: 'convex-hull', info: Explanation.CONVEX_HULL},
    {label: 'Test', value: 'test', info: Explanation.TEST}
  ];

  selectedAlgorithm: any;
  algorithmOptions: any[];
  algorithmOptionsList: any = {
    'convex-hull': [
      {label: 'Brute Force', value: 'brute-force', info: Explanation.CONVEX_HULL_BRUTE_FORCE, imagePath: 'assets/geometry/convex-hull-brute-force.svg'},
      {label: 'Quick Hull', value: 'quick-hull', info: Explanation.CONVEX_HULL_QUICK_HULL, imagePath: 'assets/geometry/convex-hull-quick-hull.svg'},
      {label: 'Graham Scan', value: 'graham-scan', info: Explanation.CONVEX_HULL_GRAHAM_SCAN, imagePath: 'assets/geometry/convex-hull-graham-scan.svg'},
      {label: 'Divide & Conquer', value: 'divide-and-conquer', info: Explanation.CONVEX_HULL_DIVIDE_AND_CONQUER, imagePath: 'assets/geometry/convex-hull-divide-conquer.svg'}
    ],
    'test': [
      {label: 'One', value: 'one'},
      {label: 'Two', value: 'two'},
      {label: 'Three', value: 'three'}
    ]
  };

  selectedTool: any;
  toolOptions: any[] = [
    {label: 'Add Point', value: 'add-point'},
    {label: 'Add Cluster', value: 'add-cluster'}
  ];

  model: any;
  running: boolean = false;
  initialised: boolean = false;

  logs: string[];
  logsString: string;
  @ViewChild('logs') logArea: ElementRef<HTMLTextAreaElement>;

  constructor() { }

  ngOnInit(): void {
    this.context = this.pointsCanvas.nativeElement.getContext('2d');
    this.selectedTool = this.toolOptions[0];
    this.selectedCalculation = this.calculationOptions[0];
    this.updateAlgorithmOptions();
    this.selectedAlgorithm = this.algorithmOptions[0];
    this.points = [];
    this.convexHullPoints = [];
    this.logs = [];
    this.logsString = '';
    this.reset();
    this.createOffscreenCanvas();
    this.drawReadyScreen();
    this.running = false;
    this.initialised = true;
    console.log(Vector2D.distanceFromPointToLine(new Vector2D(0,0), new Vector2D(0,5), new Vector2D(2,2)))
  }

  drawReadyScreen() {
    var x = this.pointsCanvas.nativeElement.width / 2;
    var y = this.pointsCanvas.nativeElement.height / 2;

    this.context.font = '30pt Calibri';
    this.context.textAlign = 'center';
    this.context.fillStyle = 'black';
    this.context.fillText('Click to add some points!', x, y);
  }

  createOffscreenCanvas() {
    const width = this.pointsCanvas.nativeElement.width;
    const height = this.pointsCanvas.nativeElement.height;
    this.offScreenCanvas = new OffscreenCanvas(width, height);
    this.osContext = this.offScreenCanvas.getContext("2d");
  }

  updateAlgorithmOptions() {
    const calculation = this.selectedCalculation['value'];
    const options = this.algorithmOptionsList[calculation];
    this.algorithmOptions = options;
  }

  repaint() {
    const width = this.pointsCanvas.nativeElement.width;
    const height = this.pointsCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    this.osContext.fillRect(0,0,width,height);

    this.osContext.strokeStyle = 'black';
    this.osContext.fillStyle = 'black';
    for (const point of this.points) {
      const displayY = height - point.y;
      this.osContext.fillRect(point.x,displayY,2,2);
    }

    this.osContext.fillStyle = 'red';
    if (this.model != undefined) {
      for (const segment of this.model.segments) {
        this.osContext.beginPath();
        const startY = height - segment.start.y;
        const endY = height - segment.end.y;
        this.osContext.moveTo(segment.start.x,startY);
        this.osContext.lineTo(segment.end.x,endY);
        this.osContext.stroke();
        this.osContext.closePath();
      }
    }

    this.osContext.beginPath();
    for (const point of this.convexHullPoints) {
      const displayY = height - point.y;
      this.osContext.lineTo(point.x,displayY);
      this.osContext.stroke();
    }

    this.copyToOnScreen();
  }

  copyToOnScreen() {
    var onScreenContext = this.context;
    const width = this.pointsCanvas.nativeElement.width;
    const height = this.pointsCanvas.nativeElement.height;
    this.osContext.fillStyle = 'white';
    onScreenContext.fillRect(0,0,width,height);
    onScreenContext.drawImage(this.offScreenCanvas, 0, 0);
  }

  reset() {
    this.points = [];
    this.model = undefined;
    if (this.initialised) {
      this.repaint();
    }
    this.drawReadyScreen();
  }

  actOnClick(event: any) {
    const height = this.pointsCanvas.nativeElement.height;
    const eventX = event.offsetX;
    const eventY = height - event.offsetY;
    const selectedTool = this.selectedTool.value;
    if (selectedTool == 'add-point') {
      this.addPoint(eventX,eventY);
      this.repaint();
    } else if (selectedTool == 'add-cluster') {
      const width = this.pointsCanvas.nativeElement.width;
      const minX = Math.max(0,eventX-50);
      const minY = Math.max(0,eventY-50);
      const maxX = Math.min(width,eventX+50);
      const maxY = Math.min(height,eventY+50);
      for (let i = 0; i < 10; i++) {
        const x = Utils.randomInteger(minX,maxX);
        const y = Utils.randomInteger(minY,maxY);
        this.addPoint(x,y);
      }
      this.repaint();
    }
  }

  setSelectedTool(tool: string) {
    this.selectedTool = tool;
  }

  addPoint(x: number, y: number) {
    const point = new Vector2D(x,y);
    this.points.push(point);
  }

  calculate() {
    this.running = true;
    
    if (this.points.length < 1) {
      this.addLog("Please add some points to the canvas before calculating");
    } else {
      const pointsWithoutDuplicates = Vector2D.removeDuplicatePoints(this.points);
      const start = new Date().getTime();
      const selectedCalculation = this.selectedCalculation.value;
      if (selectedCalculation == 'convex-hull') {
        this.calculateConvexHull(pointsWithoutDuplicates);
      } else if (selectedCalculation == 'test') {
        this.addLog("Not an actual calculation");
      }
      const end = new Date().getTime();
      const calculationName = this.selectedCalculation.label;
      const algorithmName = this.selectedAlgorithm.label;
      const pointCount = this.points.length;
      const duration = end - start;
      const message = `Calculated ${calculationName} with ${algorithmName} algorithm for ${pointCount} points in ${duration}ms`;
      this.addLog(message);
    }
    this.running = false;
  }

  addLog(log:string) {
    this.logs.push(log);
    this.logsString = this.logsString + '\n' + log;
    this.logArea.nativeElement.scrollTop = this.logArea.nativeElement.scrollHeight;
  }

  calculateConvexHull(points: Vector2D[]) {
    const start = new Date().getTime();
    const selectedAlgorithm = this.selectedAlgorithm.value;
    if (selectedAlgorithm == 'quick-hull') {
      this.model = new QuickHull(points);
    } else if (selectedAlgorithm == 'divide-and-conquer') {
      this.model = new DivideAndConquerHull(points);
    } else if (selectedAlgorithm == 'brute-force') {
      this.model = new BruteForceHull(points);
    } else if (selectedAlgorithm == 'graham-scan') {
      this.model = new GrahamScanHull(points);
    }
    const end = new Date().getTime();
    const dur = end - start;
    this.convexHullPoints = this.model.hullPoints;
    console.log("points",this.convexHullPoints);
    console.log("segments",this.model.segments);
    this.repaint();
  }

}