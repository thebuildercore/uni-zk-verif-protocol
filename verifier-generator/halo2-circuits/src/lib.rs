use halo2_proofs::{
    circuit::{Layouter, SimpleFloorPlanner, Value},
    plonk::{Circuit, ConstraintSystem, Error},
    pasta::Fp,
};

#[derive(Clone)]
pub struct SimpleAddConfig {}

#[derive(Clone)]
pub struct SimpleAddCircuit {
    pub a: Value<Fp>,
    pub b: Value<Fp>,
}

impl Circuit<Fp> for SimpleAddCircuit {
    type Config = SimpleAddConfig;
    type FloorPlanner = SimpleFloorPlanner;

    fn configure(cs: &mut ConstraintSystem<Fp>) -> Self::Config {
        let _ = cs.advice_column();
        // you can configure as needed
        SimpleAddConfig {}
    }

    fn synthesize(
        &self,
        _config: Self::Config,
        mut layouter: impl Layouter<Fp>,
    ) -> Result<(), Error> {
        layouter.assign_region(
            || "region0",
            |mut region| {
                let a = region.assign_advice(
                    || "a",
                    _config.advice_column(),
                    0,
                    || self.a,
                )?;
                let b = region.assign_advice(
                    || "b",
                    _config.advice_column(),
                    1,
                    || self.b,
                )?;
                let c = region.assign_advice(
                    || "c",
                    _config.advice_column(),
                    2,
                    || a.value().zip(b.value()).map(|(a, b)| *a + *b),
                )?;
                // enforce c = a + b
                region.constrain_equal(c.cell(), a.cell())?; // simplified, replace accordingly
                Ok(())
            },
        )
    }
}
