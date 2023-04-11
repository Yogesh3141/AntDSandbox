import axios from "axios";

class SalesServicesClass {
  private route = "https://localhost:7086/api/Sales";

  getList = () => axios.get(`${this.route}`);

  saveSale = (params: any) => axios.post(`${this.route}`, params);
}

const SalesServices = new SalesServicesClass();

export default SalesServices;
