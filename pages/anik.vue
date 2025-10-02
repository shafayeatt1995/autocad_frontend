<template>
  <div class="w-full h-screen flex flex-col">
    <div class="h-16 border-b flex justify-center items-center px-4">
      <span class="mr-4 cursor-pointer"> Select DXF File: </span>
      <input type="file" accept=".csv" @change="handleFile" />
    </div>
    <div class="absolute top-20 left-0 z-20 text-white">
      <pre>{{ mapPosition }}</pre>
    </div>
    <div class="flex-1 relative">
      <canvas ref="canvasRef" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontJson from "three/examples/fonts/helvetiker_regular.typeface.json";

export default {
  name: "csvViewer",
  data() {
    return {
      file: null,
      coordinates: [],
      fileName: "",
      loading: false,
      viewPort: [],
      layerMap: [
        { code: "BC", layerName: "CANAL", color: 130 },
        { code: "BD", layerName: "DITCH", color: 130 },
        { code: "BM", layerName: "SURVEY", color: 7 },
        { code: "BR", layerName: "STRUCTURE", color: 30 },
        { code: "RB", layerName: "RIVER", color: 130 },
        { code: "B", layerName: "BUILDING", color: 10 },
        { code: "BT", layerName: "ROAD", color: 8 },
        { code: "BW", layerName: "BOUNDARY", color: 11 },
        { code: "BY", layerName: "BOUNDARY", color: 11 },
        { code: "CC", layerName: "ROAD", color: 8 },
        { code: "CH", layerName: "CHAINAGE", color: 7 },
        { code: "CL", layerName: "CENTER LINE", color: 162 },
        { code: "CV", layerName: "CULVERT", color: 7 },
        { code: "CLB", layerName: "BUILDING", color: 1 },
        { code: "CLM", layerName: "COLUMN", color: 7 },
        { code: "CST", layerName: "FACTORY", color: 210 },
        { code: "CT", layerName: "CANAL", color: 130 },
        { code: "CV", layerName: "STRUCTURE", color: 30 },
        { code: "D", layerName: "DITCH", color: 130 },
        { code: "DR", layerName: "DRAIN", color: 130 },
        { code: "DT", layerName: "DITCH", color: 130 },
        { code: "DTW", layerName: "TUBE WELL", color: 8 },
        { code: "RE", layerName: "EARTHEN ROAD", color: 80 },
        { code: "F", layerName: "FENCE", color: 6 },
        { code: "FB", layerName: "FACTORY", color: 210 },
        { code: "FC", layerName: "FACTORY", color: 210 },
        { code: "FP", layerName: "FOOT PATH", color: 8 },
        { code: "G", layerName: "RELIGIOUS", color: 202 },
        { code: "GAR", layerName: "GARDEN", color: 7 },
        { code: "GO", layerName: "OFFICE", color: 7 },
        { code: "GPL", layerName: "UTILITY", color: 210 },
        { code: "GR", layerName: "GUARD ROOM", color: 7 },
        { code: "GT", layerName: "BLD", color: 11 },
        { code: "GY", layerName: "RELIGIOUS", color: 202 },
        { code: "H", layerName: "HOME", color: 70 },
        { code: "HBB", layerName: "HBB ROAD", color: 6 },
        { code: "HE", layerName: "INSTITUTE", color: 7 },
        { code: "HFL", layerName: "HFL", color: 7 },
        { code: "HL", layerName: "HILL", color: 7 },
        { code: "HS", layerName: "HOME", color: 70 },
        { code: "IL", layerName: "ISLAND", color: 162 },
        { code: "JETTY", layerName: "JETTY", color: 7 },
        { code: "KM", layerName: "KM POST", color: 7 },
        { code: "LP", layerName: "LIGHT POST", color: 210 },
        { code: "MB", layerName: "RELIGIOUS", color: 202 },
        { code: "MH", layerName: "UTILITY", color: 210 },
        { code: "MSP", layerName: "RELIGIOUS", color: 202 },
        { code: "MTS", layerName: "RELIGIOUS", color: 202 },
        { code: "N", layerName: "TOPO", color: 196 },
        { code: "NFL", layerName: "NFL", color: 7 },
        { code: "NGO", layerName: "OFFICE", color: 7 },
        { code: "P", layerName: "PAVEMENT", color: 10 },
        { code: "PH", layerName: "PORCH", color: 7 },
        { code: "PIPE", layerName: "PIPE", color: 7 },
        { code: "PM", layerName: "PUMP", color: 7 },
        { code: "PP", layerName: "POWER POLE", color: 211 },
        { code: "PT", layerName: "PYLON TOWER", color: 210 },
        { code: "RB", layerName: "RIVER BANK", color: 4 },
        { code: "RE", layerName: "EARTHEN ROAD", color: 80 },
        { code: "RG", layerName: "REGULATOR", color: 202 },
        { code: "RT", layerName: "RAIL", color: 7 },
        { code: "S", layerName: "MARKET", color: 56 },
        { code: "SB", layerName: "SIGNAL POST", color: 7 },
        { code: "SBR", layerName: "STRUCTURE", color: 30 },
        { code: "SF", layerName: "FACTORY", color: 210 },
        { code: "SS", layerName: "MARKET", color: 56 },
        { code: "SN", layerName: "STATION", color: 7 },
        { code: "SP", layerName: "HOME", color: 70 },
        { code: "STAIR", layerName: "STAIR", color: 7 },
        { code: "T", layerName: "TOE", color: 7 },
        { code: "TBM", layerName: "TBM", color: 7 },
        { code: "TL", layerName: "TOILET", color: 211 },
        { code: "TMPL", layerName: "RELIGIOUS", color: 8 },
        { code: "TP", layerName: "UTILITY TEL", color: 210 },
        { code: "TR", layerName: "TREE", color: 80 },
        { code: "TS", layerName: "HOME", color: 3 },
        { code: "TW", layerName: "TUBE WELL", color: 8 },
        { code: "UCB", layerName: "BLD", color: 8 },
        { code: "WL", layerName: "WING WALL", color: 7 },
      ],
      mapPosition: null,
    };
  },
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      const canvas = this.$refs.canvasRef;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        logarithmicDepthBuffer: true,
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        canvas.clientWidth / -2,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2,
        canvas.clientHeight / -2,
        -10000,
        10000
      );

      // Controls
      const controls = new MapControls(camera, renderer.domElement);
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.panSpeed = 1;

      controls.minZoom = 0.1;
      controls.maxZoom = 50;

      controls.update();

      const axisHelper = new THREE.AxesHelper(500);
      scene.add(axisHelper);

      const self = this;
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        self.mapPosition = {
          camera: {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
          },
        };
      }
      animate();

      window.addEventListener("resize", () => {
        const width = canvas.parentElement.offsetWidth;
        const height = canvas.parentElement.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
      this._three = {
        renderer,
        scene,
        camera,
        controls,
      };
    },

    handleFile(event) {
      try {
        this.file = event.target.files[0];
        this.fileName = this.file.name.split(".")[0];
        this.parseCSV();
      } catch (err) {
        console.error(err);
      }
    },

    parseCSV() {
      if (!this.file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        let lines = text.split("\n").filter((line) => line.trim() !== "");
        this.coordinates = lines
          .slice(1)
          .map((line) => {
            let [sn, xStr, yStr, zStr, name] = line
              .split(",")
              .map((v) => v.trim());
            const x = parseFloat(xStr);
            const y = parseFloat(yStr);
            const z = parseFloat(zStr);

            if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
            return { sn, x, y, z, name, ...this.parseName(name) };
          })
          .filter(Boolean)
          .reduce((acc, point) => {
            const parts = [point?.id, point?.layerCode, point?.floor].filter(
              Boolean
            );
            const groupKey = parts.join("");
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(point);
            return acc;
          }, {});
        this.render();
      };

      reader.readAsText(this.file);
    },

    parseName(name) {
      const clean = name.split("-")[0];
      const match = clean.match(/^(\d*)?([A-Za-z]+)(\d*)?$/);
      if (!match) {
        return {
          id: "",
          layerCode: "",
          layerName: name,
          layerColor: 8,
          floor: "",
        };
      }

      let [, id, layerCode, floor] = match;
      id = id || "";
      floor = floor || "";
      const layerInfo =
        layerCode && this.layerMap.find((item) => item.code === layerCode)
          ? this.layerMap.find((item) => item.code === layerCode)
          : { layerName: name, color: 7, layerCode };

      return {
        id,
        layerCode,
        layerName: layerInfo.layerName,
        layerColor: layerInfo.color,
        floor,
      };
    },

    checkPoint(points) {
      if (Array.isArray(points) && points.length === 3) {
        const [a, b, c] = points;

        const d = {
          ...a,
          x: a.x + c.x - b.x,
          y: a.y + c.y - b.y,
          z: 0,
          sn: 0,
        };

        return [...points, d];
      }
      return points;
    },

    render() {
      const { camera, controls } = this._three;
      const arrX = [];
      const arrY = [];
      Object.entries(this.coordinates).forEach(([key, value]) => {
        arrX.push(...value.map((v) => v.x));
        arrY.push(...value.map((v) => v.y));
        value.forEach((v) => {
          this.addPoint(v);
          this.addText(v);
        });
        if (value.length > 1) {
          const checkPoint = this.checkPoint(value);
          checkPoint.forEach((v, i) => {
            this.addLine(
              v,
              i + 1 === checkPoint.length ? checkPoint[0] : checkPoint[i + 1]
            );
          });
        }
      });
      const minX = Math.min(...arrX);
      const maxX = Math.max(...arrX);
      const minY = Math.min(...arrY);
      const maxY = Math.max(...arrY);
      this.viewPort = [minX, maxX, minY, maxY];

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      const width = maxX - minX;
      const height = maxY - minY;
      const maxDim = Math.max(width, height);

      const aspect =
        this.$refs.canvasRef.clientWidth / this.$refs.canvasRef.clientHeight;
      const halfW = (width / 2) * 1.2;
      const halfH = (height / 2) * 1.2;

      camera.left = -halfW * aspect;
      camera.right = halfW * aspect;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.near = -10000;
      camera.far = 10000;
      camera.updateProjectionMatrix();

      camera.position.set(centerX, 1000, centerY);
      camera.lookAt(centerX, 0, centerY);
      camera.up.set(0, 0, 1);
      camera.rotateY(Math.PI);
      controls.target.set(centerX, 0, centerY);
      controls.update();
    },

    addLine(a, b) {
      const { getColor } = useColor();
      const pointA = new THREE.Vector3(a.x, 0, a.y);
      const pointB = new THREE.Vector3(b.x, 0, b.y);
      const geometry = new THREE.BufferGeometry().setFromPoints([
        pointA,
        pointB,
      ]);
      const material = new THREE.LineBasicMaterial({
        color: getColor(a.layerColor),
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      this._three.scene.add(line);
    },

    addPoint(val) {
      const { scene } = this._three;

      const geometry = new THREE.SphereGeometry(0.01, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dot = new THREE.Mesh(geometry, material);

      dot.position.set(val.x, 0, val.y);
      scene.add(dot);
    },

    addText(val) {
      const { x, y, floor, layerCode, id, sn } = val;
      const { scene } = this._three;
      const text = id + layerCode + floor + "_" + sn;

      // create a canvas for the text
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);

      // make texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);

      sprite.scale.set(10, 5, 1); // adjust size
      sprite.position.set(x, 0.1, y); // slightly above the ground
      scene.add(sprite);
    },

    addTextZ(val) {
      const { scene } = this._three;

      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dot = new THREE.Mesh(geometry, material);

      dot.position.set(val.x, 0, val.y);
      scene.add(dot);
    },
  },
};
</script>
