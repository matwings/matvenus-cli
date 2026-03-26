import { Command } from 'commander';
import { register as register_predict_functional_residue } from './predict_functional_residue';
import { register as register_venusx_functional_residue_prediction } from './venusx_functional_residue_prediction';
import { register as register_venusg_protein_function_prediction } from './venusg_protein_function_prediction';
import { register as register_predict_protein_properties } from './predict_protein_properties';
import { register as register_esmfold_protein_folding } from './esmfold_protein_folding';
import { register as register_alphafold_protein_folding } from './alphafold_protein_folding';
import { register as register_diffdock_protein_ligand_docking } from './diffdock_protein_ligand_docking';
import { register as register_venusrem_mutation_prediction } from './venusrem_mutation_prediction';
import { register as register_venusprime_multipoint_prediction } from './venusprime_multipoint_prediction';
import { register as register_gromacs_md } from './gromacs_md';
import { register as register_gromacs_analysis } from './gromacs_analysis';
import { register as register_venusmine_protein_mining } from './venusmine_protein_mining';
import { register as register_proteinmpnn_sequence_design } from './proteinmpnn_sequence_design';
import { register as register_rfdiffusion_protein_design } from './rfdiffusion_protein_design';
import { register as register_get_tool_result } from './get_tool_result';
import { register as register_cancel_tool_result } from './cancel_tool_result';
import { register as register_upload_file_base_64 } from './upload_file_base_64';

export function registerCommands(program: Command, baseUrl: string): void {
  register_predict_functional_residue(program, baseUrl);
  register_venusx_functional_residue_prediction(program, baseUrl);
  register_venusg_protein_function_prediction(program, baseUrl);
  register_predict_protein_properties(program, baseUrl);
  register_esmfold_protein_folding(program, baseUrl);
  register_alphafold_protein_folding(program, baseUrl);
  register_diffdock_protein_ligand_docking(program, baseUrl);
  register_venusrem_mutation_prediction(program, baseUrl);
  register_venusprime_multipoint_prediction(program, baseUrl);
  register_gromacs_md(program, baseUrl);
  register_gromacs_analysis(program, baseUrl);
  register_venusmine_protein_mining(program, baseUrl);
  register_proteinmpnn_sequence_design(program, baseUrl);
  register_rfdiffusion_protein_design(program, baseUrl);
  register_get_tool_result(program, baseUrl);
  register_cancel_tool_result(program, baseUrl);
  register_upload_file_base_64(program, baseUrl);
}
