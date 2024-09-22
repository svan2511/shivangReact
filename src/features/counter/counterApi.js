import config from "../../config";  
  export function getDashboardData(data) {
    let member = data.member ? data.member : null ;
    let center = data.center ? data.center : null ;
    let year = data.year ? data.year : null ;
    
    return new Promise(async (resolve) => {
      const response = await fetch(`${config.API_BASE_URL}/admin/getDashboard?m=${member}&c=${center}&year_filter=${year}`);
      const data = await response.json();
      resolve({ data });
    });
  }
  
