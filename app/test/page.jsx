"use client";

import {
  ArrowDownToLineIcon,
  CloudUploadIcon,
  Loader2Icon,
  SheetIcon,
  SquareCheckIcon,
  SquareIcon,
  TextAlignJustifyIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/utils";
import Image from "next/image";
import eventBus from "@/lib/eventBus";
import Viewer from "@/components/viewer";
import { setState, useStore } from "@/lib/state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Head from "next/head";

export default function Home() {
  const [file, setFile] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState([]);
  const [layers, setLayers] = useState([]);
  const layerMap = [
    {
      code: "B",
      layerName: "BUILDING",
      color: 10,
      lineClose: true,
      showCenterText: true,
      centerText: "STD",
    },
    { code: "BC", layerName: "CANAL", color: 130 },
    { code: "BD", layerName: "DITCH", color: 130 },
    { code: "BM", layerName: "SURVEY", color: 7 },
    { code: "BR", layerName: "STRUCTURE", color: 30 },
    { code: "RB", layerName: "RIVER", color: 130 },
    { code: "BT", layerName: "ROAD", color: 8 },
    { code: "BW", layerName: "BOUNDARY", color: 11, centerText: "B.WALL" },
    { code: "BY", layerName: "BOUNDARY", color: 11 },
    { code: "CC", layerName: "ROAD", color: 8, showCenterText: true },
    { code: "CH", layerName: "CHAINAGE", color: 7 },
    { code: "CL", layerName: "CENTER LINE", color: 162 },
    { code: "CV", layerName: "CULVERT", color: 7, showCenterText: true },
    { code: "CLB", layerName: "BUILDING", color: 1 },
    { code: "CLM", layerName: "COLUMN", color: 7 },
    { code: "CST", layerName: "FACTORY", color: 210 },
    { code: "CT", layerName: "CANAL", color: 130 },
    { code: "CV", layerName: "STRUCTURE", color: 30 },
    { code: "D", layerName: "DITCH", color: 130 },
    { code: "DR", layerName: "DRAIN", color: 130, showCenterText: true },
    {
      code: "DT",
      layerName: "DITCH",
      color: 130,
      showCenterText: true,
      lineClose: true,
    },
    { code: "DTW", layerName: "TUBE WELL", color: 8 },
    { code: "RE", layerName: "EARTHEN ROAD", color: 80 },
    { code: "F", layerName: "FENCE", color: 6, showCenterText: true },
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
    {
      code: "MB",
      layerName: "RELIGIOUS",
      color: 202,
      lineClose: true,
      centerText: "MOSQUE",
    },
    { code: "MH", layerName: "UTILITY", color: 210, lineClose: true },
    { code: "MSP", layerName: "RELIGIOUS", color: 202 },
    { code: "MTS", layerName: "RELIGIOUS", color: 202 },
    { code: "N", layerName: "TOPO", color: 196 },
    { code: "NFL", layerName: "NFL", color: 7 },
    { code: "NGO", layerName: "OFFICE", color: 7 },
    { code: "P", layerName: "PAVEMENT", color: 10, showCenterText: true },
    {
      code: "PH",
      layerName: "PORCH",
      color: 7,
      showCenterText: true,
      lineClose: true,
    },
    { code: "PIPE", layerName: "PIPE", color: 7 },
    { code: "PM", layerName: "PUMP", color: 7 },
    { code: "PP", layerName: "POWER POLE", color: 211 },
    { code: "PT", layerName: "PYLON TOWER", color: 210 },
    { code: "RB", layerName: "RIVER BANK", color: 4, showCenterText: true },
    { code: "RE", layerName: "EARTHEN ROAD", color: 80, showCenterText: true },
    { code: "RG", layerName: "REGULATOR", color: 202 },
    { code: "RT", layerName: "RAIL", color: 7 },
    {
      code: "S",
      layerName: "MARKET",
      color: 56,
      lineClose: true,
      centerText: "SHOP",
    },
    { code: "SB", layerName: "SIGNAL POST", color: 7 },
    { code: "SBR", layerName: "STRUCTURE", color: 30 },
    { code: "SF", layerName: "FACTORY", color: 210 },
    {
      code: "SS",
      layerName: "MARKET",
      color: 56,
      lineClose: true,
      centerText: "SHOPS",
    },
    { code: "ST", layerName: "STATION", color: 7, lineClose: true },
    { code: "RCC", layerName: "RCC", color: 3, showCenterText: true },
    { code: "SN", layerName: "STATION", color: 7 },
    {
      code: "SP",
      layerName: "HOME",
      color: 70,
      lineClose: true,
      centerText: "SEMI PUCCA",
    },
    {
      code: "STAIR",
      layerName: "STAIR",
      color: 7,
      showCenterText: true,
      lineClose: true,
    },
    { code: "T", layerName: "TOE", color: 7 },
    { code: "TBM", layerName: "TBM", color: 7 },
    { code: "TL", layerName: "TOILET", color: 211 },
    { code: "TMPL", layerName: "RELIGIOUS", color: 8 },
    { code: "TP", layerName: "UTILITY TEL", color: 210 },
    { code: "TR", layerName: "TREE", color: 80 },
    {
      code: "TS",
      layerName: "HOME",
      color: 3,
      lineClose: true,
      centerText: "TIN SHED",
    },
    { code: "TW", layerName: "TUBE WELL", color: 8 },
    { code: "UCB", layerName: "BLD", color: 8, lineClose: true },
    { code: "UC", layerName: "UC", color: 17, lineClose: true },
    { code: "WL", layerName: "WING WALL", color: 7 },
  ];
  const centerTextCode = layerMap
    .filter((layer) => layer.showCenterText)
    .map((layer) => layer.code);
  const lineCloseCode = layerMap
    .filter((layer) => layer.lineClose)
    .map((layer) => layer.code);
  const drawer = useStore((s) => s.drawer);

  useEffect(() => {
    eventBus.on("layers", (val) => {
      setLayers(Object.entries(val).map(([key, value]) => value));
    });
    if (file) parseFile();

    return () => {
      eventBus.off("layers");
    };
  }, [file]);

  const handleFile = (event) => {
    try {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setFileName(selectedFile.name.split(".")[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseFile = () => {
    try {
      if (!file) return;

      const reader = new FileReader();
      const extension = file.name.split(".").pop().toLowerCase();

      if (extension === "csv") {
        reader.onload = (e) => {
          const text = e.target.result;
          const lines = text.split("\n").filter((line) => line.trim() !== "");
          processLines(lines);
        };
        reader.readAsText(file);
      } else if (extension === "dxf") {
        eventBus.emit("processingLoading", true);
        const blob = new Blob([file], { type: "application/octet-stream" });
        eventBus.emit("dxfFile", blob);
      } else {
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          const lines = jsonData.map((row) => row.join(","));
          processLines(lines);
        };
        reader.readAsArrayBuffer(file);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const processLines = (lines) => {
    eventBus.emit("processingLoading", true);

    const group = lines
      .slice(1)
      .map((line) => {
        let [sn, xStr, yStr, zStr, name] = line.split(",").map((v) => v.trim());
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        const z = parseFloat(zStr);

        if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
        return { sn, x, y, z, name, ...parseName(name) };
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

    const coordinate = Object.entries(group).map(([key, points]) => {
      if (!points[0]?.layerColor) {
        const layerColor = getColor();
        return createPoint(points.map((pt) => ({ ...pt, layerColor })));
      }
      return createPoint(points);
    });
    setCoordinates(coordinate);
    fetchDXF(coordinate);
  };

  // Step-1
  const createPoint = (pointsArray) => {
    if (Array.isArray(pointsArray) && pointsArray.length === 3) {
      const [a, b, c] = pointsArray;

      const d = {
        ...a,
        x: a.x + c.x - b.x,
        y: a.y + c.y - b.y,
        z: a.z || 0,
        sn: 0,
      };

      return lineClose([...pointsArray, d]);
    }
    return lineClose(pointsArray);
  };

  // Step-2
  const lineClose = (pointsArray) => {
    const check = checkCenterText(pointsArray);
    const newVal = [
      ...pointsArray.map((pt) => ({
        ...pt,
        ...(check && { centerText: centerText(pt) }),
      })),
    ];
    const allHaveId = pointsArray.every((pt) => pt.id);
    if (allHaveId && pointsArray.length > 1) {
      if (lineCloseCode.includes(pointsArray[0].layerCode)) {
        newVal.push(newVal[0]);
        return newVal;
      }
    }
    return newVal;
  };

  // Step-3
  const checkCenterText = (pointsArray) => {
    const layerCode = pointsArray[0].layerCode;
    const pointLength = pointsArray.length;
    return (
      pointLength === 4 ||
      (centerTextCode.includes(layerCode) && pointLength > 1)
    );
  };

  // Step-4
  const centerText = (point) => {
    const layer = layerMap.find((item) => item.code === point.layerCode);

    return layer?.centerText || point.layerName;
  };

  const getColor = () => Math.floor(Math.random() * 200) + 1;

  const parseName = (name) => {
    try {
      const clean = name.split("-")[0];
      const match = clean.match(/^(\d*)?([A-Za-z]+)(\d*)?$/);
      if (!match) {
        return {
          id: "",
          layerCode: "",
          layerName: name,
          layerColor: getColor(),
          floor: "",
        };
      }

      let [, id, layerCode, floor] = match;
      id = id || "";
      floor = floor || "";
      let layerInfo;
      if (layerCode && layerMap.find((item) => item.code === layerCode)) {
        layerInfo = layerMap.find((item) => item.code === layerCode);
      } else {
        layerInfo = {
          layerName: layerCode || "NEW_LAYER",
          layerCode,
        };
      }

      return {
        id,
        layerCode,
        layerName: layerInfo.layerName,
        layerColor: layerInfo.color,
        floor,
      };
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      setLoading(true);
      const response = await fetch(`${apiUrl}/generate-dxf2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.dxf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error submitting file:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDXF = async (coords) => {
    try {
      if (!file) {
        alert("Please select a file first!");
        return;
      }
      const response = await fetch(`${apiUrl}/preview-dxf2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      eventBus.emit("dxfFile", blob);
      setOpenAccordion((prev) => [...new Set([...prev, "layers"])]);
    } catch (error) {
      console.error("Error submitting file:", error);
    }
  };

  const downloadExcel = async () => {
    try {
      const path = "/demo.xlsx";
      const response = await fetch(path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `demo.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error submitting file:", error);
    }
  };

  const updateCheck = (layer) => {
    const updatedLayers = layers.map((l) =>
      l.name === layer.name ? { ...l, visible: !l.visible } : l
    );
    setLayers(updatedLayers);
    eventBus.emit("updateLayers", layer);
  };

  const updateAll = (visible) => {
    const updatedLayers = layers.map((l) => ({ ...l, visible }));
    setLayers(updatedLayers);
    eventBus.emit("updateAllLayers", visible);
  };

  return (
    <>
      <Head>
        <title>DXF Generator</title>
        <meta name="description" content="DXF Generator Application" />
      </Head>
      <div className="border-b">
        <div className="container mx-auto px-2 lg:px-0">
          <div className="py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="logo"
                  className="size-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <h1 className="text-lg md:text-2xl font-bold">DXF Generator</h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-black">V 1.0</p>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setState({ drawer: !drawer })}
              >
                <TextAlignJustifyIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full overflow-x-hidden h-[calc(100vh-57px)]">
        <div
          className={`w-4/5 h-full bg-white md:w-80 fixed lg:relative top-14 lg:top-0 z-10 transition-all duration-300 flex flex-col ${
            drawer ? "left-0" : "-left-full lg:left-0"
          }`}
        >
          <form onSubmit={(e) => submit(e)} className="p-2">
            <label
              htmlFor="file"
              className="text-slate-700 font-semibold rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed py-5"
            >
              <CloudUploadIcon size={48} className="mb-3 " />
              Upload file
              <input
                id="file"
                type="file"
                accept=".csv, .xlsx, .xls, .dxf"
                onChange={(e) => handleFile(e)}
                className="hidden"
              />
              <p className="text-xs font-medium mt-2">
                CSV, XLS, XLSX, DXF are Allowed.
              </p>
              {file?.name && (
                <p className="text-xs font-medium mt-2">
                  selected: {file.name}
                </p>
              )}
            </label>
            <div className="flex flex-col gap-2 mt-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <ArrowDownToLineIcon />
                )}
                Download Dxf
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="flex-1"
                onClick={() => downloadExcel()}
              >
                <SheetIcon />
                Download Format
              </Button>
            </div>
          </form>
          <Separator className="mt-2" />
          <div className="flex-1 px-3 overflow-y-auto">
            <Accordion
              type="multiple"
              value={openAccordion}
              onValueChange={setOpenAccordion}
            >
              <AccordionItem value="layers">
                <AccordionTrigger className="text-xl text-center font-bold">
                  Layers
                </AccordionTrigger>
                <AccordionContent>
                  {layers && layers.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => updateAll(true)}
                      >
                        <SquareCheckIcon />
                        Check All
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => updateAll(false)}
                      >
                        <SquareIcon />
                        Uncheck All
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 divide-y">
                    {layers.map((layer, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 pb-1.5"
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className="size-4 rounded-full shadow-xl border"
                            style={{
                              backgroundColor: `#${layer.color
                                .toString(16)
                                .padStart(6, "0")}`,
                            }}
                          ></div>
                          <p className="font-medium flex items-center">
                            {layer.name}
                          </p>
                        </div>
                        <Switch
                          checked={layer.visible}
                          onCheckedChange={() => updateCheck(layer)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="codeList">
                <AccordionTrigger className="text-xl text-center font-bold">
                  Code Preset
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 divide-y">
                    {layerMap.map((layer, i) => (
                      <div key={i} className="pb-2">
                        <p className="text-sm">
                          Layer Code:{" "}
                          <span className="font-semibold">{layer.code}</span>,
                        </p>
                        <p className="text-sm">
                          Layer Name:{" "}
                          <span className="font-semibold">
                            {layer.layerName}
                          </span>
                          ,
                        </p>
                        <p className="text-sm">
                          Layer Color:{" "}
                          <span className="font-semibold">{layer.color}</span>,
                        </p>
                        <p className="text-sm">
                          Show Layer Center Text:{" "}
                          <span className="font-semibold">
                            {layer.showCenterText ? "Yes" : "No"}
                          </span>
                          ,
                        </p>
                        <p className="text-sm">
                          Center Custom Text:{" "}
                          <span className="font-semibold">
                            {layer.centerText || "N/A"}
                          </span>
                          ,
                        </p>
                        <p className="text-sm">
                          Line Close:{" "}
                          <span className="font-semibold">
                            {layer.lineClose ? "Yes" : "No"}
                          </span>
                          ,
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex-1 h-full">
          <Viewer />
        </div>
      </div>
      {/* <div className="container mx-auto flex flex-col gap-5 px-2">
        {coordinates.map((group, index) => (
          <div key={index}>
            <p className="text-3xl font-bold text-center">{group[0]?.name}</p>
            <div className="flex overflow-x-auto">
              {group.map((point, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full"></div>
                  <pre>{JSON.stringify(point, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
}
