import config from '../../config';

export function login(userdata) {
  return new Promise(async (resolve , reject) => {
    const response = await fetch(`${config.API_BASE_URL}/admin/login`, {
      method: 'POST',
      body: JSON.stringify(userdata),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}
  
export function logout(token) {
  return new Promise(async (resolve , reject) => {
    const response = await fetch(`${config.API_BASE_URL}/admin/logout`, {
      method: 'POST',
      body: JSON.stringify(),
      // headers: { 'content-type': 'application/json' ,'Accept':'application/json' ,'Authorization':'Bearer '+token },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}
 