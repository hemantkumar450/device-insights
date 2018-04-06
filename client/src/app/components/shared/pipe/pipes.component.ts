import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'orderby'
})
export class OrderByPipe implements PipeTransform {
   transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Pipe({
    name: 'Filter'
})
export class VendorFilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(vendor=> vendor.VandorName.indexOf(filter) != -1) : value;
    }
}
@Pipe({
    name: 'AccountFilter'
})
export class AccountFilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(ledgerAccount=> ledgerAccount.LedgerAccount.indexOf(filter) != -1) : value;
    }
}
@Pipe({
    name: 'purchaseFilter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(purchase=> purchase.NumberKey.indexOf(filter) != -1) : value;
       
    }
}



const PADDING = "000000";

@Pipe({ name: "CurrencyPipe" })
export class CurrencyPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
     var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

     if (negativeCheck[1] != undefined) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }
        if (decimalCheck[1] != undefined) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

    return clean;
  }
 
  parse(value: string, fractionSize: number = 2): string {

     var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

     if (negativeCheck[1] != undefined) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }
        if (decimalCheck[1] != undefined) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

    return clean;
  }

}



@Pipe({
  name: 'OrderByTable',
  pure: false
})
export class OrderByTable implements PipeTransform {

	value:string[] =[];

	static _orderByComparator(a:any, b:any):number{
        
        if(a === null || typeof a === 'undefined') a = 0;
        if(b === null || typeof b === 'undefined') b = 0;

		if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
			//Isn't a number so lowercase the string to properly compare
			if(a.toLowerCase() < b.toLowerCase()) return -1;
			if(a.toLowerCase() > b.toLowerCase()) return 1;
		}
		else{
			//Parse strings as numbers to compare properly
			if(parseFloat(a) < parseFloat(b)) return -1;
			if(parseFloat(a) > parseFloat(b)) return 1;
		}

		return 0; //equal each other
	}

    transform(input:any, config:string = '+'): any{

    	//make a copy of the input's reference
    	this.value = [...input];
    	var value = this.value;
        
        if(!Array.isArray(value)) return value;

        if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
            var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
            var desc = propertyToCheck.substr(0, 1) == '-';
            
            //Basic array
            if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
                return !desc ? value.sort() : value.sort().reverse();
            }
            else {
                var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;

                return value.sort(function(a:any,b:any){
                    return !desc 
                        ? OrderByTable._orderByComparator(a[property], b[property]) 
                        : -OrderByTable._orderByComparator(a[property], b[property]);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return value.sort(function(a:any,b:any){
                for(var i:number = 0; i < config.length; i++){
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];

                    var comparison = !desc 
                        ? OrderByTable._orderByComparator(a[property], b[property]) 
                        : -OrderByTable._orderByComparator(a[property], b[property]);
                    
                    //Don't return 0 yet in case of needing to sort by next property
                    if(comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}