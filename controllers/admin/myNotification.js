import serviceAccount from "../../mattress2.json" with { type: "json" };
import { google } from "googleapis";
import express from "express";
import axios from "axios";
import admin from "firebase-admin";
export const getAccessToken = async (req,res) => {
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"], // Scope required for FCM
    }
    //   email :serviceAccount.private_key,
    //  key : serviceAccount.client_email,
    //   ["https://www.googleapis.com/auth/firebase.messaging"], // Scope required for FCM
      
      
    );
    try {
      const tokens = await jwtClient.authorize();
      // console.log("this  :"+tokens.access_token)
      return tokens.access_token;
    } catch (err) {
      console.error("Error fetching access token:", err);
      return null;
    }
  };

export const sendNotification = async (fcmToken,partyName,updatedBy,team) => {
    const accessToken = await getAccessToken();
    let message="";
    if (team === "Production") {
      message = {
        message: {
          token: fcmToken, 
          notification: {
            title: "🛠️ Production Update!",
            body: `🔔 An order for ${partyName} has been updated by ${updatedBy}. Stay on top of it now! 🚀`,
          },
        },
      };
    } else if (team === "Delivery") {
      message = {
        message: {
          token: fcmToken, 
          notification: {
            title: "🚚 Delivery Alert!",
            body: `📦 Your order for ${partyName} is on the move! Track it now. ⏳`,
          },
        },
      };
    } else {
      message = {
        message: {
          token: fcmToken, 
          notification: {
            title: "📢 New Sales Order!",
            body: `✨ Exciting news! A new sales order has been placed for ${partyName}. Check the details now. 🔍`,
          },
        },
      };
    }
    
  
    try {
      const response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/mattresswala-2da5e/messages:send`,
        message,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Notification sent successfully:", response.data);
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
    }
  };
  export const orderUpdateNotification = async (fcmToken,updatedBy,partyName) => {
    console.log("Notification sent successfully:", fcmToken,updatedBy,partyName);
    const accessToken = await getAccessToken();
  
    const message = {
      message: {
      token: fcmToken, // Dynamically pass the token
      notification: {
        title: "Production Order Update",
        body: `The order has been updated by ${updatedBy} for party ${partyName}. Check it out!`,
      },
      },
    };
  
    try {
      const response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/mattresswala-2da5e/messages:send`,
        message,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Notification sent successfully:", response.data);
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
    }
  }
  export const orderUpdateDeliveryNotification = async (fcmToken,updatedBy,partyName) => {
    console.log("Notification sent successfully:", fcmToken,updatedBy,partyName);
    const accessToken = await getAccessToken();
  
    const message = {
      message: {
      token: fcmToken, // Dynamically pass the token
      notification: {
        title: "Delivery Order Update",
        body: `The order has been updated by ${updatedBy} for party ${partyName}. Check it out!`,
      },
      },
    };
  
    try {
      const response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/mattresswala-2da5e/messages:send`,
        message,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Notification sent successfully:", response.data);
    } catch (error) {
      console.error(
        "Error sending notification:",
        error.response ? error.response.data : error.message
      );
    }
  }