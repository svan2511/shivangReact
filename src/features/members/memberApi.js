import config from '../../config';

export function insertMember(member) {
  
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members`, {
      method: 'POST',
      body: member,
     // headers: {'Content-Type': 'multipart/form-data' },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  
  });
}


export function deleteMember(id) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function fetchAllMembers() {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members`);
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function fetchMemberById(id) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members/${id}`);
    const data = await response.json();
    
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function fetchMemberByName(name) {

  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members/name/${name}`, {
      method: 'POST',
      body: JSON.stringify(),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}

export function updateInstallment(instData) {
  return new Promise(async (resolve ,reject) => {
    const response = await fetch(`${config.API_BASE_URL}/members/updateInst`, {
      method: 'POST',
      body: JSON.stringify(instData),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    data.success ? resolve({ data }) : reject({ message:data.message });
  });
}
