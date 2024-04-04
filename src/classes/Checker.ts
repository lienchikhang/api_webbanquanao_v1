export class TextChecker {
    hasSpecialChar(string: string) {
        const regex = /[\W_]/;
        return regex.test(string);
    }

    hasNumber(string: string) {
        const regex = /[0-9]/;
        return regex.test(string);
    }

    hasSpace(string: string) {
        const regex = /[\s]/;
        return regex.test(string);
    }

    /**
     * @param string 
     * @returns true if found a thief
     */
    ultiScan(string: string) {
        return this.hasSpace(string) && this.hasNumber(string) && this.hasSpecialChar(string);
    }
}

export class NumberChecker {
    isNumber(data: any): boolean {
        return !isNaN(data);
    }

    scanPrice(price: number) {
        if (price <= 0) return false;

        return true;
    }

    scanAmount(amount: number) {
        if (amount <= 0) return false;

        return true;
    }
}

export class MailChecker {
    isEmail(email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}


export class ObjectChecker {
    isEmptyObject(obj: Object) {
        return Object.keys(obj).length === 0;
    };
}

// class Checker {
//     static create(type?: string) {
//         switch (type) {
//             case 'num': {
//                 return new NumberChecker();
//             }
//             case 'mail': {
//                 return new MailChecker();
//             }
//             default: {
//                 return new TextChecker();
//             }
//         }
//     }
// }

// export default Checker;