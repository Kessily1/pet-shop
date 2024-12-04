interface InventoryStatus {
    label: string;
    value: string;
}
export interface Servico {
    id?: string;  
    key?: string;          
    nome?: string;           
    descricao?: string;
    duracao?: number; 
    valor?: number;          
    inventoryStatus?: InventoryStatus; 
}

