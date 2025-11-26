use halo2_proofs::{
    plonk::{keygen_pk, keygen_vk, create_proof, verify_proof, ProvingKey, VerifyingKey, SingleVerifier},
    poly::commitment::Params,
    transcript::{Blake2bWrite, Challenge255},
};
use halo2curves::bn256::{Fr, G1Affine};
use std::{fs, io::Cursor};
use rand::thread_rng;

// Import your circuit properly
mod circuits;
use circuits::enterprise::EnterpriseCircuit;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        println!("Usage: cargo run -- [keygen|export-vk|prove]");
        return;
    }

    let command = &args[1];
    let k = 17; // circuit size exponent
    let params: Params<G1Affine> = Params::new(k);

    match command.as_str() {
        "keygen" => {
            let circuit = EnterpriseCircuit { age: Some(Fr::from(20)).into() };
            let vk: VerifyingKey<G1Affine> = keygen_vk(&params, &circuit).unwrap();
            let pk: ProvingKey<G1Affine> = keygen_pk(&params, &vk, &circuit).unwrap();

            fs::write("vk.bin", bincode::serialize(&vk).unwrap()).unwrap();
            fs::write("pk.bin", bincode::serialize(&pk).unwrap()).unwrap();
            println!("Proving and verification keys generated.");
        }
        "export-vk" => {
            let vk_bytes = fs::read("vk.bin").unwrap();
            println!("Verification key bytes: {:?}", vk_bytes);
        }
        "prove" => {
            let circuit = EnterpriseCircuit { age: Some(Fr::from(20)).into() };
            let pk: ProvingKey<G1Affine> = bincode::deserialize(&fs::read("pk.bin").unwrap()).unwrap();

            let mut transcript = Blake2bWrite::<_, G1Affine, Challenge255<_>>::init(Vec::new());
            let mut rng = thread_rng();

            create_proof(
                &params,
                &pk,
                &[circuit],
                &[],
                &mut transcript,
                &mut rng, // RNG is required
            )
            .unwrap();

            let proof: Vec<u8> = transcript.finalize();
            fs::write("proof.bin", &proof).unwrap();
            println!("Proof generated and saved as proof.bin");

            // Optional: verify immediately
            let vk: VerifyingKey<G1Affine> = bincode::deserialize(&fs::read("vk.bin").unwrap()).unwrap();
            let strategy = SingleVerifier::new(&params);
            let mut verifier_transcript = Cursor::new(&proof);

            let valid = verify_proof(
                &params,
                &vk,
                strategy,
                &[],
                &mut verifier_transcript,
            );

            match valid {
                Ok(_) => println!("Proof verified successfully"),
                Err(e) => println!("Proof verification failed: {:?}", e),
            }
        }
        _ => println!("Unknown command"),
    }
}
