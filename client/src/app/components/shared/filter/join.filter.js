export function joinFilter(){
    return function join(array, separator, prop) 
    {   
      if(array==null || array==''){
          return array;
      }

      if(array.indexOf('[')!=-1 && array!='')
          array=JSON.parse(array);
        if (!Array.isArray(array)) {
			return array; // if not array return original - can also throw error
        }

        return (!!prop ? array.map(function (item) {
            return item[prop];
        }) : array).join(separator);
    };
};