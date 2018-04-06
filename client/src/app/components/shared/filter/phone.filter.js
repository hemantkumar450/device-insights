export function phoneFilter() {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, first, second,third;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                first = value.slice(0, 3);
                second = value.slice(3,6);
                third = value.slice(6,10);
                break;
            case 9:
                country = 1;
                first = value.slice(0, 3);
                second = value.slice(3,5);
                third = value.slice(5,9);
                break;
            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }
        return (first + "-" + second + "-" + third).trim();
    };
};