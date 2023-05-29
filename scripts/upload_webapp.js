/**
 * Demo script that upload Webapps all paths passed in as CLI arguments.
 *
 * Example usage: node scripts/upload_webapp.js <path-to-webapp>
 */

const fs = require("fs");
const process = require("process");

const { S5Client, defaultS5PortalUrl } = require("..");

const portalUrl = defaultS5PortalUrl;
const client = new S5Client(`${portalUrl}`);
// const client = new S5Client("", { portalUrl: `${portalUrl}` });
// const client = new S5Client("", { portalUrl: `${portalUrl}`, customDirname: "testwebapp", tryFiles: ["index.html"], errorPages: { 404: "/404.html" } });

const promises = process.argv
  // Ignore the first two arguments.
  .slice(2)
  // Use appropriate function for dir or for file. Note that this throws if the
  // path doesn't exist; we print an error later.
  .map((path) =>
    fs.promises.lstat(path).then((stat) => (stat.isDirectory() ? client.uploadWebapp(path) : client.uploadFile(path)))
  );

(async () => {
  const results = await Promise.allSettled(promises);
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log(result.value);
    } else {
      console.log(result.reason);
    }
  });
})();