
export class QualityControlModel {

}

export class MeanSD {
  COMPOUND_NAME: string = '';
  COMPOUND_METHOD: string = '';
  MEAN: number = 0;
  SD: number = 0;
  CV: number = 0;
}

export class AdjMeanSD {
  COMPOUND_NAME: string = '';
  COMPOUND_METHOD: string = '';
  MEAN: number = 0;
  SD: number = 0;
  ADJ_MEAN: number = 0;
  ADJ_SD: number = 0;
  ADJ_THRESHOLD: number = 0;
  isEdit: boolean = false;
  CV: number = 0;
}

export class Results {
  COMP_NAME: string = '';
  LOW: number = 0;
  LOW_STATUS: string = '';
  MID: number = 0;
  MID_STATUS: string = '';
  HIGH: number = 0;
  HIGH_STATUS: string = '';
  END: number = 0;
  END_STATUS: string = '';
  OVERALL_STATUS: number = 0;
  REASON_ID: number = 0;
  REASON_VALUE: string = '';
  MONTH: number = 0;
  YEAR: number = 0;
  REPORT_DATE: string = '';
  INSTRUMNET_ID: number = 0;
  BATCH_ID: string = '';
  LAB_ID: number = 0;
  COMP_ID: number = 0;
  USER_NAME: string = null;
  isEdit: boolean = false;
}


export class QualityControlCompound {
  INSTRUMENT_ID: number = 0;
  COMP_ID: number = 0;
  COMP_NAME: string = '';
  isEdit: boolean = false;
}

export class QualityControlMethod {
  INSTRUMENT_ID: number = 0;
  METHOD_ID: number = 0;
  METHOD_NAME: string = '';
  isEdit: boolean = false;
}

export class QualityControlInstrument {
  INSTRUMENT_ID: number = 0;
  INSTRUMENT_NAME: string = '';
  isEdit: boolean = false;
}

export class QualityControlReason {
  REASON_ID: number = 0;
  REASON_NAME: string = '';
  REASON_CODE:number;
  isEdit: boolean = false;
}


export class QualityControlReview {
  LAB_ID: number = 0;
  INSTRUMENT_ID: number = 0;
  MONTH: number = 0;
  MONTH_NAME: string = '';
  YEAR: number = 0;
  REVIEWED_BY: number = 0;
  DOCUMENT_URL: string = '';
  INSTRUMENT_NAME: string = '';
  STATUS: string = '';
}
