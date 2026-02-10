import { api } from "./api";

export interface Delivery{
    id?:string
    fee:number
    status:"active"|'inactive'
}
export const deliveryApi={
async getDeliveryFee():Promise<Delivery[]>{
    const response = await api.get('/delivery/fee');
    return response.data.data;
},
async updateDeliveryFee(feeData:Delivery):Promise<Delivery>{
    const response = await api.put(`/delivery/fee/${feeData.id}`, { fee: feeData.fee, status: feeData.status });
    return response.data.data;
},
async createDeliveryFee(feeData:Delivery):Promise<Delivery>{
    const response = await api.post('/delivery/fee', feeData );
    return response.data.data;
},

async deleteDeliveryFee(id:string):Promise<{success:boolean}>{
    await api.delete(`/delivery/fee/${id}`);
    return {success:true}
},

async getActiveDeliveryFee():Promise<Delivery | null>{
    const response = await api.get('/delivery/fee/active');
    return response.data.data; 
 }
}
