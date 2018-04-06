export function compareTo() {
  return {
    require: 'ngModel',
    scope: {
      fieldToCompare: '=compareTo'
    },
    link: function (scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function (modelValue) {
        return modelValue === scope.fieldToCompare;
      };
      scope.$watch('fieldToCompare', function () {
        ngModel.$validate();
      });
    }
  }
}
