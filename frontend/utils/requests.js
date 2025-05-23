//   require('dotenv').config({ path: require('path').resolve(__dirname, '../../../', '.env') });

  const  BASE_URL=import.meta.env.VITE_DEV_BASE_URL
  const  PORT=import.meta.env.VITE_PORT
  console.log('BASE_URL',BASE_URL)

  
  export async function fetchWithOutCSRF({ url, method, body }) {
    // const csrfToken = localStorage.getItem("csrfToken");
    // console.log("csrfToken get", csrfToken);
    const response = await fetch(`${BASE_URL}:${PORT}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // ...(isCsrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
    //   credentials: 'include',
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  }