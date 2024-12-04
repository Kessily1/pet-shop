interface InventoryStatus {
    label: string;
    value: string;
}

interface Pet {
    // Define the properties of the Pet interface
    id?: string;
    name?: string;
    // Add other properties as needed
}

interface tutor{
    id?: string;
    name?: string;
}

interface servico{
    id?: string;
    name?: string;
}


export interface solicitacao {
    id?: string;
  key?: string;
  Pet?: Pet;  
  tutor?: string;
  servico?: string;
  data?: Date;
  nome?: string;
}