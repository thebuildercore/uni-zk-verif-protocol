` Updated 28-11-2025`
# Root cause: Multiple versions of ff crate

halo2_proofs depends on one version of ff (say 0.12.x)

halo2curves depends on another version of ff (say 0.13.x)

our code is trying to use halo2curves::bn256::Fr as the field type for a halo2_proofs::Circuit

Rust sees these as different types because Fr from halo2curves uses ff 0.13.x, while halo2_proofs::ConstraintSystem expects a field implementing the Field trait from ff 0.12.x.


Error :

the trait bound `halo2curves::bn256::Fr: halo2_proofs::arithmetic::Field` is not satisfied

two types coming from two different versions of the same crate are different types even if they look the same

This is the classic “multiple ff versions” problem in Halo2 projects.


# 3️ Why this happens

halo2curves v0.2.1 (or other old versions) are not compatible with your halo2_proofs version.

Even if you force a BN256 Fr type, Rust sees two different Field traits (from ff 0.12.x and ff 0.13.x).

Result: nothing compiles — every part of the prover circuit fails.

 TL;DR

Our build is failing at every place where you use halo2curves::bn256::Fr as a field for halo2_proofs, including:

ConstraintSystem<Fr>
Circuit<Fr> implementation
Layouter and Region methods (assign_advice, assign_region)
meta.selector(), meta.create_gate(), meta.advice_column()

All of this is because of mismatched ff versions between halo2curves and halo2_proofs.
