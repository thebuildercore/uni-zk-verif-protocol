use anyhow::Result;
use halo2_proofs::poly::kzg::commitment::KZGCommitmentScheme;
use halo2_proofs::{
    poly::kzg::multiopen::ProverGWC,
    transcript::Blake2sRead,
    transcript::Encoded,
    transcript::Blake2sWrite,
    halo2curves::bn256::{Bn256, G1Affine, Fr},
};
use halo2_proofs::plonk::{keygen_pk, create_proof, verify_proof};
use halo2_proofs::circuit::SimpleFloorPlanner;

use halo2_circuits::SimpleAddCircuit;

fn main() -> Result<()> {
    // Example public inputs — if any
    let public_inputs: Vec<Fr> = vec![];
    // Generate parameters
    let params = KZGCommitmentScheme::<Bn256>::setup();  
    // Setup
    let vk = keygen_pk(&params, SimpleAddCircuit { a: None, b: None })?;
    let pk = keygen_pk(&params, SimpleAddCircuit { a: None, b: None })?;

    // Create a proof (example with witness)
    let circuit = SimpleAddCircuit { a: Value::known(Fr::from(3)), b: Value::known(Fr::from(5)) };
    let mut transcript = Blake2sWrite::<_, G1Affine, _>::init(vec![]);
    create_proof(
        &params,
        &pk,
        &[circuit],
        &[&[&public_inputs]],
        &mut transcript,
        &mut rand::thread_rng(),
    )?;
    let proof = transcript.finalize();

    // Verification (off‑chain) to test
    let strategy = ProverGWC::new(&params);
    let mut verifier_transcript = Blake2sRead::<_, G1Affine>::init(&proof[..]);
    assert!( verify_proof(
        &params,
        &vk,
        strategy,
        &[&[&public_inputs]],
        &mut verifier_transcript
    ).is_ok() );

    // At this point you could serialize vk, proof, public_inputs
    // Then generate on‑chain verifier code (e.g. using template engine)
    println!("Generated VK + proof successfully");

    Ok(())
}
