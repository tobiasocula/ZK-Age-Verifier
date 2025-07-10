//import fs from "fs";
import * as snarkjs from "snarkjs";



export async function generateWitness(input) {
    const wcModule = await import('../circuit_js/witness_calculator.js');
    const buffer = await fetch('/circuit.wasm').then(r => r.arrayBuffer());
    const wc = await wcModule.default(buffer);
    const witness = await wc.calculateWTNSBin(input, 0);
    return witness;
}

export async function generateProof(input) {
    // input is object
    const { proof, publicSignals } = await snarkjs.groth16.fullProve( // generates the witness internally
        input,
        "/circuit.wasm",
        "/circuit_final.zkey"
    );
    //fs.writeFileSync("../proof.json", JSON.stringify(proof));
    //fs.writeFileSync("../public.json", JSON.stringify(publicSignals));

    //console.log("Proof and public signals generated.");
    return {proof, publicSignals};
}

export async function verify(p, ps) {
    //const vKey = JSON.parse(fs.readFileSync("../verification_key.json"));
    //const proof = JSON.parse(fs.readFileSync("../proof.json"));
    //const publicSignals = JSON.parse(fs.readFileSync("../public.json"));

    const vKeyResponse = await fetch("/verification_key.json");
    const vKey = await vKeyResponse.json();

    return await snarkjs.groth16.verify(vKey, ps, p);
}

export function downloadProofJson(proof, publicSignals) {
  const data = {
    proof,
    publicSignals
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link and click it
  const a = document.createElement("a");
  a.href = url;
  a.download = "proof.json";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
