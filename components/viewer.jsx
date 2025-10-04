"use client";

import { useRef, useEffect, useState } from "react";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  SRGBColorSpace,
  LinearToneMapping,
  Color,
  MOUSE,
  Box3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DXFViewer } from "three-dxf-viewer";
import eventBus from "../lib/eventBus";
import { Loader2Icon } from "lucide-react";

export default function Viewer() {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const dxfRef = useRef(null);

  useEffect(() => {
    eventBus.on("processingLoading", (loading) => {
      setLoading(loading);
    });
    eventBus.on("dxfFile", async (file) => {
      handleFileChange(file);
    });
    return () => {
      eventBus.off("processingLoading");
      eventBus.off("dxfFile");
    };
  }, []);

  useEffect(() => {
    const scene = new Scene();
    const camera = new OrthographicCamera();
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
    });

    // Renderer settings
    const { clientWidth, clientHeight } = canvasRef.current;
    renderer.setSize(clientWidth, clientHeight);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = LinearToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.setClearColor(new Color(0x212830));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 2;
    controls.enableRotate = false;
    controls.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };

    // Camera setup
    const size = 10000;
    const aspect = clientWidth / clientHeight;
    camera.left = -size * aspect;
    camera.right = size * aspect;
    camera.top = size;
    camera.bottom = -size;
    camera.zoom = 1;
    scene.add(camera);

    // Save refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const { clientWidth, clientHeight } = canvasRef.current;
      rendererRef.current.setSize(clientWidth, clientHeight);
      const aspect = clientWidth / clientHeight;
      cameraRef.current.left = -size * aspect;
      cameraRef.current.right = size * aspect;
      cameraRef.current.top = size;
      cameraRef.current.bottom = -size;
      cameraRef.current.updateProjectionMatrix();
    };
    // window.addEventListener("resize", handleResize);

    return () => {
      controls.dispose();
      renderer.dispose();
      // window.removeEventListener("resize", handleResize);
    };
  }, []);

  const centerCamera = () => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    const box = new Box3().setFromObject(scene);
    const bigAxis = box.max.x - box.min.x > box.max.y - box.min.y ? "x" : "y";
    const sizeAxis =
      bigAxis === "x" ? box.max.x - box.min.x : box.max.y - box.min.y;
    const sizeFrustum =
      bigAxis === "x" ? camera.right - camera.left : camera.top - camera.bottom;
    const lateralMargin = 0.9;

    camera.zoom =
      sizeAxis < sizeFrustum ? lateralMargin * (sizeFrustum / sizeAxis) : 1;

    const center = box.min
      .clone()
      .add(box.max.clone().sub(box.min).divideScalar(2));
    camera.position.set(center.x, center.y, center.z + 100);
    controls.target.set(camera.position.x, camera.position.y, center.z);
    camera.updateProjectionMatrix();
  };

  const handleFileChange = async (blob) => {
    try {
      if (!blob || blob === lastFile) return;
      setLastFile(blob);

      const viewer = new DXFViewer();
      viewer.subscribe("log", (msg) => console.log(msg));
      viewer.subscribe("error", (msg) => console.error(msg));
      const dxf = await viewer.getFromFile(
        blob,
        "/fonts/helvetiker_regular.typeface.json"
      );

      if (dxfRef.current) sceneRef.current.remove(dxfRef.current);
      sceneRef.current.add(dxf);
      dxfRef.current = dxf;

      setLoading(false);
      centerCamera();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative size-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2Icon className="animate-spin text-white" size={100} />
        </div>
      )}
      <canvas ref={canvasRef} className="size-full"></canvas>
    </div>
  );
}
