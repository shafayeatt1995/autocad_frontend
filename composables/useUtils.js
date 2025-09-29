const loadedAnimations = new Map();
export const useUtils = () => {
  const config = useRuntimeConfig();
  const { BASE_URL, API_URL } = config.public;

  const strSlug = (val) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const arrayConverter = (value) => {
    return Array.isArray(value) ? value : value ? [value] : [];
  };

  const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const getItem = (key, defaultValue = "") => {
    if (typeof window === "undefined") return;
    const item = localStorage.getItem(key);
    return item ?? defaultValue;
  };

  const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  const randomStr = (key = 10) => {
    return [...Array(key)].map(() => Math.random().toString(36)[2]).join("");
  };

  const encode = (value) => {
    return value ? btoa(value) : "";
  };

  const decode = (value) => {
    return value ? atob(value) : "";
  };

  const initLottie = async (container, path, loop = true) => {
    if (typeof window === "undefined") return;

    if (
      loadedAnimations.has(container) &&
      loadedAnimations.get(container) === path
    ) {
      return;
    }

    const loadLottieScript = () => {
      return new Promise((resolve, reject) => {
        if (window.lottie) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "/js/lottie.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        }
      });
    };

    await loadLottieScript();

    window.lottie.loadAnimation({
      container: container,
      renderer: "canvas",
      loop,
      autoplay: true,
      path: path,
    });

    loadedAnimations.set(container, path);
  };

  const paginate = (items = [], perPage = 24) => {
    return { perPage, page: items.length / perPage + 1 };
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  const cookieParse = () => {
    let cookie = {};
    try {
      cookie =
        typeof window === "undefined"
          ? useRequestHeaders(["cookie"])?.cookie || ""
          : document.cookie || "";

      if (!cookie) return {};

      return cookie.split(";").reduce((acc, c) => {
        const [name, value] = c.split("=").map((item) => item.trim());
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {});
    } catch (error) {
      console.error("Failed to parse cookies:", error);
      return {};
    }
  };

  const setCookie = (name, value, options = {}) => {
    let expiresOption = "";
    const { expires, ...otherOptions } = options;

    if (expires) {
      const days = parseInt(expires, 10);
      if (!isNaN(days) && days > 0) {
        expiresOption = `expires=${new Date(
          Date.now() + days * 24 * 60 * 60 * 1000
        ).toUTCString()}; `;
      }
    }

    const defaultOptions = {
      Path: "/",
      Secure: true,
      SameSite: "None",
      Domain: `.${getDomain(BASE_URL)}`,
    };

    const mergedOptions = { ...defaultOptions, ...otherOptions };

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; ${expiresOption}${Object.entries(mergedOptions)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ")}`;
  };

  const getCookie = (name) => {
    try {
      const cookies = cookieParse();
      return cookies[name];
    } catch (error) {
      console.error("Failed to parse cookies:", error);
      return null;
    }
  };

  const removeCookie = (name, options = {}) => {
    const defaultOptions = {
      Path: "/",
      Secure: true,
      SameSite: "None",
      Domain: `.${getDomain(BASE_URL)}`,
    };
    const mergedOptions = { ...defaultOptions, ...options };

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${Object.entries(
      mergedOptions
    )
      .map(([key, val]) => `${key}=${val}`)
      .join("; ")}`;
  };

  const checkDate = (date) => {
    return !isNaN(new Date(date).getTime());
  };

  const fullDateFormat = (date = new Date()) => {
    return Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const processDate = (date = new Date()) => {
    const d = new Date(date);
    return {
      utc: d.toISOString(),
      local: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}T${String(
        d.getHours()
      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds()
      ).padStart(2, "0")}`,
      isActive: d > new Date(),
    };
  };

  const stringSlug = (string, sign = "-") => {
    return string
      .toLowerCase()
      .replace(/[\s_&]+/g, sign)
      .replace(/-+/g, sign)
      .replace(/[^\p{L}\p{N}\-]/gu, "")
      .replace(/^-|-$/g, "");
  };

  const isMobile = useState("isMobile", () => false);

  const addDate = (count, date = new Date()) => {
    return new Date(date.getTime() + count * 24 * 60 * 60 * 1000);
  };

  const validDate = (date) => {
    if (!date && date !== 0) return null; // catches '', null, undefined, NaN
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  };
  const startDate = (date = new Date()) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };
  const endDate = (date = new Date()) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  return {
    baseUrl: BASE_URL,
    apiUrl: API_URL,
    strSlug,
    arrayConverter,
    deepClone,
    getItem,
    setItem,
    removeItem,
    randomStr,
    encode,
    decode,
    initLottie,
    paginate,
    cookieParse,
    setCookie,
    getCookie,
    removeCookie,
    checkDate,
    fullDateFormat,
    processDate,
    stringSlug,
    isMobile,
    addDate,
    validDate,
    startDate,
    endDate,
  };
};
