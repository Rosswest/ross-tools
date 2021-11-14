import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utils } from '../shared/utils';
import { BruteForceHull } from './model/convex-hull/brutce-force-hull';
import { Explanation } from './model/explanation';
import { QuickHull } from './model/convex-hull/quick-hull';
import { Vector2D } from './model/vector2D';
import { GrahamScanHull } from './model/convex-hull/graham-scan-hull';
import { DivideAndConquerHull } from './model/convex-hull/divide-and-conquer-hull';
import { GeometryUtils } from './model/GeometryUtils';
import { Edge2D } from './model/edge-2d';
import { DelaunayTriangulation } from './model/triangulation/delaunay-triangulation';

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
  convexHullEdges: Edge2D[];
  triangulationEdges: Edge2D[];

  selectedCalculation: any;
  calculationOptions: any[] = [
    {label: 'Convex Hull', value: 'convex-hull', info: Explanation.CONVEX_HULL},
    {label: 'Polygon Triangulation', value: 'polygon-triangulation', info: Explanation.POLYGON_TRIANGULATION},
    {label: 'Voronoi Diagram', value: 'voronoi-diagram', info: Explanation.VORONOI_DIAGRAM},
    {label: 'Largest Empty Circle', value: 'largest-empty-circle', info: Explanation.LARGEST_EMPTY_CIRCLE},
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
    'polygon-triangulation': [
      {label: 'Delaunay Triangulation', value: 'delaunay'}
    ],
    'voronoi-diagram': [
      {label: 'Euclidean Distance', value: 'euclidean-distance'},
      {label: 'Manhattan Distance', value: 'manhattan-distance'}
    ],
    'largest-empty-circle': [
      {label: 'One', value: 'one'}
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
    this.logs = [];
    this.logsString = '';
    this.reset();
    this.createOffscreenCanvas();
    this.drawReadyScreen();
    this.running = false;
    this.initialised = true;
    for (let i = 0; i < 10000000; i++) {
      const width = this.pointsCanvas.nativeElement.width;
      const height = this.pointsCanvas.nativeElement.height;
      const minX = 0;
      const minY = 0;
      const maxX = width;
      const maxY = height;
      for (let i = 0; i < 10; i++) {
        const x = Utils.randomInteger(minX,maxX);
        const y = Utils.randomInteger(minY,maxY);
        this.addPoint(x,y);
      }
    }

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
    this.selectedAlgorithm = this.algorithmOptions[0];
  }

  repaint() {
    // const width = this.pointsCanvas.nativeElement.width;
    // const height = this.pointsCanvas.nativeElement.height;
    // this.osContext.fillStyle = 'white';
    // this.osContext.fillRect(0,0,width,height);

    // this.drawPoints();
    // this.drawHullSegments();
    // this.drawTriangulationEdges();

    // this.copyToOnScreen();
  }

  drawPoints() {
    const height = this.pointsCanvas.nativeElement.height;
    this.osContext.strokeStyle = 'black';
    this.osContext.fillStyle = 'black';
    for (const point of this.points) {
      const displayY = height - point.y;
      this.osContext.fillRect(point.x,displayY,2,2);
    }
  }
  drawHullSegments() {
    const height = this.pointsCanvas.nativeElement.height;
    if (this.convexHullEdges != undefined) {
      for (const segment of this.convexHullEdges) {
      this.osContext.beginPath();
      const startY = height - segment.start.y;
      const endY = height - segment.end.y;
      this.osContext.moveTo(segment.start.x,startY);
      this.osContext.lineTo(segment.end.x,endY);
      this.osContext.stroke();
      this.osContext.closePath();
      }
    }
  }

  drawTriangulationEdges() {
    const height = this.pointsCanvas.nativeElement.height;
    if (this.triangulationEdges != undefined) {
        for (const edge of this.triangulationEdges) {
        this.osContext.beginPath();
        const startY = height - edge.start.y;
        const endY = height - edge.end.y;
        this.osContext.moveTo(edge.start.x,startY);
        this.osContext.lineTo(edge.end.x,endY);
        this.osContext.stroke();
        this.osContext.closePath();
      }
    }
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
    console.log("Algorithm",this.selectedAlgorithm);
    console.log("Calculation",this.selectedCalculation);
    if (this.points.length < 1) {
      this.addLog("Please add some points to the canvas before calculating");
    } else {
      const pointsWithoutDuplicates = Vector2D.removeDuplicatePoints(this.points);
      const start = new Date().getTime();
      const selectedCalculation = this.selectedCalculation.value;
      if (selectedCalculation == 'convex-hull') {
        this.calculateConvexHull(pointsWithoutDuplicates);
      } else if (selectedCalculation == 'polygon-triangulation') {
        this.calculateTriangulation(pointsWithoutDuplicates);
      } else if (selectedCalculation == 'test') {
        this.addLog("Not an actual calculation");
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
    this.convexHullEdges = this.model.segments;
    console.log("segments",this.model.segments);
    this.repaint();
  }

  calculateTriangulation(points: Vector2D[]) {
    const selectedAlgorithm = this.selectedAlgorithm.value;
    if (selectedAlgorithm == 'delaunay') {
      this.model = new DelaunayTriangulation(points);
    }
    this.triangulationEdges = this.model.edges;
    console.log("triangulation edges",this.triangulationEdges);
    this.repaint();
  }

}