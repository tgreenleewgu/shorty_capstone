import 'dotenv/config';

export default {
  expo: {
    name: "ShortyUrlFrontend",
    slug: "ShortyUrlFrontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    platforms: ["ios", "android", "web"],
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      BACKEND_URL: process.env.BACKEND_URL,
    },
  },
};
