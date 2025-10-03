"use client";

import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import { apiUrl } from "../lib/utils";

export default function Home() {
  const [file, setFile] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const layerMap = [
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
  ];
  const centerTextCode = [
    "F",
    "P",
    "DR",
    "RCC",
    "CC",
    "PH",
    "STAIR",
    "CV",
    "RE",
    "DT",
    "RB",
  ];
  const lineCloseCode = [
    "B",
    "MB",
    "MH",
    "UCB",
    "UC",
    "S",
    "SS",
    "TS",
    "SP",
    "PH",
    "STAIR",
    "DT",
    "ST",
  ];

  useEffect(() => {
    if (file) parseFile();
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

  // const parseFile = () => {
  //   try {
  //     if (!file) return;

  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const text = e.target.result;
  //       let lines = text.split("\n").filter((line) => line.trim() !== "");

  //       const group = lines
  //         .map((line) => {
  //           let [sn, xStr, yStr, zStr, name] = line
  //             .split(",")
  //             .map((v) => v.trim());
  //           const x = parseFloat(xStr);
  //           const y = parseFloat(yStr);
  //           const z = parseFloat(zStr);

  //           if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
  //           return { sn, x, y, z, name, ...parseName(name) };
  //         })
  //         .filter(Boolean)
  //         .reduce((acc, point) => {
  //           const parts = [point?.id, point?.layerCode, point?.floor].filter(
  //             Boolean
  //           );
  //           const groupKey = parts.join("");
  //           if (!acc[groupKey]) acc[groupKey] = [];
  //           acc[groupKey].push(point);
  //           return acc;
  //         }, {});
  //       setCoordinates(
  //         Object.entries(group).map(([key, points]) => {
  //           // trigger from here
  //           if (!points[0]?.layerColor) {
  //             const layerColor = getColor();
  //             return createPoint(points.map((pt) => ({ ...pt, layerColor })));
  //           }
  //           return createPoint(points);
  //         })
  //       );
  //     };

  //     reader.readAsText(file);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
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
    } catch (err) {
      console.error(err);
    }
  };

  const processLines = (lines) => {
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

    setCoordinates(
      Object.entries(group).map(([key, points]) => {
        if (!points[0]?.layerColor) {
          const layerColor = getColor();
          return createPoint(points.map((pt) => ({ ...pt, layerColor })));
        }
        return createPoint(points);
      })
    );
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
    if (point.layerCode === "B") {
      return "STD";
    } else if (point.layerCode === "MB") {
      return "MOSQUE";
    } else if (point.layerCode === "BW") {
      return "B.WALL";
    } else if (point.layerCode === "S") {
      return "SHOP";
    } else if (point.layerCode === "SS") {
      return "SHOPS";
    } else if (point.layerCode === "SP") {
      return "SEMI PUCCA";
    } else if (point.layerCode === "TS") {
      return "TIN SHED";
    }

    return point.layerName;
  };

  const getColor = () => Math.floor(Math.random() * 256) + 1;

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
      const response = await fetch(`${apiUrl}/generate-dxf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coordinates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob(); // raw DXF file as Blob

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

  return (
    <>
      <form
        onSubmit={(e) => submit(e)}
        className="flex flex-col md:flex-row justify-center gap-2 py-2 px-2"
      >
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={(e) => handleFile(e)}
          className="border py-1 rounded-lg px-2"
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2Icon className="animate-spin" />}
          Generate Dxf
        </Button>
      </form>
      <div className="container mx-auto flex flex-col gap-5 px-2">
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
      </div>
    </>
  );
}
