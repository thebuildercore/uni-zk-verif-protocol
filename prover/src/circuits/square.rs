se halo2_proofs::{
    circuit::{Layouter, SimpleFloorPlanner, Value},
    plonk::{Circuit, ConstraintSystem, Error, Advice, Selector, Expression, Column},
    poly::Rotation,
};
use halo2curves::bn256::Fr;

#[derive(Clone, Debug)]
pub struct SquareCircuit {
    pub x: Value<Fr>,
}

#[derive(Clone, Debug)]
pub struct SquareConfig {
    pub q: Selector,
    pub x_col: Column<Advice>,
}

impl SquareConfig {
    pub fn configure(meta: &mut ConstraintSystem<Fr>) -> Self {
        let q = meta.selector();
        let x_col = meta.advice_column();

        meta.create_gate("x = x constraint", |meta| {
            let q = meta.query_selector(q);
            let x_expr = meta.query_advice(x_col, Rotation::cur());
            vec![q * (x_expr.clone() - x_expr.clone())] // dummy constraint for testing
        });

        SquareConfig { q, x_col }
    }
}

impl Circuit<Fr> for SquareCircuit {
    type Config = SquareConfig;
    type FloorPlanner = SimpleFloorPlanner;

    fn without_witnesses(&self) -> Self {
        Self { x: Value::unknown() }
    }

    fn configure(meta: &mut ConstraintSystem<Fr>) -> Self::Config {
        SquareConfig::configure(meta)
    }

    fn synthesize(
        &self,
        config: SquareConfig,
        mut layouter: impl Layouter<Fr>,
    ) -> Result<(), Error> {
        layouter.assign_region(
            || "square region",
            |mut region| {
                config.q.enable(&mut region, 0)?;
                region.assign_advice(|| "x", config.x_col, 0, || self.x)?;
                Ok(())
            },
        )?;
        Ok(())
    }
}
