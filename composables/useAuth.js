export const useAuth = () => {
  const authUser = useState("user", () => null);
  const loggedIn = computed(() => !!authUser.value);
  const isAdmin = computed(() => !!authUser.value?.isAdmin);
  const isOwner = computed(() => authUser.value?.isOwner || false);
  const isManager = computed(() => authUser.value?.isManager || false);
  const isStaff = computed(() => authUser.value?.isStaff || false);
  const authStore = computed(() => authUser.value?.store || null);
  const design = computed(() => authStore.value?.design || null);
  const domain = computed(() => authUser.value?.domain || null);
  const slug = computed(() => authStore.value?.slug || null);
  const trial = computed(() => authStore.value?.trial || true);
  const courier = computed(() => authStore.value?.courier || true);
  const storeUrl = computed(() => {
    try {
      const config = useRuntimeConfig();
      const { protocol, host } = new URL(config.public.BASE_URL);
      return `${protocol}//${authStore.value.slug}.${host}`;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  const isExpired = computed(() => {
    const exp = authUser.value?.business?.exp;
    return exp ? new Date(exp).getTime() < Date.now() : true;
  });

  const api = useApi();
  const { removeCookie, setCookie, getCookie } = useUtils();

  const setUser = async (val) => {
    try {
      if (val === null) {
        authUser.value = null;
        return null;
      } else {
        const { user } = await api.get("/user");
        authUser.value = user;
        return user;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (body, t) => {
    try {
      const token = t || (await api.post("/auth/login", body))?.token;
      await removeCookie("sessionToken");
      await setCookie("sessionToken", token, { expires: 30 });

      const user = await setUser();
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const fetchUser = async () => {
    try {
      if (!authUser.value) {
        const { getCookie } = useUtils();
        if (getCookie("sessionToken")) {
          const user = await setUser();
          return user;
        }
      }
      return authUser.value;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Logout function: clear cookie and reset user state
  const logout = async (redirect = "/") => {
    removeCookie("sessionToken");
    await setUser(null);
    navigateTo(redirect);
  };

  // Refresh token and update user & cookie
  const refreshToken = async () => {
    try {
      const { token } = await api.get("/user/refresh-token");
      await removeCookie("sessionToken");
      await setCookie("sessionToken", token, { expires: 30 });

      const user = await setUser();
      return { token, user };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    authUser,
    loggedIn,
    login,
    fetchUser,
    logout,
    refreshToken,
    isAdmin,
    isOwner,
    isManager,
    isStaff,
    isExpired,
    authStore,
    storeUrl,
    design,
    domain,
    slug,
    trial,
    courier,
  };
};
