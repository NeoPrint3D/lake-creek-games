import { encrypt } from "./encryption";

async function createIndex(id: String) {
  const prod_url = "https://lakecreekgames-neoprint3d.vercel.app/createIndex";
  // const test_url = "http://localhost:8080/createIndex";
  fetch(prod_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: encrypt(id, import.meta.env.VITE_HASH_KEY),
      api_key: encrypt(
        import.meta.env.VITE_API_SYNC_KEY,
        import.meta.env.VITE_HASH_KEY
      ),
    }),
  }).then((res) => {
    if (res.status !== 200) {
      console.log("error");
    }
  });
}

function deleteIndex(id: String) {
  fetch("https://lakecreekgames-neoprint3d.vercel.app/deleteIndex", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: encrypt(id, import.meta.env.VITE_HASH_KEY),
      api_key: encrypt(
        import.meta.env.VITE_API_SYNC_KEY,
        import.meta.env.VITE_HASH_KEY
      ),
    }),
  }).then((res) => {
    if (res.status !== 200) {
      console.log("error");
    }
  });
}

export { createIndex, deleteIndex };
