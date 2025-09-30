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
      accept=".txt"
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
      layerMap: {
        BC: { layerName: "CANAL", color: 130 },
        BD: { layerName: "DITCH", color: 130 },
        BM: { layerName: "SURVEY", color: 7 },
        BR: { layerName: "STRUCTURE", color: 30 },
        RB: { layerName: "RIVER", color: 130 },
        B: { layerName: "BUILDING", color: 10 },
        BT: { layerName: "ROAD", color: 8 },
        BW: { layerName: "BOUNDARY", color: 11 },
        BY: { layerName: "BOUNDARY", color: 11 },
        CC: { layerName: "ROAD", color: 8 },
        CH: { layerName: "CHAINAGE", color: 7 },
        CL: { layerName: "CENTER LINE", color: 162 },
        CLB: { layerName: "BUILDING", color: 1 },
        CLM: { layerName: "COLUMN", color: 7 },
        CST: { layerName: "FACTORY", color: 210 },
        CT: { layerName: "CANAL", color: 130 },
        CV: { layerName: "STRUCURE", color: 30 },
        D: { layerName: "DITCH", color: 130 },
        DR: { layerName: "DRAIN", color: 130 },
        DT: { layerName: "DITCH", color: 130 },
        DTW: { layerName: "TUBE WELL", color: 8 },
        RE: { layerName: "EARTHEN ROAD", color: 80 },
        F: { layerName: "FENCE", color: 6 },
        FB: { layerName: "FACTORY", color: 210 },
        FP: { layerName: "FOOT PATH", color: 8 },
        G: { layerName: "RELEGIOUS", color: 202 },
        GAR: { layerName: "FACTORY", color: 6 },
        GD: { layerName: "FACTORY", color: 210 },
        GF: { layerName: "FACTORY", color: 210 },
        GO: { layerName: "OFFICE", color: 7 },
        GPL: { layerName: "UTILITY", color: 210 },
        GR: { layerName: "GUARD ROOM", color: 7 },
        GT: { layerName: "BLD", color: 11 },
        GY: { layerName: "RELIGIOUS", color: 202 },
        H: { layerName: "HOME", color: 70 },
        HBB: { layerName: "HBB ROAD", color: 6 },
        HE: { layerName: "INSTITUTE", color: 7 },
        HFL: { layerName: "HFL", color: 7 },
        HL: { layerName: "HILL", color: 7 },
        HS: { layerName: "HOME", color: 70 },
        IL: { layerName: "ISLAND", color: 162 },
        JETTY: { layerName: "JETTY", color: 7 },
        KM: { layerName: "KM POST", color: 7 },
        LP: { layerName: "LIGHT POST", color: 210 },
        MB: { layerName: "RELIGIOUS", color: 202 },
        MH: { layerName: "UNILITY", color: 210 },
        MSP: { layerName: "RELIGIOUS", color: 202 },
        MTS: { layerName: "RELIGIOUS", color: 202 },
        N: { layerName: "TOPO", color: 196 },
        NFL: { layerName: "NFL", color: 7 },
        NGO: { layerName: "OFFICE", color: 7 },
        P: { layerName: "PAVEMENT", color: 10 },
        PM: { layerName: "PUMP", color: 7 },
        PP: { layerName: "POWER POLE", color: 211 },
        PT: { layerName: "PYLON TOWER", color: 210 },
        RG: { layerName: "REGULATOR", color: 202 },
        RT: { layerName: "RAIL", color: 7 },
        S: { layerName: "MARKET", color: 56 },
        SB: { layerName: "SINGNAL POST", color: 7 },
        SBR: { layerName: "STRUCTURE", color: 30 },
        SF: { layerName: "FACTORY", color: 210 },
        SS: { layerName: "MARKET", color: 56 },
        SN: { layerName: "STATION", color: 7 },
        SP: { layerName: "HOME", color: 70 },
        T: { layerName: "TOE", color: 7 },
        TBM: { layerName: "TBM", color: 7 },
        TL: { layerName: "TOILET", color: 211 },
        TMPL: { layerName: "RELIGIOUS", color: 8 },
        TP: { layerName: "UTILITI TEL", color: 210 },
        TR: { layerName: "TREE", color: 80 },
        TS: { layerName: "HOME", color: 3 },
        TW: { layerName: "TUBE WELL", color: 8 },
        UCB: { layerName: "BLD", color: 8 },
        WL: { layerName: "WING WALL", color: 7 },
      },
    };
  },
  methods: {
    handleFile(event) {
      try {
        this.file = event.target.files[0];
        this.fileName = this.file.name.split(".")[0];
        this.parseFile();
      } catch (err) {
        console.error(err);
      }
    },
    parseName(name) {
      const clean = name.split("-")[0];
      const match = clean.match(/^(\d*)?([A-Za-z]+)(\d*)?$/);
      if (!match) {
        return {
          id: "",
          layerCode: "",
          layerName: "NEW_LAYER",
          layerColor: 8,
          floor: "",
        };
      }

      let [, id, layerCode, floor] = match;
      id = id || "";
      floor = floor || "";
      const layerInfo =
        layerCode && this.layerMap[layerCode]
          ? this.layerMap[layerCode]
          : { layerName: "NEW_LAYER", color: 8 };

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
