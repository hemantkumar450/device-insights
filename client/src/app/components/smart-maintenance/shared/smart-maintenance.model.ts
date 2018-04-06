
export class SmartMaintenance {

}

export class SmartMaintenanceFrequency {
    FREQ_ID: number = 0;
    FREQ_NAME: string = '';
    isEdit: boolean = false;
}


export class SmartMaintenanceInstrument {
    LAB_ID: number = 0;
    INSTR_ID: number = 0;
    INSTR_NAME: string = '';
    isEdit: boolean = false;
}

export class SmartMaintenanceInstrumentFrequency {
    INSTR_FREQ_ID: number = 0;
    LAB_ID: number = 0;
    INSTR_ID: number = 0;
    FREQ_ID: number = 0;
    isEdit: boolean = false;
}


export class SmartMaintenanceItem {
    LAB_ID: number = 0;
    INSTR_ID: number = 0;
    FREQ_ID: number = 0;
    ITEM_ID: number = 0;
    ITEM_NAME: string = '';
    ITEM_TYPE: number = 1;
    isEdit: boolean = false;
}


export class SmartMaintenanceItemMapping {
    LAB_ID: number = 0;
    INSTR_ID: number = 0;
    FREQ_ID: number = 0;
    ITEM_ID: number = 0;
    MAP_ID: number = 0;
    MAP_NAME: string = '';
    isEdit: boolean = false;
}