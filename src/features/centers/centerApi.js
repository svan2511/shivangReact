import config from "../../config";


export function insertCenter(center) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/centers`, {
      method: 'POST',
      body: JSON.stringify(center),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
   
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}
  
  export function fetchAllCenters() {
    return new Promise(async (resolve , reject) => {
      const response = await fetch(`${config.API_BASE_URL}/centers`);
      const data = await response.json();
    
      data.success ? resolve({ data }) : reject({ message:data.message });
    });
  }
  
  
  export function deleteCenter(id) {
    return new Promise(async (resolve ,reject) => {
      const response = await fetch(`${config.API_BASE_URL}/centers/${id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      data.success ? resolve({ data }) : reject({ message:data.message });
    });
  }

  export function fetchCenterById(data) {
    const name = data.name;
    const id = data.id;
    const url = data.name ? `${config.API_BASE_URL}/centers/${id}/${name}` : `${config.API_BASE_URL}/centers/${id}`;

    return new Promise(async (resolve ,reject) => {
      const response = await fetch(url);
      const data = await response.json();
      data.success ? resolve({ data }) : reject({ message:data.message });
    });
  }

  export function fetchCenterByName(name) {
    return new Promise(async (resolve ,reject) => {
      const response = await fetch(`${config.API_BASE_URL}/centers/name/${name}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json();
      data.success ? resolve({ data }) : reject({ message:data.message });
    });
  }
