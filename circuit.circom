pragma circom 2.2.2;

include "node_modules/circomlib/circuits/comparators.circom";

template Main(minimumAge) {
    signal input dob;
    signal input date;
    signal output out;

    signal age;
    
    age <== date - dob;

    // Checks if age >= minimumAge
    component cmp = GreaterEqThan(128); // Adjust bit length to your expected max age
    cmp.in[0] <== age;
    cmp.in[1] <== minimumAge;

    out <== cmp.out;
}

component main = Main(18 * 365 * 3600 * 1000 * 24);