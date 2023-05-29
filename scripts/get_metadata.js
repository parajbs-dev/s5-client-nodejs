/**
 * Demo script that gets metadata for all S5 cidss passed in as CLI arguments.
 *
 * Example usage: node scripts/get_metadata.js <cid>
 */

const process = require("process");

const { S5Client, defaultS5PortalUrl } = require("..");

const portalUrl = defaultS5PortalUrl;
const client = new S5Client(`${portalUrl}`);
// const client = new S5Client("", { portalUrl: `${portalUrl}` });

const promises = process.argv
  // Ignore the first two arguments.
  .slice(2)
  .map(async (cid) => await client.getMetadata(cid));

(async () => {
  const results = await Promise.allSettled(promises);
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log(result.value);
    } else {
      console.log(result.reason.response.data);
    }
  });
})();
