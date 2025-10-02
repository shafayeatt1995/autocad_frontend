<template>
  <div class="w-full h-screen flex flex-col">
    <div class="h-16 border-b flex justify-center items-center px-4">
      <span class="mr-4 cursor-pointer" @click="renderDxf">
        Select DXF File:
      </span>
      <input type="file" accept=".dxf" @change="handleFile" />
    </div>
    <div class="flex-1 relative">
      <canvas ref="canvasRef" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import DxfParser from "dxf-parser";

// new THREE.Vector3(x, z, y);

export default {
  name: "DxfViewer",
  data() {
    return {
      dxfData: null,
      viewPort: [],
      allTexts: [],
      allPolyLines: [],
      allPoints: [],
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
      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        15000
      );
      camera.position.set(0, 5000, 0);

      const controls = new MapControls(camera, renderer.domElement);
      controls.minDistance = 10;
      controls.maxDistance = 5000;
      controls.enablePan = true;
      // Screen-space proportional movement
      controls.screenSpacePanning = true;
      controls.panSpeed = 1;
      controls.update();

      const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(plane);
      plane.rotation.x = -0.5 * Math.PI;

      const axisHelper = new THREE.AxesHelper(5000);
      scene.add(axisHelper);

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", () => {
        const width = canvas.parentElement.offsetWidth;
        const height = canvas.parentElement.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
    },
    handleFile(event) {
      try {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const parser = new DxfParser();
          this.dxfData = parser.parseSync(e.target.result);
          this.initDxf();
        };
        reader.readAsText(file);
      } catch (err) {
        console.error(err);
      }
    },
    initDxf() {
      this.allTexts = this.dxfData.entities.filter(
        (entity) => entity.type === "TEXT"
      );
      this.allPolyLines = this.dxfData.entities.filter(
        (entity) => entity.type === "POLYLINE"
      );
      this.allPoints = this.dxfData.entities.filter(
        (entity) => entity.type === "POINT"
      );
      const numberArrX = this.allTexts
        .map(({ startPoint }) => startPoint.x)
        .flat();
      const numberArrY = this.allTexts
        .map(({ startPoint }) => startPoint.y)
        .flat();
      this.viewPort = [
        Math.min(...numberArrX),
        Math.max(...numberArrX),
        Math.min(...numberArrY),
        Math.max(...numberArrY),
      ];

      console.log(this.viewPort);
    },
    createLine() {
      const pointA = new THREE.Vector3(0, 0, 0);
      const pointB = new THREE.Vector3(2500, 0, 250);
      const geometry = new THREE.BufferGeometry().setFromPoints([
        pointA,
        pointB,
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0xee0033,
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    },
  },
};
</script>
