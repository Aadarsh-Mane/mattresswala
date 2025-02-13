import axios from "axios";
import cron from "node-cron";
import base64 from "base-64";
const publicKey = "chpmncre"; // Replace with your public API key
const privateKey = "ad2a7b58-e207-4ab7-b0fe-f3719bb7f026"; // Replace with your private API key
const clusterName = "Cluster0"; // Replace with your cluster name
const projectId = "677e6d2e83f3244a6378ffcc"; // Replace with your project ID

const auth = {
  username: publicKey,
  password: privateKey,
};

// Function to pause the cluster

const PUBLIC_KEY = "chpmncre";
const PRIVATE_KEY = "ad2a7b58-e207-4ab7-b0fe-f3719bb7f026";
const PROJECT_ID = "677e6d2e83f3244a6378ffcc"; // Get from Atlas URL
const CLUSTER_NAME = "Cluster0"; // Your MongoDB cluster name

const M10_TO_M2_BODY = {
  providerSettings: {
    instanceSizeName: "M2", // Change this to scale down
  },
};

async function scaleDownMongoDB() {
  const auth = base64.encode(`${PUBLIC_KEY}:${PRIVATE_KEY}`);
  const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${PROJECT_ID}/clusters/${CLUSTER_NAME}`;

  try {
    const response = await axios.patch(url, M10_TO_M2_BODY, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Cluster scaling initiated:", response.data);
  } catch (error) {
    console.log(error);
  }
}

scaleDownMongoDB(); // Call the function
