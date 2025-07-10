import fs from "fs";
import {generateWitness, generateProof, verify} from "./logic.mjs";

const input = JSON.parse(fs.readFileSync("../test-input.json"));

async function main() {
    await generateWitness(input);
    console.log('generated witness!');
    await generateProof(input);
    console.log('generated proof!')
    await verify();
}

main();