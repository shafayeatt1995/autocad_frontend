<template>
  <Head>
    <Title>Dxf Generator</Title>
  </Head>
  <form
    @submit.prevent="submit"
    class="flex flex-col md:flex-row justify-center gap-2 py-2 px-2"
  >
    <input
      type="file"
      accept=".csv"
      @change="handleFile"
      class="border py-1 rounded-lg px-2"
    />
    <button
      type="submit"
      class="border px-5 bg-slate-900 text-white rounded-lg py-1 flex gap-2 items-center disabled:opacity-50"
      :disabled="loading"
    >
      <Loader2Icon v-if="loading" class="animate-spin" />
      Generate Dxf
    </button>
  </form>
  <div class="container mx-auto flex flex-col gap-5 px-2">
    <div v-for="(group, index) in coordinates" :key="index">
      <p class="text-3xl font-bold text-center">
        {{ group[0]?.name }}
      </p>
      <div class="flex overflow-x-auto">
        <div
          v-for="(point, index) in group"
          :key="index"
          class="flex flex-col items-center"
        >
          <div class="w-2 h-2 rounded-full"></div>
          <pre>{{ point }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Loader2Icon } from "lucide-vue-next";

export default {
  name: "AnikPage",
  components: {
    Loader2Icon,
  },
  data() {
    return {
      file: null,
      coordinates: [],
      fileName: "",
      loading: false,
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
    };
  },
  methods: {
    handleFile(event) {
      try {
        this.file = event.target.files[0];
        this.fileName = this.file.name.split(".")[0];
        // this.parseFile();
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
    async parseFile() {
      try {
        const text = await this.file.text();
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        this.coordinates = lines
          .map((line) => {
            const parts = line.includes(",")
              ? line.split(",")
              : line.split(/\s+/).filter(Boolean);

            if (parts.length !== 5) return null;

            const [sn, xStr, yStr, zStr, name] = parts;
            const x = parseFloat(xStr);
            const y = parseFloat(yStr);
            const z = parseFloat(zStr);

            if (isNaN(x) || isNaN(y) || isNaN(z)) return null;

            return { x, y, z, name };
          })
          .filter(Boolean)
          .map((item, i) => {
            let xStr = item.x.toString();
            const serial = (i + 1).toString();

            if (xStr.startsWith(serial)) {
              xStr = xStr.slice(serial.length);
            }

            const newX = parseFloat(xStr);

            return {
              ...item,
              x: newX,
              ...this.parseName(item.name),
              sn: i + 1,
            };
          })
          .reduce((acc, point) => {
            const parts = [point.id, point.layerCode, point.floor].filter(
              Boolean
            );
            const groupKey = parts.join("");
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(point);
            return acc;
          }, {});
      } catch (err) {
        console.error(err);
      }
    },
    async submit() {
      try {
        if (!this.file) {
          alert("Please select a file first!");
          return;
        }
        this.loading = true;
        const { apiUrl } = useUtils();
        const response = await fetch(`${apiUrl}/generate-dxf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.coordinates),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob(); // raw DXF file as Blob

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.fileName}.dxf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error submitting file:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
