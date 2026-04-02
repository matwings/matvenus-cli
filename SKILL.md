---
name: venus-protein-tools
description: MatVenus protein computational tools via matvenus-cli CLI. Covers structure prediction (ESMFold/AlphaFold2/AF3), mutation effect prediction (VenusREM/VenusPrime), functional site annotation (VenusX/VenusG), molecular dynamics (GROMACS), and de novo design (ProteinMPNN/RFdiffusion).
allowed-tools:
  - bash
---

# MatVenus Protein Tools — Agent Usage Guide

## CRITICAL: Async Execution Pattern

**ALL prediction/design commands are asynchronous.** They return a `tool_call_id` immediately. You MUST poll until `status` is `success` or `error`.

```
Step 1: Submit  →  get tool_call_id + status: pending
Step 2: Poll    →  matwings-venus-cli get-tool-result --tool-call-id <id>
                   Repeat every 15-30s until status = success | error
Step 3: Use result  →  response.tool_result contains the actual output
```

Never assume a job is done after submission. Always poll.

## Authentication

`API_BEARER_TOKEN` environment variable must be set. Never hardcode tokens.

## Input: Sequence vs File

Most commands accept **either** `sequence` (inline string) or `fasta_file` (OSS URL). Never provide both for the same entity.

- Use `sequence` for short, simple cases (single chain, already in memory).
- Use `fasta_file` when the user provides a file path. Upload it first (see below).

## Uploading Local Files

When the user provides a local PDB/FASTA file, you MUST upload it first:

```bash
# 1. Encode the file
CONTENT=$(base64 -w 0 /path/to/file.pdb)

# 2. Upload
RESULT=$(matwings-venus-cli upload-file-base-64 \
  --body "{\"filename\": \"file.pdb\", \"content_base64\": \"$CONTENT\"}")

# 3. Extract OSS URL (upload is synchronous — status:success immediately)
OSS_URL=$(echo "$RESULT" | jq -r '.result.url')

# 4. Use OSS_URL in the prediction command
```

Upload responses are **synchronous** (`status: success` immediately). The `result.url` field contains the OSS URL.

---

## Command Reference

All commands use `--body '<json>'` for parameters. Use `--schema` to inspect the full parameter list.

### Structure Prediction

#### `esmfold-protein-folding`
Fast prediction from sequence only (no MSA, minutes). Use as a quick structure source for docking or design.

```bash
matwings-venus-cli esmfold-protein-folding \
  --body '{"sequence": "MKTAYIAKQRQISFVK..."}'
```
Required: `sequence`

#### `alphafold-protein-folding`
High-accuracy prediction. AlphaFold2 for single/multi protein chains. AlphaFold3 for proteins + DNA/RNA/ligands.

```bash
# AF2, single chain
matwings-venus-cli alphafold-protein-folding \
  --body '{"model_version": "alphafold2", "sequence": "MKTAY..."}'

# AF3, protein + ATP ligand
matwings-venus-cli alphafold-protein-folding \
  --body '{
    "model_version": "alphafold3",
    "sequences": [
      {"protein": {"id": "A", "sequence": "MKTAY..."}},
      {"ligand": {"id": "Z", "ccdCodes": ["ATP"]}}
    ]
  }'
```

Parameters:
- `model_version`: `"alphafold2"` (default) | `"alphafold3"`
- `sequence` or `fasta_file`: for simple single-chain
- `sequences`: list of entity objects for multi-chain or AF3 with ligands/DNA/RNA
- `model_seeds`: list of ints (AF3 only, default `[42]`)

**AF2 sequences format**: `{"protein": {"id": "A", "sequence": "..."}}`
**AF3 ligand format**: `{"ligand": {"id": "Z", "ccdCodes": ["ATP"]}}` or `{"ligand": {"id": "Z", "smiles": "..."}}`

---

### Mutation Effect Prediction

#### `venusrem-mutation-prediction`
Predicts effect of every single-point mutation across the sequence.

```bash
# Light mode — sequence only, faster
matwings-venus-cli venusrem-mutation-prediction \
  --body '{"task": "stability", "mode": "light", "sequence": "MKTAY..."}'

# Pro mode — requires PDB structure, more accurate
matwings-venus-cli venusrem-mutation-prediction \
  --body '{"task": "activity", "mode": "pro", "structure_file": "oss://..."}'
```

Required: `task` + `mode`
- `task`: `activity` | `binding` | `stability` | `expression` | `general`
- `mode`: `pro` (needs `structure_file`) | `light` (needs `sequence` or `fasta_file`)

**Decision rule**: Use `pro` when a PDB structure is available; use `light` otherwise.

#### `venusprime-multipoint-prediction`
Predicts effects of multi-point combination mutations. Requires two steps.

**Step 1 — Train** (requires experimental fitness data):
```bash
matwings-venus-cli venusprime-multipoint-prediction \
  --body '{
    "mode": "train",
    "sequence": "MKTAY...",
    "experiment_file": "oss://bucket/mutations.csv",
    "score_col_name": "fitness",
    "model_num": 5
  }'
# Poll until success → result.model_path_list contains trained model URLs
```

The `experiment_file` CSV must have a `mutant` column (e.g., `A10V:S25T`) and a score column.

**Step 2 — Inference**:
```bash
matwings-venus-cli venusprime-multipoint-prediction \
  --body '{
    "mode": "inference",
    "model_path_list": ["oss://...model_0.pkl", "..."],
    "site": [10, 25, 42]
  }'
```

- `site`: residue positions to combine for multi-point mutations (default `[2,3,4]`)
- `model_path_list`: list of OSS URLs from train step result

---

### Functional Site Prediction

#### `predict-functional-residue`
General functional residue prediction using protein language models.

```bash
matwings-venus-cli predict-functional-residue \
  --body '{"sequence": "MKTAY...", "task": "Activity Site", "model_name": "ESM2-650M"}'
```

- `task`: `Activity Site` | `Binding Site` | `Conserved Site` | `Motif`
- `model_name`: `ESM2-650M` (default, fast) | `Ankh-large` | `ProtT5-xl-uniref50`

#### `venusx-functional-residue-prediction`
VenusX model — higher accuracy for activity/binding/evolutionary conserved sites.

```bash
matwings-venus-cli venusx-functional-residue-prediction \
  --body '{"sequence": "MKTAY...", "task": "VenusX-Activity", "mode": "pro"}'
```

- `task`: `VenusX-Activity` | `VenusX-Binding` | `VenusX-Evo`
- `mode`: `pro` (Ankh-large, default, better) | `light` (ESM2-650M, faster)

#### `venusg-protein-function-prediction`
Protein-level property prediction (not residue-level).

```bash
matwings-venus-cli venusg-protein-function-prediction \
  --body '{"sequence": "MKTAY...", "task": "VenusG-Solubility"}'
```

- `task` options: `VenusG-Solubility`, `VenusG-SubcellularLocalization`, `VenusG-MembraneProtein`, `VenusG-Metalionbinding`, `VenusG-Stability`, `VenusG-Sortingsignal`, `VenusG-OptimumTemperature`, `VenusG-Kcat`, `VenusG-OptimalPH`
- `mode`: `light` (ProtBert, default) | `pro` (ESM2-650M)

#### `predict-protein-properties`
Physicochemical properties (MW, pI, instability, etc.) and structural features.

```bash
matwings-venus-cli predict-protein-properties \
  --body '{"sequence": "MKTAY...", "task_name": "Physical and chemical properties"}'
```

- `task_name`: `Physical and chemical properties` | `Relative solvent accessible surface area (PDB only)` | `SASA value (PDB only)` | `Secondary structure (PDB only)`
- Note: SASA/secondary structure tasks require a PDB file, not a sequence.

---

### Protein-Ligand Docking

#### `diffdock-protein-ligand-docking`
Flexible docking of small molecules to proteins using DiffDock.

```bash
# With known PDB structure
matwings-venus-cli diffdock-protein-ligand-docking \
  --body '{
    "protein_path": "oss://bucket/receptor.pdb",
    "ligand": "CC(=O)Oc1ccccc1C(=O)O",
    "num_poses": 10
  }'

# From sequence (auto-folds with ESMFold)
matwings-venus-cli diffdock-protein-ligand-docking \
  --body '{"protein_sequence": "MKTAY...", "ligand": "CC(=O)..."}'
```

- Provide `protein_path` (PDB OSS URL) OR `protein_sequence` (auto-folded)
- `ligand`: SMILES string OR OSS URL to SDF/MOL2 file
- For batch docking: `protein_ligand_csv` OSS URL to CSV with columns `complex_name`, `protein_path`, `ligand_description`, `protein_sequence`

---

### Molecular Dynamics

#### `gromacs-md`
Build system and run production MD simulation. Long-running (hours to days).

```bash
matwings-venus-cli gromacs-md \
  --body '{
    "pdb_file": "oss://bucket/protein.pdb",
    "force_field": "amber99sb-ildn",
    "water_model": "tip3p",
    "temp": "300",
    "md_steps": "50000"
  }'
# Poll frequently — this can take hours
```

Required: `pdb_file` (OSS URL to PDB)
Result contains: `tpr_file` and `xtc_file` OSS URLs for use in `gromacs-analysis`.

#### `gromacs-analysis`
Analyze trajectory from a completed `gromacs-md` run (RMSD, RMSF, Rg, etc.).

```bash
matwings-venus-cli gromacs-analysis \
  --body '{
    "tpr_file": "oss://bucket/md.tpr",
    "xtc_file": "oss://bucket/md.xtc"
  }'
```

Both `tpr_file` and `xtc_file` are required and come from `gromacs-md` result.

---

### Protein Design

#### `venusmine-protein-mining`
Mine novel functional protein variants from a template structure.

```bash
matwings-venus-cli venusmine-protein-mining \
  --body '{"pdb_file": "oss://bucket/template.pdb"}'
```

#### `proteinmpnn-sequence-design`
Design new sequences for an existing protein backbone.

```bash
matwings-venus-cli proteinmpnn-sequence-design \
  --body '{
    "pdb_path": "oss://bucket/backbone.pdb",
    "designed_chains": ["A"],
    "fixed_chains": ["B"],
    "num_sequences": 4,
    "temperatures": [0.1]
  }'
```

- If no `designed_chains`/`fixed_chains` specified, all chains are designed
- Lower `temperatures` → sequences closer to natural proteins (more conservative)
- `homomer: true` → enforces sequence symmetry across chains

#### `rfdiffusion-protein-design`
Generate novel protein structures via diffusion. Most flexible design tool.

Three main modes:

```bash
# 1. Unconditional: generate a protein of given length
matwings-venus-cli rfdiffusion-protein-design \
  --body '{"length": "100-150", "num_designs": 5}'

# 2. Motif scaffolding: embed a functional motif into a new scaffold
matwings-venus-cli rfdiffusion-protein-design \
  --body '{
    "input_pdb": "oss://bucket/motif.pdb",
    "contig": "A10-20,60-80",
    "num_designs": 10
  }'

# 3. Binder design: design a protein binder to a target
matwings-venus-cli rfdiffusion-protein-design \
  --body '{
    "input_pdb": "oss://bucket/target.pdb",
    "hotspots": "A30,A55,A100",
    "length": "80-120",
    "num_designs": 10
  }'
```

Contig syntax: `A10-20` = residues 10-20 of chain A (fixed); `80` = 80 new residues (generated)

---

### Utility Commands

#### `upload-file-base-64` (synchronous)
```bash
CONTENT=$(base64 -w 0 protein.pdb)
matwings-venus-cli upload-file-base-64 \
  --body "{\"filename\": \"protein.pdb\", \"content_base64\": \"$CONTENT\"}"
# result.url is the OSS URL
```

#### `get-tool-result`
```bash
matwings-venus-cli get-tool-result --tool-call-id <id>
```
Returns full result including `tool_result` data, `slurm_tasks` (GPU/CPU job details), and timing.

#### `cancel-tool-result`
```bash
matwings-venus-cli cancel-tool-result --tool-call-id <id>
```
Cancels pending or running jobs including underlying Slurm tasks.

---

## Decision Guide

| Task | Use |
|------|-----|
| Quick structure from sequence | `esmfold-protein-folding` |
| Accurate structure, single protein | `alphafold-protein-folding` (AF2) |
| Structure with DNA/RNA/ligands | `alphafold-protein-folding` (AF3) |
| Where does this enzyme act? | `venusx-functional-residue-prediction` task=VenusX-Activity |
| Which residues bind a ligand? | `venusx-functional-residue-prediction` task=VenusX-Binding |
| Is this protein soluble? | `venusg-protein-function-prediction` task=VenusG-Solubility |
| Effect of all single mutations | `venusrem-mutation-prediction` |
| Best multi-point mutation combo | `venusprime-multipoint-prediction` (train → inference) |
| Dock a drug molecule | `diffdock-protein-ligand-docking` |
| MD simulation | `gromacs-md` → `gromacs-analysis` |
| Design sequences for backbone | `proteinmpnn-sequence-design` |
| Build new protein from scratch | `rfdiffusion-protein-design` |
| Embed motif in new scaffold | `rfdiffusion-protein-design` (contig mode) |
| MW/pI/instability index | `predict-protein-properties` |

## Error Handling

- `status: error` → check `error_message` field in `get-tool-result` response
- HTTP 422 → validation error; print `detail` array; fix parameters and resubmit
- HTTP 401 → `API_BEARER_TOKEN` not set or invalid
- Jobs stuck in `running` > 2 hours → consider using `cancel-tool-result` and resubmitting
