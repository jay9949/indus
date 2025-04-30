import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "mu1z8cz6",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-04-30",
  token:
    "skb4RYiULHmHm3DV5uTkZZ3hu4LGvHcqLG4f7tqYEYK1xiC6eLfBidZjh0btcvfWxY7QWfznoauvNjm7FeEA5cfMjoQgHTc12inXeNck2CEMIbI8aBgfBL06jqpKcLKLHvBKXQs6BJGdTsPusFXkn09V6gOWjrpRqXGke9wJYQNVVeM3vwKO", // Recommended: move token to env
});

export const uploadImageToSanity = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  const file = new File([blob], "upload.jpg", { type: blob.type });

  const asset = await client.assets.upload("image", file);
  return asset._id;
};

export const savePassengerToSanity = async (passengerData) => {
  try {
    const doc = {
      _type: "passenger",
      ...passengerData,
    };
    const result = await client.create(doc);
    console.log("Sanity saved:", result);
    return result;
  } catch (error) {
    console.error("Failed to save to Sanity:", error);
    throw error;
  }
};
