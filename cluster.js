import axios from "axios";
import cron from "node-cron";

const publicKey = "chpmncre"; // Replace with your public API key
const privateKey = "ad2a7b58-e207-4ab7-b0fe-f3719bb7f026"; // Replace with your private API key
const clusterName = "Cluster0"; // Replace with your cluster name
const projectId = "677e6d2e83f3244a6378ffcc"; // Replace with your project ID

const auth = {
  username: publicKey,
  password: privateKey,
};

// Function to pause the cluster
const pauseCluster = async () => {
  try {
    const response = await axios.patch(
      `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`,
      {
        paused: true,
      },
      {
        auth,
      }
    );
    console.log("Cluster paused successfully:", response.data);
  } catch (error) {
    console.error("Error pausing cluster:", error);
  }
};

// Function to resume the cluster
const resumeCluster = async () => {
  try {
    const response = await axios.patch(
      `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`,
      {
        paused: false,
      },
      {
        auth,
      }
    );
    console.log("Cluster resumed successfully:", response.data);
  } catch (error) {
    console.error("Error resuming cluster:", error);
  }
};

// Schedule the tasks
pauseCluster();

// Resume cluster after 2 minutes
// cron.schedule("*/2 * * * *", () => {
//   console.log("Resuming cluster after 2 minutes...");
//   resumeCluster();
// });
// Pause the cluster at 7 PM
// cron.schedule("0 19 * * *", () => {
//   console.log("Pausing cluster at 7 PM...");
//   pauseCluster();
// });

// // Resume the cluster at 10 PM
// cron.schedule("0 22 * * *", () => {
//   console.log("Resuming cluster at 10 PM...");
//   resumeCluster();
// });
