import {
  PX_PER_METER,
  V_PARALLAX,
  SECTION_A_RATIO,
  SECTION_C_RATIO,
  TRACK_CONFIG,
  TRACK_COLORS,
  type TPhase,
} from "../constants";
import type { TSurface } from "@/shared/constants";
import { START_LABEL, FINISH_LABEL } from "../constants/race-texts";

export interface TrackMetrics {
  top: number;
  height: number;
  bottom: number;
  laneCenters: number[];
  laneHeight: number;
  horseSize: number;
}

export interface WorldDimensions {
  A: number;
  B: number;
  C: number;
  width: number;
  startX: number;
  finishX: number;
  maxOffset: number;
}

export interface CanvasState {
  worldTrackSpeed: number;
  targetTrackSpeed: number;
  cameraOffset: number;
  cameraSpeed: number;
  phase: TPhase;
  isParallaxActive: boolean;
  isPaused: boolean;
  viewportW: number;
  viewportH: number;
  animationFrameId: number;
  rafPrev: number;
}

export class RaceCanvasRenderer {
  private worldCanvas: HTMLCanvasElement;
  private worldCtx: CanvasRenderingContext2D;
  private trackMetrics: TrackMetrics | null = null;
  private world: WorldDimensions = {
    A: 0,
    B: 0,
    C: 0,
    width: 0,
    startX: 0,
    finishX: 0,
    maxOffset: 0,
  };
  private state: CanvasState;

  private cachedContext: CanvasRenderingContext2D | null = null;
  private lastCanvasSize = { width: 0, height: 0 };

  constructor() {
    this.worldCanvas = document.createElement("canvas");
    this.worldCtx = this.worldCanvas.getContext("2d")!;

    this.state = {
      worldTrackSpeed: 0,
      targetTrackSpeed: 0,
      cameraOffset: 0,
      cameraSpeed: 0,
      phase: "SCROLL",
      isParallaxActive: false,
      isPaused: false,
      viewportW: 0,
      viewportH: 0,
      animationFrameId: 0,
      rafPrev: 0,
    };
  }

  get worldDimensions(): WorldDimensions {
    return this.world;
  }

  get canvasState(): CanvasState {
    return this.state;
  }

  get trackMetricsData(): TrackMetrics | null {
    return this.trackMetrics;
  }

  get worldCanvasElement(): HTMLCanvasElement {
    return this.worldCanvas;
  }

  private getTrackColors(surface: TSurface) {
    return TRACK_COLORS[surface as keyof typeof TRACK_COLORS] || TRACK_COLORS.turf;
  }

  computeTrackMetrics(canvasHeight: number): TrackMetrics {
    const availableHeight = canvasHeight * 0.7;
    const laneHeight = Math.round(
      Math.max(
        Math.min(availableHeight / TRACK_CONFIG.lanes, TRACK_CONFIG.maxLane),
        TRACK_CONFIG.minLane,
      ),
    );
    const horseSize = Math.round(laneHeight * 0.75);
    const trackHeight = TRACK_CONFIG.lanes * laneHeight;
    const minTop = Math.min(canvasHeight * 0.15, 100);
    const maxTop = canvasHeight * 0.35;
    const top = Math.max(minTop, Math.min(maxTop, (canvasHeight - trackHeight) / 2));
    const bottom = top + trackHeight;
    const laneCenters = Array.from(
      { length: TRACK_CONFIG.lanes },
      (_, i) => top + laneHeight * (i + 0.5),
    );

    this.trackMetrics = { top, height: trackHeight, bottom, laneCenters, laneHeight, horseSize };
    return this.trackMetrics;
  }

  recalcWorld(viewportWidth: number, raceDistance: number): WorldDimensions {
    const A = Math.round(viewportWidth * SECTION_A_RATIO);
    const C = Math.round(viewportWidth * SECTION_C_RATIO);
    const B = Math.max(1, Math.round(raceDistance * PX_PER_METER));
    const width = A + B + C;
    const startX = A;
    const finishX = A + B;
    const maxOffset = Math.max(0, width - viewportWidth);

    this.world = { A, B, C, width, startX, finishX, maxOffset };
    return this.world;
  }

  prerenderWorldTexture(_viewportWidth: number, viewportHeight: number, surface: TSurface) {
    if (!this.trackMetrics) return;

    this.worldCanvas.width = this.world.width;
    this.worldCanvas.height = viewportHeight;
    const ctx = this.worldCtx;
    const m = this.trackMetrics;
    const colors = this.getTrackColors(surface);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.worldCanvas.width, this.worldCanvas.height);

    const sky = ctx.createLinearGradient(0, 0, 0, m.top);
    sky.addColorStop(0, "#4a90e2");
    sky.addColorStop(1, TRACK_CONFIG.skyColor);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.worldCanvas.width, m.top);

    ctx.fillStyle = colors.mountain;
    const peaks = 18;
    const peakW = this.worldCanvas.width / peaks;
    ctx.beginPath();
    ctx.moveTo(0, m.top);
    for (let i = 0; i <= peaks; i++) {
      const x = i * peakW;
      const h = Math.sin(i * 0.7) * 60 + 80;
      ctx.lineTo(x + peakW / 2, m.top - h);
      ctx.lineTo(x + peakW, m.top);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, m.top, this.worldCanvas.width, this.worldCanvas.height - m.top);
    ctx.fillStyle = colors.groundAlt;
    ctx.fillRect(0, m.top, this.worldCanvas.width, m.height);

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= TRACK_CONFIG.lanes; i++) {
      const y = m.top + i * m.laneHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.worldCanvas.width, y);
      ctx.stroke();
    }

    const postW = 8;
    const postS = 40;
    const fh = Math.round(m.laneHeight * 0.6);
    const fenceRow = (baseY: number) => {
      for (let x = 0; x < this.worldCanvas.width + postS; x += postS) {
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(x - postW / 2, baseY - fh, postW, fh);
        ctx.fillStyle = "#6d4c41";
        ctx.fillRect(x - postW / 2, baseY - fh + 5, postS, 4);
        ctx.fillRect(x - postW / 2, baseY - fh / 2, postS, 4);
      }
    };
    fenceRow(m.top);
    fenceRow(m.bottom);

    const drawMark = (x: number, label: string) => {
      const xi = Math.round(x);
      ctx.save();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.moveTo(xi, m.top);
      ctx.lineTo(xi, m.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, xi, m.top - 20);
      ctx.restore();
    };
    drawMark(this.world.startX, START_LABEL);
    drawMark(this.world.finishX, FINISH_LABEL);
  }

  updatePhysics(now: number = performance.now()) {
    if (!this.state.rafPrev) this.state.rafPrev = now;
    const dt = Math.min(0.05, (now - this.state.rafPrev) / 1000);
    this.state.rafPrev = now;

    this.state.targetTrackSpeed =
      !this.state.isPaused &&
      this.state.isParallaxActive &&
      (this.state.phase === "SCROLL" || this.state.phase === "RUNOUT")
        ? V_PARALLAX
        : 0;

    const k = 1 - Math.exp(-dt * 11);
    this.state.worldTrackSpeed += (this.state.targetTrackSpeed - this.state.worldTrackSpeed) * k;

    if (this.state.phase === "SCROLL" && this.state.isParallaxActive && !this.state.isPaused) {
      this.state.cameraSpeed = this.state.worldTrackSpeed;
      this.state.cameraOffset += this.state.cameraSpeed * dt;
      if (this.state.cameraOffset >= this.world.maxOffset) {
        this.state.cameraOffset = this.world.maxOffset;
        this.state.cameraSpeed = 0;
        this.state.phase = "RUNOUT";
        this.state.worldTrackSpeed = V_PARALLAX;
      }
    }
  }

  render(canvas: HTMLCanvasElement) {
    if (
      !this.cachedContext ||
      canvas.width !== this.lastCanvasSize.width ||
      canvas.height !== this.lastCanvasSize.height
    ) {
      this.cachedContext = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      }) as CanvasRenderingContext2D | null;
      this.lastCanvasSize = { width: canvas.width, height: canvas.height };
    }

    const ctx = this.cachedContext;
    if (!ctx) return;

    this.updatePhysics();

    ctx.setTransform(
      canvas.width / this.state.viewportW || 1,
      0,
      0,
      canvas.height / this.state.viewportH || 1,
      0,
      0,
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      this.worldCanvas,
      this.state.cameraOffset,
      0,
      this.state.viewportW,
      this.state.viewportH,
      0,
      0,
      this.state.viewportW,
      this.state.viewportH,
    );

    this.state.animationFrameId = requestAnimationFrame(() => {
      this.render(canvas);
    });
  }

  startRender(canvas: HTMLCanvasElement) {
    if (this.state.animationFrameId) {
      cancelAnimationFrame(this.state.animationFrameId);
    }
    this.render(canvas);
  }

  stopRender() {
    if (this.state.animationFrameId) {
      cancelAnimationFrame(this.state.animationFrameId);
      this.state.animationFrameId = 0;
    }
    this.cachedContext = null;
  }

  setViewportSize(width: number, height: number) {
    this.state.viewportW = width;
    this.state.viewportH = height;
  }

  setPhase(phase: TPhase) {
    this.state.phase = phase;
  }

  setIsParallaxActive(isActive: boolean) {
    this.state.isParallaxActive = isActive;
  }

  setIsPaused(isPaused: boolean) {
    this.state.isPaused = isPaused;
  }

  resetCamera() {
    this.state.cameraOffset = 0;
    this.state.cameraSpeed = 0;
  }

  resetSpeeds() {
    this.state.worldTrackSpeed = 0;
    this.state.targetTrackSpeed = 0;
  }

  initializeCanvas(
    canvas: HTMLCanvasElement,
    viewportW: number,
    viewportH: number,
    surface: TSurface,
    raceDistance: number,
  ) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = viewportW * dpr;
    canvas.height = viewportH * dpr;
    canvas.style.width = `${viewportW}px`;
    canvas.style.height = `${viewportH}px`;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    }) as CanvasRenderingContext2D | null;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.setViewportSize(viewportW, viewportH);
    this.computeTrackMetrics(viewportH);
    this.recalcWorld(viewportW, raceDistance);
    this.prerenderWorldTexture(viewportW, viewportH, surface);

    this.resetCamera();
    this.resetSpeeds();
    this.setPhase("SCROLL");
  }
}
