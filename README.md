# matvenus-cli

Command-line interface for the VenusFactory Protein Tools API. Provides access to protein structure prediction, mutation analysis, molecular dynamics, and de novo protein design via the VenusFactory MCP server.

## Installation

### From NPM (Recommended)

```bash
# Install globally
npm install -g matvenus-cli

# Or use without installation
npx matvenus-cli --help
```

### From Source

```bash
git clone https://github.com/matwings/matwings-venus-cli.git
cd matwings-venus-cli
npm install
npm run build
npm link  # optional: install globally as `matvenus-cli`
```

## Authentication

Set the Bearer token via environment variable before running any command:

```bash
export API_BEARER_TOKEN="your-api-key-here"
```

## Base URL

The default base URL is `https://venus.matwings.com`. Override per-command with `--base-url <url>`.

## Async Execution Pattern

**All compute-heavy commands are asynchronous.** They return immediately with:

```json
{
  "tool_call_id": "abc-123",
  "status": "pending",
  "tool_name": "alphafold_protein_folding"
}
```

You must poll `get-tool-result` until `status` is `success` or `error`:

```bash
# Submit job
matvenus-cli alphafold-protein-folding --body '{"sequence": "MKTAYIAKQ..."}'

# Poll for result (repeat until status = success)
matvenus-cli get-tool-result --tool-call-id abc-123
```

Status values: `pending` → `running` → `success` | `error`

## Uploading Local Files

Many commands accept `fasta_file`, `pdb_file`, etc. as OSS URLs. To use a local file:

```bash
# 1. Base64-encode the file
CONTENT=$(base64 -w 0 my_protein.fasta)

# 2. Upload and get OSS URL
matvenus-cli upload-file-base-64 \
  --body "{\"filename\": \"my_protein.fasta\", \"content_base64\": \"$CONTENT\"}"
# Returns: result.url = "oss://bucket/..."

# 3. Use the URL in prediction commands
matvenus-cli alphafold-protein-folding \
  --body '{"fasta_file": "oss://bucket/..."}'
```

## Commands

### Functional Residue Prediction

#### `predict-functional-residue`
Predict functional residues (activity/binding/conserved sites, motifs).

```bash
matvenus-cli predict-functional-residue --body '{
  "sequence": "MKTAYIAKQRQISFVKSHFSRQ...",
  "model_name": "ESM2-650M",
  "task": "Activity Site"
}'
```

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| sequence | string \| null | — | Inline amino acid sequence |
| fasta_file | string \| null | — | OSS URL to FASTA file |
| model_name | string | `ESM2-650M` | `ESM2-650M`, `Ankh-large`, `ProtT5-xl-uniref50` |
| task | string | `Activity Site` | `Activity Site`, `Binding Site`, `Conserved Site`, `Motif` |

#### `venusx-functional-residue-prediction`
VenusX model for functional site prediction (higher accuracy than base model).

```bash
matvenus-cli venusx-functional-residue-prediction --body '{
  "sequence": "MKTAYIAKQ...",
  "task": "VenusX-Activity",
  "mode": "pro"
}'
```

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| sequence | string \| null | — | |
| fasta_file | string \| null | — | OSS URL |
| task | string | `VenusX-Activity` | `VenusX-Activity`, `VenusX-Binding`, `VenusX-Evo` |
| mode | string | `pro` | `pro` (Ankh-large), `light` (ESM2-650M) |

### Protein Function Prediction

#### `venusg-protein-function-prediction`
Predict protein-level properties: solubility, localization, stability, kinetics, etc.

```bash
matvenus-cli venusg-protein-function-prediction --body '{
  "sequence": "MKTAYIAKQ...",
  "task": "VenusG-Solubility",
  "mode": "light"
}'
```

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| sequence | string \| null | — | |
| fasta_file | string \| null | — | OSS URL |
| task | string | `VenusG-Solubility` | `VenusG-Solubility`, `VenusG-SubcellularLocalization`, `VenusG-MembraneProtein`, `VenusG-Metalionbinding`, `VenusG-Stability`, `VenusG-Sortingsignal`, `VenusG-OptimumTemperature`, `VenusG-Kcat`, `VenusG-OptimalPH` |
| mode | string | `light` | `pro` (ESM2-650M), `light` (ProtBert) |

#### `predict-protein-properties`
Calculate physicochemical properties and structural features.

```bash
matvenus-cli predict-protein-properties --body '{
  "sequence": "MKTAYIAKQ...",
  "task_name": "Physical and chemical properties"
}'
```

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| sequence | string \| null | — | |
| fasta_file | string \| null | — | OSS URL to FASTA or PDB |
| task_name | string | `Physical and chemical properties` | `Physical and chemical properties`, `Relative solvent accessible surface area (PDB only)`, `SASA value (PDB only)`, `Secondary structure (PDB only)` |

### Structure Prediction

#### `esmfold-protein-folding`
Fast protein structure prediction using ESMFold (sequence only, no MSA).

```bash
matvenus-cli esmfold-protein-folding --body '{
  "sequence": "MKTAYIAKQRQISFVKSHFSRQ"
}'
```

| Parameter | Required | Default |
|-----------|----------|---------|
| sequence | yes | — |
| verbose | no | `true` |

#### `alphafold-protein-folding`
High-accuracy structure prediction with AlphaFold2 or AlphaFold3.

```bash
# Single chain (AF2)
matvenus-cli alphafold-protein-folding --body '{
  "model_version": "alphafold2",
  "sequence": "MKTAYIAKQ..."
}'

# Multi-chain complex with ligand (AF3)
matvenus-cli alphafold-protein-folding --body '{
  "model_version": "alphafold3",
  "sequences": [
    {"protein": {"id": "A", "sequence": "MKTAYIAKQ..."}},
    {"ligand": {"id": "Z", "ccdCodes": ["ATP"]}}
  ],
  "model_seeds": [42]
}'
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| model_version | string | `alphafold2` | `alphafold2` or `alphafold3` |
| sequence | string \| null | — | Single-chain sequence (AF2/AF3 simple) |
| fasta_file | string \| null | — | OSS URL to FASTA |
| sequences | array \| null | — | Multi-chain/ligand entities (see schema) |
| model_seeds | int[] \| null | `[42]` | Random seeds (AF3 only) |

### Mutation Prediction

#### `venusrem-mutation-prediction`
Single-point mutation effect prediction using multi-model ensemble.

```bash
# Light mode (sequence-based)
matvenus-cli venusrem-mutation-prediction --body '{
  "task": "stability",
  "mode": "light",
  "sequence": "MKTAYIAKQ..."
}'

# Pro mode (structure-based, higher accuracy)
matvenus-cli venusrem-mutation-prediction --body '{
  "task": "activity",
  "mode": "pro",
  "structure_file": "oss://bucket/protein.pdb"
}'
```

| Parameter | Required | Options |
|-----------|----------|---------|
| task | yes | `activity`, `binding`, `stability`, `expression`, `general` |
| mode | yes | `pro` (structure-based), `light` (sequence-based) |
| structure_file | pro mode | OSS URL to PDB |
| sequence | light mode | Inline sequence |
| fasta_file | light mode | OSS URL to FASTA |

#### `venusprime-multipoint-prediction`
Multi-point combination mutation prediction using trained ensemble models.

Two-step workflow: **train** → **inference**

```bash
# Step 1: Train models from experimental data
matvenus-cli venusprime-multipoint-prediction --body '{
  "mode": "train",
  "sequence": "MKTAYIAKQ...",
  "experiment_file": "oss://bucket/mutations.csv",
  "score_col_name": "fitness",
  "model_num": 5
}'
# Returns tool_call_id; poll until success; result contains model_path_list

# Step 2: Inference on combination mutations
matvenus-cli venusprime-multipoint-prediction --body '{
  "mode": "inference",
  "model_path_list": ["oss://bucket/model_0.pkl", "..."],
  "site": [10, 25, 42]
}'
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| mode | string | `inference` | `train` or `inference` |
| venus_mode | string | `light` | `light` (ridge regression) |
| sequence | string \| null | — | Wild-type sequence (train) |
| fasta_file | string \| null | — | OSS URL to FASTA (train) |
| experiment_file | string \| null | — | OSS URL to CSV with `mutant`+`score` cols (train) |
| score_col_name | string | — | Score column name in experiment_file |
| model_path_list | string[] \| null | — | Trained model OSS URLs (inference) |
| site | int[] \| null | `[2,3,4]` | Mutation site positions (inference) |
| model_num | int | `5` | Ensemble model count (train) |
| target_server | string | `slurm` | `slurm` or `paracloud` |

### Molecular Dynamics

#### `gromacs-md`
Run GROMACS MD simulation (system build + production run).

```bash
matvenus-cli gromacs-md --body '{
  "pdb_file": "oss://bucket/protein.pdb",
  "force_field": "amber99sb-ildn",
  "water_model": "tip3p",
  "temp": "300",
  "md_steps": "50000"
}'
```

| Parameter | Required | Default |
|-----------|----------|---------|
| pdb_file | yes | OSS URL to PDB |
| force_field | no | `amber99sb-ildn` |
| water_model | no | `tip3p` |
| temp | no | `300` (K) |
| pressure | no | `1.0` (bar) |
| md_steps | no | `50000` (~100ps at dt=2fs) |

#### `gromacs-analysis`
Analyze GROMACS MD trajectory (RMSD, RMSF, Rg, etc.).

Requires output from a completed `gromacs-md` run.

```bash
matvenus-cli gromacs-analysis --body '{
  "tpr_file": "oss://bucket/md.tpr",
  "xtc_file": "oss://bucket/md.xtc"
}'
```

### Protein Mining & Design

#### `venusmine-protein-mining`
Mine novel protein variants from structure-based screening.

```bash
matvenus-cli venusmine-protein-mining --body '{
  "pdb_file": "oss://bucket/protein.pdb",
  "target_server": "slurm"
}'
```

#### `proteinmpnn-sequence-design`
Design sequences for a given protein backbone using ProteinMPNN.

```bash
matvenus-cli proteinmpnn-sequence-design --body '{
  "pdb_path": "oss://bucket/backbone.pdb",
  "designed_chains": ["A"],
  "fixed_chains": ["B"],
  "num_sequences": 4,
  "temperatures": [0.1]
}'
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| pdb_path | string | — | OSS URL to PDB (required) |
| designed_chains | string[] \| null | — | Chains to redesign |
| fixed_chains | string[] \| null | — | Chains to keep fixed |
| num_sequences | int | `4` | Sequences to generate |
| temperatures | float[] | `[0.1]` | Sampling temperatures |
| omit_aas | string | `X` | Amino acids to exclude |
| homomer | bool | `false` | Symmetric homomer design |
| ca_only | bool | `false` | Cα-only backbone |

#### `rfdiffusion-protein-design`
De novo protein structure generation using RFdiffusion.

```bash
# Unconditional generation
matvenus-cli rfdiffusion-protein-design --body '{
  "length": "100",
  "num_designs": 3
}'

# Motif scaffolding
matvenus-cli rfdiffusion-protein-design --body '{
  "input_pdb": "oss://bucket/motif.pdb",
  "contig": "A10-20,80",
  "num_designs": 5
}'

# Binder design
matvenus-cli rfdiffusion-protein-design --body '{
  "input_pdb": "oss://bucket/target.pdb",
  "hotspots": "A10,A15,A20",
  "length": "80-120"
}'
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| input_pdb | string \| null | — | OSS URL (optional for unconditional) |
| contig | string \| null | — | Contig string, e.g. `A10-20,80` |
| num_designs | int | `1` | Designs to generate |
| length | string \| null | — | Length constraint, e.g. `100` or `80-120` |
| hotspots | string \| null | — | Hotspot residues, e.g. `A10,A15` |
| partial_t | float \| null | — | Noise level for partial diffusion (Å) |
| T | int | `50` | Diffusion steps |

### File Upload

#### `upload-file-base-64`
Upload a local file to OSS storage and get a URL for use in other commands.

```bash
CONTENT=$(base64 -w 0 protein.fasta)
matvenus-cli upload-file-base-64 --body "{
  \"filename\": \"protein.fasta\",
  \"content_base64\": \"$CONTENT\"
}"
# Response: result.url = OSS URL to use in other commands
```

### Result Management

#### `get-tool-result`
Poll for the result of an async job.

```bash
matvenus-cli get-tool-result --tool-call-id <tool_call_id>
```

Response includes `status` (`pending`/`running`/`success`/`error`), `tool_result` (on success), and `slurm_tasks` with per-job details.

#### `cancel-tool-result`
Cancel a pending or running job.

```bash
matvenus-cli cancel-tool-result --tool-call-id <tool_call_id>
```

## Global Options

All commands support:

| Option | Description |
|--------|-------------|
| `--base-url <url>` | Override default base URL |
| `--output json\|table` | Output format (default: `json`) |
| `--schema` | Print the API schema for this command and exit |

## Inspect Command Schema

```bash
matvenus-cli alphafold-protein-folding --schema
matvenus-cli venusrem-mutation-prediction --schema
```
