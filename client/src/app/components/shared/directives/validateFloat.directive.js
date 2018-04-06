export function validateFloat() {
  return {
    require: 'ngModel',
    link: function (scope, ele, attrs) {
      ele.bind('keypress', function (e) {
        var newVal = $(this).val() + String.fromCharCode(e.keyCode);

        if (newVal != "") {
          var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;

          if (re.test(newVal)) {
          }
          else {
            event.preventDefault();
          }
        }
      });
    }
  };
};