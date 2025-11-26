use halo2_proofs::{
    circuit::{Layouter, SimpleFloorPlanner, Value},
    plonk::{Circuit, ConstraintSystem, Error, Selector, Advice, Expression, Column},
    poly::Rotation,
};
use halo2curves::bn256::Fr;

#[derive(Clone, Debug)]
pub struct EnterpriseCircuit {
    pub age: Value<Fr>,
}

#[derive(Clone, Debug)]
pub struct EnterpriseConfig {
    pub q: Selector,
    pub age_col: Column<Advice>,
}

impl EnterpriseConfig {
    pub fn configure(meta: &mut ConstraintSystem<Fr>) -> Self {
        let q = meta.selector();
        let age_col = meta.advice_column();

        meta.create_gate("age >= 18 check", |meta| {
            let q = meta.query_selector(q);
            let age_expr = meta.query_advice(age_col, Rotation::cur());
            let eighteen = Expression::Constant(Fr::from(18u64));
            vec![q * (age_expr - eighteen)]
        });

        EnterpriseConfig { q, age_col }
    }
}

impl Circuit<Fr> for EnterpriseCircuit {
    type Config = EnterpriseConfig;
    type FloorPlanner = SimpleFloorPlanner;

    fn without_witnesses(&self) -> Self {
        Self { age: Value::unknown() }
    }

    fn configure(meta: &mut ConstraintSystem<Fr>) -> Self::Config {
        EnterpriseConfig::configure(meta)
    }

    fn synthesize(
        &self,
        config: EnterpriseConfig,
        mut layouter: impl Layouter<Fr>,
    ) -> Result<(), Error> {   // ✅ use plonk::Error
        layouter.assign_region(
            || "age region",
            |mut region| {
                config.q.enable(&mut region, 0)?;
                region.assign_advice(
                    || "age",
                    config.age_col,
                    0,
                    || self.age,
                )?;
                Ok(())
            },
        )?;
        Ok(())
    }
}
